const fetchToken = require('./fetch/token');
const fetchEvent = require('./fetch/event');
const fetchLanguages = require('./fetch/languages');
const fetchLocation = require('./fetch/location');
const fetchTopics = require('./fetch/topics');
const postPack = require('./create/pack');
const postPackage = require('./create/package');
const getLocaleContext = require('./getLocaleContext');
const getPkgProp = require('./utils/getPackageProp');
const setPkgProp = require('./utils/setPackageProp');
const logger = require('./logger')();

class ServerRequest {
  constructor(locale) {
    this.locale = locale;
    this.context = getLocaleContext(locale);
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
      logger.info('created graphic');
    }
  }

  async createMediaPkg() {
    const { locale, token } = this;
    const { workspace, graphicId } = getPkgProp('reuters');
    const graphic = await postPackage(workspace, graphicId, locale, token);
    console.log('**GRAPHIC', JSON.stringify(graphic, null, 2));
  }

  async create() {
    try {
      await this.getToken();
      await this.getLanguage();
      await this.getLocation();
      await this.getEvent();
      await this.getTopics();
      await this.createGraphicPack();
      await this.createMediaPkg();
    } catch (e) {
      logger.error(e);
    }
  }

  async publish() {
    try {
      await this.getToken();
      await this.getLanguage();
      await this.getLocation();
      await this.getEvent();
      await this.getTopics();
      await this.createGraphic();
    } catch (e) {
      logger.error(e);
    }

    console.log(this.context);
  }
}

const request = new ServerRequest('en');

request.create();
