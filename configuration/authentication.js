const {
  addUserToRequestFromJWT
} = require('@learnersguild/idm-jwt-auth/lib/middlewares')
const { idmGraphQLFetch } = require('@learnersguild/idm-jwt-auth/lib/utils')

const { IDM_BASE_URL, BASE_URL, GAME_BASE_URL } = process.env

const init = function( app ) {
  app.use( addUserToRequestFromJWT )
  app.use(( request, response, next ) => {
    if ( request.user === undefined ) {
      return response.redirect(
        `${IDM_BASE_URL}/sign-in?redirect=${BASE_URL}`
      )
    }
    next()
  })


  app.use((request, response, next) => {
    request.queryIdm = ( query, variables={} ) => {
      return idmGraphQLFetch({ query, variables }, request.cookies.lgJWT )
    }
    request.queryGame = ( query, variables={} ) => {
      return gameGraphQLFetch({ query, variables }, request.cookies.lgJWT )
    }

    next()
  })
}

const gameGraphQLFetch = function(graphQLParams, token = null) {
  if (!GAME_BASE_URL) {
    throw new Error('GAME_BASE_URL must be set in environment')
  }
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'LearnersGuild-Skip-Update-User-Middleware': 1,
    },
    body: JSON.stringify(graphQLParams),
  }
  if (token) {
    options.headers = Object.assign(options.headers, {
      Authorization: `Bearer ${token}`,
    })
  }

  return fetch(`${GAME_BASE_URL}/graphql`, options)
    .then(resp => {
      if (!resp.ok) {
        throw new Error(`GraphQL ERROR: ${resp.statusText}`)
      }
      return resp.json()
    })
    .then(graphQLResponse => {
      if (graphQLResponse.errors && graphQLResponse.errors.length) {
        const allErrors = graphQLResponse.errors.map(err => {
          return err.message
        }).join('\n')
        throw new Error(allErrors)
      }
      return graphQLResponse
    })
}

module.exports = { init }
