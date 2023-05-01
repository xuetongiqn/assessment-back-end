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

// When the data is changed by any user, this function will boardcast the 
// new todolist and done list to all the clients.
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

// Add new task. If the task is exist, send back an error message.
export async function addTodo(data: ActionData, socket: Socket, server: Server): Promise<void> {
  const { text } = data

  try {
    // search for the same task
    const res = await TodoService.getTodoByText(text);
    if (res) {
      handleQueryFail(socket, errCode.DUPLICATE_ERROR, 'duplicate record', res);
      return;
    }

    // insert into database
    const todo = await TodoService.addTodo(text)
    if (todo.get('id')) {
      // send success callback
      handleQuerySuccess(socket, data);
      // send boardcast to all clients
      boardcastLists(server);
    } else {
      handleQueryFail(socket, errCode.SAVE_ERROR, 'save error', data);
    }
  } catch (error: any) {
    console.log(error.message)
    handleQueryFail(socket, errCode.SYSTEM_ERROR, 'System error', data)
  }
}

// Mark the todo task between done and undone.
// flag == true, means the task status will change to 'done'.
export async function completeTodo(data: ActionData, socket: Socket, server: Server): Promise<void> {
  const { id, flag } = data

  try {
    const [count] = await TodoService.completeTodo(id, flag);
    if (count == 1) {
      handleQuerySuccess(socket, data);
      // send boardcast to all clients
      boardcastLists(server);
    } else {
      handleQueryFail(socket, errCode.UPDATE_ERROR, 'update error', data);
    }
  } catch (error: any) {
    console.log(error.message)
    handleQueryFail(socket, errCode.SYSTEM_ERROR, 'System error', data)
  }
}

// Remove all of the tasks.
export async function removeAllList(data: ActionData, socket: Socket, server: Server): Promise<void> {
  try {
    await TodoService.removeAllList();
    handleQuerySuccess(socket, data);
    // send boardcast to all clients
    boardcastLists(server);
  } catch (error: any) {
    console.log(error.message)
    handleQueryFail(socket, errCode.SYSTEM_ERROR, 'System error', data)
  }
}

// search action. Every search action will send 2 messages back: the todo list 
// and the done list.
export async function search(data: ActionData, socket: Socket): Promise<void> {
  const { query } = data;
  try {
    // get and send todo list
    const todoList = await TodoService.geTodoList(query);
    socket.send('todoSearchList', {
      resultCode: 1,
      data: { list: todoList }
    })

    // get and send done list
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

// Get the todo list.
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

// get the done list.
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
