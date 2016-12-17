import http from 'http'
import Express from 'express'
import {HTTPS as https} from 'express-sslify'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import {
  addUserToRequestFromJWT,
  extendJWTExpiration,
  refreshUserFromIDMService
} from '@learnersguild/idm-jwt-auth/lib/middlewares'


const app = new Express()
const httpServer = http.createServer(app)

// parse cookies
  app.use(cookieParser())

// ensure secure connection
if (process.env.NODE_ENV === 'production') {
  app.use(https({trustProtoHeader: true}))
}

// integrate with IDM
process.env.IDM_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://idm.learnersguild.org' : 'http://idm.learnersguild.dev'
process.env.JWT_PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvjQP9ktgn9Y5e1DQ2Gpj\nJaYv+0br6kvmRESfDT9sMtOpl7JGbUxdseEW7a0pg+5htyjsTzoYC0qni72Giw+Q\newQ1geW75qRmWTa4fVCDvPgOtux+UvrxIsDmWm3YpSbmvbYKyjps4d+gRaRFGkTZ\nTPAHGlc7O55OAmqJeTebugVppB3qZmn5mKJY/fwUqGV5LRPapDtqKKDbiQqP+kY3\nT7bO5lKW82vF6t6Es3DoynokIRrTlyASkdDhRDBgpOSuu5QOZKcH0HpMM8blWHlb\nDjlNNxNgSvBbI23biZ0XtyhDmfLSamf/6xlPYql/8CVDxRxeMRqGvcPMGgEt3OIB\nlQIDAQAB\n-----END PUBLIC KEY-----'
const foo = (req, res, next) => {
  console.log('entered foo')
  next()
}

app.use(foo)

app.use(addUserToRequestFromJWT)

app.use(session({ secret: 'anything' }));

app.get('/', (req, res, next) => {
  const redirectTo = encodeURIComponent('http://idm-example.learnersguild.dev')
  console.log({user: req.user})
  if (!req.user) {
    res.redirect(`${process.env.IDM_BASE_URL}/sign-in?redirect=${redirectTo}`)
    return next()
  }
  res.send(`
    <h1>User ID: ${req.user.id}</h1>
    <p>
      <a href="${process.env.IDM_BASE_URL}/auth/sign-out">Sign-out</a>
    </p>
  `)
  //res.send('hello there')
  next()
})

httpServer.listen(9999, error => {
  if (error) {
    console.error(error)
  } else {
    console.info(`🌍  Listening on port 9999`)
  }
})
