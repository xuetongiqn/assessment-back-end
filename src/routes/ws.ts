import { Server, Socket } from "socket.io";
import router from "./routers";

const WebSocketApi = (server: Server) => {
  server.on('connection', function (socket: Socket) {
    console.log('connected')
    socket.on('error', console.error);

    socket.on('message', function (tag, data) {
      router.use(tag, data, server, socket);
    });

    router.use('todoList',{}, server, socket);
    router.use('completedList',{}, server, socket);
});
}

export default WebSocketApi;