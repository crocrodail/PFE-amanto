const Home = require('../controllers/http/HomeController.js')
const Auth = require('../controllers/http/AuthController.js')

const configRoute = [

  { method: 'GET', path: '/', controller: Home.getAll },

  /*--- AUTH ---*/
  { method: 'POST', path: '/auth/login', controller: Auth.login },
  { method: 'POST', path: '/auth/register', controller: Auth.register },
  { method: 'POST', path: '/auth/forgetpassword', controller: Auth.forgetPassword },
  { method: 'POST', path: '/auth/reset', controller: Auth.resetPassword },
  /*--- AUTH ---*/

]


module.exports = [(app) => {

  for (const key in configRoute) {
    switch (configRoute[key].method) {
      case 'GET':
        app.get(configRoute[key].path, configRoute[key].controller)
        break;
      case 'POST':
        app.post(configRoute[key].path, configRoute[key].controller)
        break;
      case 'PUT':
        app.put(configRoute[key].path, configRoute[key].controller)
        break;
      case 'DELETE':
        app.delete(configRoute[key].path, configRoute[key].controller)
        break;
      default:
        break;
    }
  }

}, configRoute]
