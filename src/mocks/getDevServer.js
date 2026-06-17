// Mock for getDevServer
const getDevServer = () => {
  return {
    url: typeof window !== 'undefined' && window.location ? window.location.href : 'http://localhost:8081',
    bundleLoadedFromServer: false,
  };
};

module.exports = getDevServer;
