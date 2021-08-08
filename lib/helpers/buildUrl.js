module.exports = (baseUrl, options) => {
  const url = new URL(baseUrl);
  url.search = new URLSearchParams(options);
  return url.toString();
};
