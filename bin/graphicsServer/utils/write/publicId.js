module.exports = (editions, fileId, write) => {
  const { id } = editions.filter(d => d.file.fileId === fileId)[0];

  write('editions.public.interactive.id', id);
};
