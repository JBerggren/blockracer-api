var config = {}

config.host = process.env.DOCUMENT_DB_HOST;
config.authKey = process.env.AUTH_KEY;
config.googleClientId = process.env.GOOGLE_CLIENT_ID;
config.googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
config.googleRedirectUrl = process.env.GOOGLE_REDIRECT_URL;
config.jwtKey = process.env.JWT_KEY;
config.databaseId = "Blockracer";
config.collectionId = "Games";

module.exports = config;