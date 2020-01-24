const fetchToken = require('./fetch/token');
const fetchEvent = require('./fetch/event');
const fetchLanguages = require('./fetch/languages');
const fetchLocation = require('./fetch/location');
const fetchTopics = require('./fetch/topics');
const fetchPack = require('./fetch/pack');
const fetchPublicUrl = require('./fetch/publicUrl');
const postPack = require('./create/pack');
const postDummyPackage = require('./create/dummyPackage');
const updatePack = require('./update/pack');
const updatePackage = require('./update/package');
const getLocaleContext = require('./getLocaleContext');
const getPkgProp = require('./utils/getPackageProp');
const setPkgProp = require('./utils/setPackageProp');
const getLocaleProp = require('./utils/getLocaleProp');
const setLocaleProp = require('./utils/setLocaleProp');
const keyBy = require('lodash/keyBy');
const logger = require('./logger')();

class ServerRequest {
  constructor(locale) {
    this.locale = locale;
    this.context = getLocaleContext(locale);
    this.getLocaleProp = getLocaleProp(locale);
    this.setLocaleProp = setLocaleProp(locale);
  }

  async getToken() {
    this.token = await fetchToken();
    logger.info('got token');
  }

  async getLanguage() {
    const { token, locale } = this;
    const languages = await fetchLanguages(token);

    this.context.metadata.graphic.language = languages[locale].lookupRef;
    logger.info('got language');
  }

  async getLocation() {
    const { token } = this;
    this.context.metadata.graphic.location = await fetchLocation(token);
    logger.info('got location');
  }

  async getEvent() {
    const { slugline } = this.context.metadata.graphic;
    const { token, locale } = this;
    const event = await fetchEvent(slugline, locale, token);
    this.context.metadata.eventId = event.Id;
    logger.info('got event');
  }

  async getTopics() {
    const { token } = this;
    const { eventId } = this.context.metadata;
    const topics = await fetchTopics(eventId, token);
    this.context.metadata.graphic.topicCodes = topics;
    logger.info('got topics');
  }

  async createGraphicPack() {
    const { context, token } = this;
    const { workspace, graphicId } = getPkgProp('reuters');
    if (!workspace || !graphicId) {
      const { workspace, graphicId } = await postPack(context.metadata, token);
      setPkgProp('reuters.workspace', workspace);
      setPkgProp('reuters.graphicId', graphicId);
      logger.info('created graphic pack');
    }
  }

  async createDummyMediaPkg() {
    const { locale, token } = this;
    const { workspace, graphicId } = getPkgProp('reuters');
    const graphic = await postDummyPackage(workspace, graphicId, locale, token);
    const { editions } = graphic;
    const editionsObj = keyBy(editions, e => e.editionName);
    // Set each edition.
    this.setLocaleProp('editions.interactive.id', editionsObj.interactive.editionId);
    this.setLocaleProp('editions.media-interactive.id', editionsObj['media-interactive'].editionId);

    this.context.metadata.graphic.editions = editions.slice();
    logger.info('created initial graphic package');
  }

  async updateGraphicPack() {
    const { context, token } = this;
    const { metadata } = context;
    const { workspace, graphicId } = getPkgProp('reuters');

    metadata.graphic.editions = metadata.graphic.editions.map((edition) => {
      const isMedia = edition.editionName === 'media-interactive';
      edition.changed = true;
      edition.allowCatalog = true;
      edition.repositories = edition.repositories.map((repo) => {
        repo.changed = true;
        repo.publish = !isMedia;
        repo.repositoryType = isMedia ? 'Media' : 'Public';
        return repo;
      });
      return edition;
    });

    const graphic = await updatePack(workspace, graphicId, metadata, token);
    const editionsObj = keyBy(graphic.editions, e => e.editionName);

    const { repositoryId } = editionsObj.interactive.repositories[0];
    this.setLocaleProp('editions.interactive.repositoryId', repositoryId);
    logger.info('updated graphic pack');
  }

  async getPack() {
    const { token } = this;
    const { workspace, graphicId } = getPkgProp('reuters');
    const pack = await fetchPack(workspace, graphicId, token);
    this.context.metadata.graphic = pack;
    logger.info('got pack');
  }

  async getPublicUrl() {
    const { token } = this;
    const { workspace, graphicId } = getPkgProp('reuters');
    const { id: editionId, repositoryId } = this.getLocaleProp('editions.interactive');
    const { url } = await fetchPublicUrl(workspace, graphicId, editionId, repositoryId, token);
    this.setLocaleProp('editions.interactive.url', url);
    logger.info('got public URL');
  }

  async updateGraphicPackage() {
    const { locale, token } = this;
    const { workspace, graphicId } = getPkgProp('reuters');
    const { id: interactiveEdition } = this.getLocaleProp('editions.interactive');
    const { id: mediaEdition } = this.getLocaleProp('editions.media-interactive');
    const editionIds = [interactiveEdition, mediaEdition];
    await updatePackage(workspace, graphicId, locale, editionIds, token);
    logger.info('updated graphic package');
  }

  async create() {
    logger.info('creating graphic');
    try {
      await this.getToken();
      await this.getLanguage();
      await this.getLocation();
      await this.getEvent();
      await this.getTopics();
      await this.createGraphicPack();
      await this.createDummyMediaPkg();
      await this.updateGraphicPack();
      await this.getPublicUrl();
    } catch (e) {
      logger.error(e);
    }
  }

  async update() {
    logger.info('updating graphic');
    try {
      await this.getToken();
      await this.getPack();
      await this.getEvent();
      await this.getTopics();
      await this.updateGraphicPack();
      await this.updateGraphicPackage();
    } catch (e) {
      logger.error(e);
    }
  }

  async publish() {
    const { workspace, graphicId } = getPkgProp('reuters');
    if (workspace && graphicId) {
      await this.update();
    } else {
      await this.create();
    }
  }
}

const request = new ServerRequest('en');

request.publish();
