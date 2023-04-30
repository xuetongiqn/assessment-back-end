import http from 'http';
import Koa from 'koa';
import serve from 'koa-static';
import WebSocketApi from './routes/ws';

const app = new Koa();
app.use(serve('./public'));

const server = http.createServer(app.callback());
const io = require('socket.io')(server);

WebSocketApi(io);

export default server;