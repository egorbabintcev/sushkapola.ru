const env = process.env.NODE_ENV;

module.exports = env => {
  console.log(`🛠️ Running in ${env} mode\n`);
  return require(`./config/webpack.config.${env}.js`);
}
