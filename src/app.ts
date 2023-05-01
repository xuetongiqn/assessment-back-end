import http from 'http';
import Koa from 'koa';
import serve from 'koa-static';
import WebSocketApi from './routes/ws';

// init Koa
const app = new Koa();

// set the static files service
app.use(serve('./public'));

// create and add websocket service to the server 
const server = http.createServer(app.callback());
const io = require('socket.io')(server);

// websocket settings
WebSocketApi(io);

export default server;