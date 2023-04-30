import { Socket } from "socket.io";


export function handleQuerySuccess(socket: Socket, data: object) {
  socket.send('callback', {
    resultCode: 1,
    data
  });
}

export function handleQueryFail(socket: Socket, errcode: string, errmsg: string, data: object) {
  socket.send('callback', {
    resultCode: -1,
    errcode,
    errmsg,
    data,
  })
}