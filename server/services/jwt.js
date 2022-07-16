const { expressjwt: jwt } = require('express-jwt');

module.exports = jwtF;
let expressApp = undefined
let unlessPath = []
const protectedRoot = require('./../routes/http')[1];

function jwtF(app) {
  expressApp = app
  for (const key in protectedRoot) {
    if (!protectedRoot[key].role) {
      if (protectedRoot[key].path.includes(':')) {
        unlessPath.push({ url: new RegExp(protectedRoot[key].path.split(':')[0] + ".*"), methods: [protectedRoot[key].method] })
      } else {
        unlessPath.push({ url: protectedRoot[key].path, methods: [protectedRoot[key].method] })
      }
    }
  }
  const APP_JWT = process.env.APP_JWT;
  return jwt({ secret: APP_JWT, algorithms: ['HS256'], isRevoked }).unless({
    path: unlessPath
  });
}

async function isRevoked(req, payload) {
  let isIn = false
  const urlCall = req.url.replace('/', '').split('/')
  for (const key in protectedRoot) {
    if (protectedRoot[key].method === req.method && protectedRoot[key].role) {
      const splitUrl = protectedRoot[key].path.split(':')
      if (splitUrl.length > 1) {
        const baseUrls = { url: splitUrl[0].replace(/\//g, ''), params: splitUrl.length - 1 }
        if ((urlCall[0] === baseUrls.url) && (baseUrls.params == urlCall.length - 1)) {
          if (payload.payload.role.some(item => protectedRoot[key].role.includes(item)) || protectedRoot[key].role.includes('*')) {
            isIn = true
          }
        }
      } else if (protectedRoot[key].path === req.url) {
        if (payload.payload.role.some(item => protectedRoot[key].role.includes(item)) || protectedRoot[key].role.includes('*')) {
          isIn = true
        }
      }
    }
  }
  if (!isIn) {
    throw new UnauthorizedRoleError()
  }
}

class UnauthorizedRoleError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedRoleError";
  }
}

