import { Server, Socket } from "socket.io";
import router from "./routers";

// Setting the websocket here. Binding the socket message and handle in router.
// Every client connected, send the todo list and done list by default.
const WebSocketApi = (server: Server) => {
  server.on('connection', function (socket: Socket) {
    console.log('connected')
    socket.on('error', console.error);

    // all the client message received here
    socket.on('message', function (tag, data) {
      router.use(tag, data, server, socket);
    });

    // send the todo list and done list by default.
    router.use('todoList',{}, server, socket);
    router.use('completedList',{}, server, socket);
});
}

export default WebSocketApi;