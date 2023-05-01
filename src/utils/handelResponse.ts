import { Socket } from "socket.io";

// handle the success action, send callback
export function handleQuerySuccess(socket: Socket, data: object) {
  socket.send('callback', {
    resultCode: 1,
    data
  });
}

// handle the error action, send callback
export function handleQueryFail(socket: Socket, errcode: string, errmsg: string, data: object) {
  socket.send('callback', {
    resultCode: -1,
    errcode,
    errmsg,
    data,
  })
}