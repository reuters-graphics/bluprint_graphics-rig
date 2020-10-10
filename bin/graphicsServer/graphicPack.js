const path = require('path');
const chalk = require('chalk');
const prompts = require('prompts');
const ServerClient = require('@reuters-graphics/server-client');
const getCredentials = require('./utils/getCredentials');
const getProfile = require('./utils/getProfile');
const addTrelloAttachment = require('./utils/trello/addAttachment');
const zipDir = require('./utils/zipDir');
const getPkgProp = require('../../config/utils/getPackageProp');
const setPkgProp = require('../../config/utils/setPackageProp');
const localePropGetter = require('../../config/utils/getLocaleProp');
const localePropSetter = require('../../config/utils/setLocaleProp');
const getLocales = require('../../config/utils/getLocales');
const PackMetadata = require('./metadata/Pack');
const EditionMetadata = require('./metadata/Edition');

class GraphicPack extends PackMetadata {
  constructor(locale = 'en') {
    super(locale);
    this.locale = locale;
    this.locales = getLocales();
    this.credentials = getCredentials();
    this.profile = getProfile();
    this.graphicId = getPkgProp('reuters.graphicId');
  }

  setLocale(locale) {
    this.getLocaleProp = localePropGetter(locale);
    this.setLocaleProp = localePropSetter(locale);
  }

  async createPack() {
    if (this.graphicId) return;
    this.client = new ServerClient(this.credentials);
    await this.client.createGraphic(this.metadata);
    this.graphicId = this.client.graphic.id;
    setPkgProp('reuters.graphicId', this.graphicId);
  }

  async updatePack() {
    if (!this.graphicId) return;
    const { username, password, apiKey } = this.credentials;
    this.client = new ServerClient({
      username,
      password,
      apiKey,
      graphic: {
        id: this.graphicId,
      },
    });
    await this.client.updateGraphic(this.metadata);
  }

  async createEditions(locale) {
    this.setLocale(locale);
    if (this.getLocaleProp('editions.interactive.page')) return;
    this.editions = new EditionMetadata(locale);
    const dummyArchive = path.join(__dirname, 'dummy');
    const fileBuffer = await zipDir(dummyArchive, locale);
    const editions = await this.client.createEditions(`${locale}.zip`, fileBuffer, this.editions.metadata);
    const { url } = editions[`${locale}.zip`].interactive;
    this.setLocaleProp('editions.interactive.page', url);
    this.setLocaleProp('editions.interactive.embed', `${url}media-embed.html`);
    await addTrelloAttachment(`${locale.toUpperCase()} page`, url);
    await addTrelloAttachment(`${locale.toUpperCase()} embed`, `${url}media-embed.html`);
  }

  async updateEditions(locale) {
    this.setLocale(locale);
    let url = this.getLocaleProp('editions.interactive.embed');
    if (!url) {
      await this.createEditions(locale);
      url = this.getLocaleProp('editions.interactive.embed');
    }
    this.editions = new EditionMetadata(locale);
    this.editions.setEmbed(url);
    const editionArchive = path.join(process.cwd(), `packages/${locale}`);
    const fileBuffer = await zipDir(editionArchive, locale);
    await this.client.updateEditions(`${locale}.zip`, fileBuffer, this.editions.metadata);
  }

  logUrls(locale) {
    this.setLocale(locale);
    console.log(chalk`\n{cyan Public URLs for} {green.underline ${locale}}:`);
    console.log(chalk`Embed: {yellow ${this.getLocaleProp('editions.interactive.embed')}}`);
    console.log(chalk`Page: {yellow ${this.getLocaleProp('editions.interactive.page')}}\n`);
  }

  async createGraphicEditions() {
    await this.createPack();
    for (const locale of this.locales) {
      await this.createEditions(locale);
    }
  }

  async updateGraphicEditions() {
    await this.updatePack();
    for (const locale of this.locales) {
      await this.updateEditions(locale);
    }
  }

  async publishGraphic() {
    if (!this.graphicId) return;
    const { username, password, apiKey } = this.credentials;
    this.client = new ServerClient({
      username,
      password,
      apiKey,
      graphic: {
        id: this.graphicId,
      },
    });

    const questions = [{
      type: 'confirm',
      name: 'isCorrection',
      message: 'Are you publishing a correction?',
      initial: false,
    }, {
      type: 'confirm',
      name: 'publishToLynx',
      message: 'Should this graphic be published to Lynx (available to Reuters staff)?',
      initial: false,
    }, {
      type: 'confirm',
      name: 'publishToMedia',
      message: 'Should this graphic be published to Connect (available to clients)?',
      initial: false,
    }];

    const { isCorrection, publishToLynx, publishToMedia } = await prompts(questions);

    const MEDIA = publishToMedia ? ['media-interactive'] : false;
    const LYNX = publishToLynx ? ['interactive'] : false;

    await this.client.updateGraphic(this.metadata);
    await this.client.publishGraphic([], MEDIA, LYNX, isCorrection);
    for (const locale of this.locales) {
      this.logUrls(locale);
    }
  }
};

module.exports = GraphicPack;
