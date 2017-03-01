module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: 'src/*.spec.ts', watched: false }
    ]
  });
};
