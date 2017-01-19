const {findAllUsers} = require('../io/database/users')
const {refreshAccessTokenAsync} = require('../io/gateway/google_calendar')
const init = function() {
  const interval = 1000 * 60 * 10
  setInterval(function() {
    findAllUsers()
      .then(users => {
          users.map(user => refreshAccessTokenAsync(user.access_token,
                                                    user.google_refresh_token,
                                                    user.github_handle))
          console.log('done refreshing google access tokens');
      });
  }, interval)
}

module.exports = {init};
