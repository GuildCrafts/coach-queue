const google = require('googleapis')
const plus = google.plus('v1')
const OAuth2 = google.auth.OAuth2
const config = require('../../config/config').readConfig()
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENTID || config.google.clientID,
  process.env.GOOGLE_CLIENT_SECRET || config.google.client_secret,
  config.google.callbackURLPath
);
const { updateUserByHandle } = require('../database/users')

const refreshAccessTokenAsync = (access_token, refresh_token, github_handle) => {
  oauth2Client.setCredentials({
    refresh_token: refresh_token
  });

  oauth2Client.refreshAccessToken(function(err, tokens) {
    if(err) { console.error('error getting back a token from Google.')}
    else {
      updateUserByHandle(github_handle,
                         {google_token: tokens.access_token})
    }
  });
};

module.exports = {refreshAccessTokenAsync};
