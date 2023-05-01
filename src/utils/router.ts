import { Server, Socket } from "socket.io";

// Define the router, it is the routes handle class.
type Router = {
  tags: { [key: string]: () => {} },
  get: (tag: string, controller: (data: any, socket: Socket, server: Server) => {}) => void,
  use: (tag: string, data:any, server: Server, socket: Socket) => void,
}

function Router(this: Router) {
  this.tags = {};
}
Router.prototype.get = function (tag: string, controller: () => {}) {
  this.tags[tag] = controller;
}
Router.prototype.use = function (tag: string, data:any, server: Server, socket: Socket) {
  this.server = server;
  this.socket = socket;

  const fn = this.tags[tag];
  fn && fn(data, socket, server);
}

export default Router;