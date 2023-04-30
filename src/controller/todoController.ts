import { Server, Socket } from "socket.io";
import * as TodoService from "../service/todoService";
import { handleQuerySuccess, handleQueryFail } from "../utils/handelResponse";
import errCode from "../config/errcode";

export type ActionData = {
  text: string;
  id: number;
  query: string;
  flag: boolean;
}

const boardcastLists = async function (server: Server): Promise<void> {
  try {
    const todoList = await TodoService.geTodoList();
    server.emit('message', 'todoList', {
      resultCode: 1,
      data: { list: todoList }
    });

    const completedList = await TodoService.geCompletedList(10);
    server.emit('message', 'completedList', {
      resultCode: 1,
      data: { list: completedList }
    });

  } catch (error: any) {
    console.error(error);
  }
}


export async function addTodo(data: ActionData, socket: Socket, server: Server): Promise<void> {
  const { text } = data

  try {
    const res = await TodoService.getTodoByText(text);
    if (res) {
      handleQueryFail(socket, errCode.DUPLICATE_ERROR, 'duplicate record', res);
      return;
    }

    const todo = await TodoService.addTodo(text)
    if (todo.get('id')) {
      handleQuerySuccess(socket, data);
      boardcastLists(server);
    } else {
      handleQueryFail(socket, errCode.SAVE_ERROR, 'save error', data);
    }
  } catch (error: any) {
    console.log(error.message)
    handleQueryFail(socket, errCode.SYSTEM_ERROR, 'System error', data)
  }
}

export async function completeTodo(data: ActionData, socket: Socket, server: Server): Promise<void> {
  const { id, flag } = data

  try {
    const [count] = await TodoService.completeTodo(id, flag);
    if (count == 1) {
      handleQuerySuccess(socket, data);
      boardcastLists(server);
    } else {
      handleQueryFail(socket, errCode.UPDATE_ERROR, 'update error', data);
    }
  } catch (error: any) {
    console.log(error.message)
    handleQueryFail(socket, errCode.SYSTEM_ERROR, 'System error', data)
  }
}

export async function removeAllList(data: ActionData, socket: Socket, server: Server): Promise<void> {
  try {
    await TodoService.removeAllList();
    handleQuerySuccess(socket, data);
    boardcastLists(server);
  } catch (error: any) {
    console.log(error.message)
    handleQueryFail(socket, errCode.SYSTEM_ERROR, 'System error', data)
  }
}

export async function search(data: ActionData, socket: Socket): Promise<void> {
  const { query } = data;
  try {
    const todoList = await TodoService.geTodoList(query);
    socket.send('todoSearchList', {
      resultCode: 1,
      data: { list: todoList }
    })

    const completedList = await TodoService.geCompletedList(10, query);
    socket.send('completedSearchList', {
      resultCode: 1,
      data: { list: completedList }
    })

    handleQuerySuccess(socket, data);
  } catch (error: any) {
    console.log(error.message)
    handleQueryFail(socket, errCode.SYSTEM_ERROR, 'System error', data)
  }
}

export async function todoList(data: ActionData, socket: Socket): Promise<void> {
  try {
    const list = await TodoService.geTodoList();
    socket.send('todoList', {
      resultCode: 1,
      data: { list }
    })
  } catch (error: any) {
    console.log(error.message)
    handleQueryFail(socket, errCode.SYSTEM_ERROR, 'System error', data)
  }
}

export async function completedList(data: ActionData, socket: Socket): Promise<void> {
  try {
    let list = await TodoService.geCompletedList(10);
    socket.send('completedList', {
      resultCode: 1,
      data: { list }
    })
  } catch (error: any) {
    console.log(error.message)
    handleQueryFail(socket, errCode.SYSTEM_ERROR, 'System error', data)
  }
}
