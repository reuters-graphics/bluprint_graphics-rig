module.exports = async(e, retry = null) => {
  if (e.code === 'ENOTFOUND') {
    throw new Error('No connection');
  }

  const { response } = e;

  if (response) {
    if (response.status > 400 && retry) return retry();
    throw new Error(`${response.status}: ${response.statusText}`);
  } else {
    throw new Error(e.message);
  }
};
