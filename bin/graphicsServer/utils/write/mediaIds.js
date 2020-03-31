module.exports = (editions, fileId, write) => {
  const mediaEditions = editions.filter(d => d.file.fileId === fileId);

  const { id: mediaId } = mediaEditions.filter(d => d.title === 'media-interactive')[0];
  const { id: interactiveId } = mediaEditions.filter(d => d.title === 'interactive')[0];

  write('editions.media.media-interactive.id', mediaId);
  write('editions.media.interactive.id', interactiveId);
};
