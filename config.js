var config = {}

config.documentDbHost = process.env.DOCUMENT_DB_HOST;
config.authKey = process.env.AUTH_KEY;
config.databaseId = "Blockracer";
config.collectionId = "Games";

module.exports = config;