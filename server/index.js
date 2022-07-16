const app = require('express')();
const cors = require('cors')
const server = require('http').createServer(app);
const dotenv = require('dotenv').config()
const io = require('socket.io')(server, { cors: { origin: '*' } });
const jwt = require('./services/jwt');
const errorHandler = require('./services/errorHandler');
const port = process.env.APP_PORT || 3000;
const bodyParser = require('body-parser');
const formData = require("express-form-data");
const os = require("os");

app.use(cors());
app.use(formData.parse({ uploadDir: os.tmpdir(), autoClean: true }));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());
app.use(bodyParser.json());
app.use(jwt(app));

const route = require('./routes/http')[0](app)
const socket = require('./routes/WebSocket')(io)

app.use(errorHandler);

server.listen(port, () => {
  console.log(`App running on ${port}`)
});
