const fetchToken = require('./fetch/token');
const fetchEvent = require('./fetch/event');
const fetchLanguages = require('./fetch/languages');
const fetchLocation = require('./fetch/location');
const fetchTopics = require('./fetch/topics');
const fetchPack = require('./fetch/pack');
const fetchPublicUrl = require('./fetch/publicUrl');
const postPack = require('./create/pack');
const postDummyMediaPackage = require('./create/dummyMediaPackage');
const postDummyPublicPackage = require('./create/dummyPublicPackage');
const updatePack = require('./update/pack');
const updateMediaPackage = require('./update/mediaPackage');
const updatePublicPackage = require('./update/publicPackage');
const publishPack = require('./publish/pack');
const getDefaultContext = require('./getDefaultContext');
const getPkgProp = require('../../config/utils/getPackageProp');
const setPkgProp = require('../../config/utils/setPackageProp');
const getLocaleProp = require('../../config/utils/getLocaleProp');
const setLocaleProp = require('../../config/utils/setLocaleProp');
const Watch = require('./utils/stopwatch');
const logGraphic = require('./utils/logGraphic');
const keyBy = require('lodash/keyBy');
const prompts = require('prompts');
const chalk = require('chalk');
const logger = require('../../config/utils/logger')('Graphics Server');

class ServerRequest {
  constructor(locale) {
    this.locale = locale;
    this.context = getDefaultContext(locale);
    this.getLocaleProp = getLocaleProp(locale);
    this.setLocaleProp = setLocaleProp(locale);
  }

  async getToken() {
    this.token = await fetchToken();
    logger.info('got token');
  }

  async getLanguage() {
    const { token, locale } = this;
    const languages = await fetchLanguages(token, locale);

    // Temporary as long as some languages not returned by server
    this.languages = languages;

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
    const rootSlug = slugline.split('/')[0];
    const { token } = this;
    // Temporary as long as some languages not returned by server
    const locale = this.languages[this.locale].isoCode;
    const event = await fetchEvent(rootSlug, locale, token);
    if (!event) {
      this.context.metadata.eventId = null;
      logger.warn('No events found. Please add manually on the server later.');
      return;
    }
    this.context.metadata.eventId = event.Id;
    logger.info('got event');
  }

  async getTopics() {
    const { token } = this;
    const { eventId } = this.context.metadata;
    if (!eventId) {
      logger.warn('Unable to attach topics without an event. Please add manually on the server later.');
      return;
    }
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
    const graphic = await postDummyMediaPackage(workspace, graphicId, locale, token);
    const { editions } = graphic;
    const editionsObj = keyBy(editions, e => e.editionName);
    // Set each edition.
    this.setLocaleProp('editions.media.interactive.id', editionsObj.interactive.editionId);
    this.setLocaleProp('editions.media.media-interactive.id', editionsObj['media-interactive'].editionId);

    this.context.metadata.graphic.editions = editions.slice();
    logger.info('created initial media graphic package');
  }

  async createDummyPublicPkg() {
    const { locale, token } = this;
    const { workspace, graphicId } = getPkgProp('reuters');
    const graphic = await postDummyPublicPackage(workspace, graphicId, locale, token);
    const { editions } = graphic;
    const editionsObj = keyBy(editions, e => e.editionName);
    // Set each edition.
    this.setLocaleProp('editions.public.interactive.id', editionsObj.interactive.editionId);

    this.context.metadata.graphic.editions = this.context.metadata.graphic.editions.concat(editions.slice());
    logger.info('created initial public graphic package');
  }

  async updateGraphicPack() {
    const { context, token, locale } = this;
    const { metadata } = context;
    const { workspace, graphicId } = getPkgProp('reuters');

    metadata.graphic.editions = metadata.graphic.editions
      .filter(({ editionNamespace }) => (
        editionNamespace === `media-${locale}.zip` ||
        editionNamespace === `public-${locale}.zip`
      ))
      .map((edition) => {
        edition.changed = true;
        edition.allowCatalog = true;
        edition.repositories = edition.repositories.map((repo) => {
          repo.changed = true;
          repo.publish = repo.repositoryType === 'Public';
          return repo;
        });
        return edition;
      });

    const graphic = await updatePack(workspace, graphicId, metadata, token);

    const cleanNamespace = (text) => text.replace('.zip', '').replace(/-\w{2}$/, '');

    const editionsObj = keyBy(graphic.editions, e =>
      `${cleanNamespace(e.editionNamespace)}__${e.editionName}`);

    const { repositoryId: mediaRepositoryId } = editionsObj.media__interactive.repositories[0];
    this.setLocaleProp('editions.media.interactive.repositoryId', mediaRepositoryId);
    const { repositoryId: publicRepositoryId } = editionsObj.public__interactive.repositories[0];
    this.setLocaleProp('editions.public.interactive.repositoryId', publicRepositoryId);
    logger.info('updated graphic pack');
  }

  async getPack() {
    const { token } = this;
    const { workspace, graphicId } = getPkgProp('reuters');
    const pack = await fetchPack(workspace, graphicId, token);
    this.context.metadata.graphic = pack;
    logGraphic(pack);
    logger.info('got pack');
  }

  async putPack() {
    const { token } = this;
    const { workspace, graphicId } = getPkgProp('reuters');
    const pack = await publishPack(workspace, graphicId, token);
    logGraphic(pack);
    logger.info('Published pack!');
  }

  async getMediaUrl() {
    const { token } = this;
    const { workspace, graphicId } = getPkgProp('reuters');
    const { id: editionId, repositoryId } = this.getLocaleProp('editions.media.interactive');
    const { url } = await fetchPublicUrl(workspace, graphicId, editionId, repositoryId, token);
    this.setLocaleProp('editions.media.interactive.url', url.replace(/index\.html$/, ''));
    logger.info('got media URL');
  }

  async getPublicUrl() {
    const { token } = this;
    const { workspace, graphicId } = getPkgProp('reuters');
    const { id: editionId, repositoryId } = this.getLocaleProp('editions.public.interactive');
    const { url } = await fetchPublicUrl(workspace, graphicId, editionId, repositoryId, token);
    this.setLocaleProp('editions.public.interactive.url', url.replace(/index\.html$/, ''));
    logger.info('got public URL');
  }

  async updateGraphicPackages() {
    const { locale, token } = this;
    const { workspace, graphicId } = getPkgProp('reuters');
    await updateMediaPackage(workspace, graphicId, locale, token);
    await updatePublicPackage(workspace, graphicId, locale, token);
    logger.info('updated graphic packages');
  }

  async checkPublishDate() {
    const { publishDate } = getPkgProp('reuters');
    if (!publishDate) {
      const { date } = await prompts({
        message: 'When is this piece publishing?',
        mask: 'YYYY-MM-DD HH:mm',
        type: 'date',
        initial: new Date(),
        format: (value) => value.toISOString(),
        name: 'date',
      });
      setPkgProp('reuters.publishDate', date);
    }
  }

  async checkUpdateDate() {
    const { date } = await prompts([{
      type: 'confirm',
      name: 'confirm',
      message: 'Should we set an update date?',
      initial: true,
    }, {
      message: 'When should we say we\'ve updated this piece?',
      mask: 'YYYY-MM-DD HH:mm',
      type: prev => prev ? 'date' : null,
      initial: new Date(),
      format: (value) => value.toISOString(),
      name: 'date',
    }]);
    setPkgProp('reuters.updateDate', date);
  }

  async create() {
    logger.info(chalk`🌎 CREATING PACKAGES for {green.underline ${this.locale}} locale...`);
    try {
      const watch = new Watch();
      await this.getToken();
      await this.getLanguage();
      await this.getLocation();
      await this.getEvent();
      await this.getTopics();
      await this.createGraphicPack();
      await this.createDummyMediaPkg();
      await this.createDummyPublicPkg();
      await this.updateGraphicPack();
      await this.getMediaUrl();
      await this.getPublicUrl();
      watch.stop();
    } catch (e) {
      logger.error(e.message);
      process.exit(1);
    }
  }

  async update() {
    logger.info(chalk`🌎 UPLOADING PACKAGES for {green.underline ${this.locale}} locale...`);
    try {
      const watch = new Watch();
      await this.getToken();
      await this.getLanguage(); // Temporary as long as some languages not returned by server
      await this.getPack();
      await this.getEvent();
      await this.getTopics();
      await this.updateGraphicPack();
      await this.updateGraphicPackages();
      await this.getMediaUrl();
      await this.getPublicUrl();
      watch.stop();
    } catch (e) {
      logger.error(e.message);
      process.exit(1);
    }
  }

  async upload() {
    const { workspace, graphicId } = getPkgProp('reuters');
    if (workspace && graphicId) {
      await this.update();
    } else {
      await this.create();
    }
  }

  async createOnly() {
    const { workspace, graphicId } = getPkgProp('reuters');
    if (!workspace || !graphicId) {
      await this.create();
    }
  }

  async updateOnly() {
    const { workspace, graphicId } = getPkgProp('reuters');
    if (workspace && graphicId) {
      await this.update();
    }
  }

  async publish() {
    try {
      await this.getToken();
      await this.putPack();
      await this.getMediaUrl();
      await this.getPublicUrl();
    } catch (e) {
      logger.error(e.message);
      process.exit(1);
    }
  }
}

module.exports = ServerRequest;
