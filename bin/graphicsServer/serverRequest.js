const postToken = require('./post/token');
const postEdition = require('./post/edition');
const postGraphicPack = require('./post/graphicPack');
const postFileUpload = require('./post/fileUpload');
const getGraphic = require('./get/graphic');
const getSlugTerms = require('./get/slugTerms');
const getTopicCodes = require('./get/topicCodes');
const getLocation = require('./get/location');
const getPublicUrl = require('./get/publicUrl');
const putDummyMediaPkg = require('./put/dummyMediaPackage');
const putDummyPublicPkg = require('./put/dummyPublicPackage');
const putMediaPkg = require('./put/mediaPackage');
const putPublicPkg = require('./put/publicPackage');
const putGraphic = require('./put/graphic');
const putEdition = require('./put/edition');
const graphicMetaMixin = require('./mixins/graphicMeta');
const getPkgProp = require('../../config/utils/getPackageProp');
const setPkgProp = require('../../config/utils/setPackageProp');
const getLocaleProp = require('../../config/utils/getLocaleProp');
const setLocaleProp = require('../../config/utils/setLocaleProp');
const writeMediaIds = require('./utils/write/mediaIds');
const writePublicId = require('./utils/write/publicId');
const addTrelloAttachment = require('./utils/trello/addAttachment');
const prompts = require('prompts');
const logger = require('../../config/utils/logger')('Graphics Server');

class ServerRequest {
  constructor(locale) {
    this.locale = locale;
    this.getLocaleProp = getLocaleProp(locale);
    this.setLocaleProp = setLocaleProp(locale);
    this.getPkgProp = getPkgProp;

    Object.assign(this, graphicMetaMixin);
  }

  createToken = async() => {
    this.token = await postToken();
  }

  fetchTopicCodeIds = async() => {
    const rootSlug = this.getLocaleProp('slugs.root');
    const { event } = await getSlugTerms(rootSlug, this.token);
    this.topicCodeIds = event ? ['M:NT'].concat(event.topicCodes) : ['M:NT'];
  }

  fetchTopicCodes = async() => {
    this.topicCodes = await getTopicCodes(this.topicCodeIds, this.token);
  }

  fetchLocation = async() => {
    this.location = await getLocation(getPkgProp('reuters.desk'), this.token);
  }

  fetchGraphic = async() => {
    const { graphicId } = getPkgProp('reuters');
    this.graphic = await getGraphic(graphicId, this.token);
  }

  fetchEmbedUrl = async() => {
    const { graphicId } = getPkgProp('reuters');
    const editionId = this.getLocaleProp('editions.media.interactive.id');
    const { publishedURI } = await getPublicUrl(graphicId, editionId, this.token);
    const restfulURI = publishedURI.replace('index.html', '');
    this.setLocaleProp('editions.media.interactive.url', restfulURI);
    addTrelloAttachment(`${this.locale.toUpperCase()} embed`, restfulURI);
  }

  fetchInteractiveUrl = async() => {
    const { graphicId } = getPkgProp('reuters');
    const editionId = this.getLocaleProp('editions.public.interactive.id');
    const { publishedURI } = await getPublicUrl(graphicId, editionId, this.token);
    const restfulURI = publishedURI.replace('index.html', '');
    this.setLocaleProp('editions.public.interactive.url', restfulURI);
    addTrelloAttachment(`${this.locale.toUpperCase()} page`, restfulURI);
  }

  createGraphicPack = async() => {
    const graphic = await this.getGraphicMeta(this.token);
    this.graphic = await postGraphicPack(graphic, this.token);
    setPkgProp('reuters.graphicId', this.graphic.id);
  }

  createFileUpload = async(fileName) => {
    return postFileUpload(fileName, this.token);
  }

  createMediaEdition = async() => {
    const { id: fileId, uploadURI } = await postFileUpload(`media-${this.locale}.zip`, this.token);
    await putDummyMediaPkg(uploadURI, fileId, this.locale, this.token);
    await postEdition(this.graphic.id, fileId, this.token);
    this.mediaFileId = fileId;
  }

  createPublicEdition = async() => {
    const { id: fileId, uploadURI } = await postFileUpload(`public-${this.locale}.zip`, this.token);
    await putDummyPublicPkg(uploadURI, fileId, this.locale, this.token);
    await postEdition(this.graphic.id, fileId, this.token);
    this.publicFileId = fileId;
  }

  updateMediaEdition = async() => {
    const archive = `media-${this.locale}.zip`;
    const { id: fileId, uploadURI } = await postFileUpload(archive, this.token);
    await putMediaPkg(uploadURI, fileId, this.locale, this.token);
    // Refetch graphic so we get the latest modified time
    await this.fetchGraphic();
    const mediaEditions = this.graphic.editions.filter((e) =>
      e.file.fileName === archive).map(e => e.id);
    await putEdition(
      this.graphic.id,
      fileId,
      mediaEditions,
      this.graphic.modified,
      this.token
    );
    this.mediaFileId = fileId;
  }

  updatePublicEdition = async() => {
    const archive = `public-${this.locale}.zip`;
    const { id: fileId, uploadURI } = await postFileUpload(archive, this.token);
    await putPublicPkg(uploadURI, fileId, this.locale, this.token);
    // Refetch graphic so we get the latest modified time
    await this.fetchGraphic();
    const publicEditions = this.graphic.editions.filter((e) =>
      e.file.fileName === archive).map(e => e.id);
    await putEdition(
      this.graphic.id,
      fileId,
      publicEditions,
      this.graphic.modified,
      this.token
    );
    this.publicFileId = fileId;
  }

   create = async() => {
     // If a graphicId exists, skip greating the pack
     const { graphicId } = getPkgProp('reuters');
     await this.createToken();
     if (!graphicId) {
       await this.fetchTopicCodeIds();
       await this.fetchTopicCodes();
       await this.fetchLocation();
       await this.createGraphicPack();
     } else {
       await this.fetchGraphic();
     }
     // If editionId exists, skip making dummy package
     const publicEditionID = this.getLocaleProp('editions.public.interactive.id');
     if (publicEditionID) return;
     await this.createMediaEdition();
     await this.createPublicEdition();
     await this.fetchGraphic();
     const { editions } = this.graphic;
     // Save edition IDs
     writeMediaIds(editions, this.mediaFileId, this.setLocaleProp);
     writePublicId(editions, this.publicFileId, this.setLocaleProp);
     // Get and save public edition URLs
     await this.fetchInteractiveUrl();
     await this.fetchEmbedUrl();
   }

   update = async() => {
     await this.createToken();
     await this.fetchTopicCodeIds();
     await this.fetchTopicCodes();
     await this.fetchLocation();
     await this.fetchGraphic();

     // Update graphic metadata and re-put if en locale
     if (this.locale === 'en') {
       const graphicMeta = await this.getGraphicMeta(this.token);
       this.graphic = Object.assign(this.graphic, graphicMeta);
       const { graphicId } = getPkgProp('reuters');
       await putGraphic(graphicId, this.graphic, this.token);
     }

     await this.updateMediaEdition();
     await this.updatePublicEdition();

     await this.fetchGraphic();
   }

   publish = async() => {
     logger.info('Publishing graphic');
     await this.createToken();
     await this.fetchGraphic();

     const { published } = this.graphic.publishing;

     let correction = false;

     if (published) {
       const { confirm } = await prompts({
         type: 'confirm',
         name: 'confirm',
         message: 'Are you publishing a correction?',
         initial: false,
       });
       correction = confirm;
     }

     this.graphic.publishing.publish = true;

     this.graphic.editions.slice().forEach((edition, i) => {
       const { fileName } = edition.file;
       const regex = /(media|public)-[a-z]{2}\.zip/;
       if (!regex.test(fileName)) return;

       const { published, locations } = edition.publishing;

       const isMedia = locations[0].name === 'media-rngs';

       this.graphic.editions[i].publishing.locations[0].publish = !!isMedia;
       this.graphic.editions[i].publishing.promote = true;
       if (published) {
         this.graphic.editions[i].editStatus = correction ?
           'Correction' : 'Refresh';
       }
     });

     const { graphicId } = getPkgProp('reuters');
     await putGraphic(graphicId, this.graphic, this.token);
   }
}

module.exports = ServerRequest;
