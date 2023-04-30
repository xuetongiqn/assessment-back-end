import app from '../src/app';
import request from 'supertest';
import { io } from "socket.io-client";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('root route', () => {
  beforeAll(() => {
    app.listen(80);
  })

  afterAll(() => {
    app.close();
  })

  test('test get static files', async () => {
    const response = await request(app).get('/');

    expect(response.status).toEqual(200);
    expect(response.type).toEqual('text/html');
    expect(response.text).toEqual('will replaced by front end files');
  });

});

describe('websocket', () => {
  let socket_client;
  const testText = 'test todo';
  let testId;

  beforeAll(() => {
    app.listen(80);
    socket_client = io('ws://localhost');
  })

  afterAll(() => {
    app.close();
    socket_client.close();
  })

  test('init sockets', async () => {
    let todoResponse = {};
    let completedResponse = {};

    socket_client.on('message', (message, data) => {
      switch (message) {
        case 'todoList': {
          todoResponse = data;
          break;
        }
        case 'completedList': {
          completedResponse = data;
          break;
        }
      }
    })

    await delay(1000)
    expect(todoResponse.resultCode).toEqual(1);
    expect(Array.isArray(todoResponse.data.list)).toEqual(true);
    expect(completedResponse.resultCode).toEqual(1);
    expect(Array.isArray(completedResponse.data.list)).toEqual(true);
  });

  test('remove all', async () => {
    let todoResponse = {};
    let completedResponse = {};
    let errorResponse = {};

    socket_client.on('message', (message, data) => {
      switch (message) {
        case 'todoList': {
          todoResponse = data;
          break;
        }
        case 'completedList': {
          completedResponse = data;
          break;
        }
        case 'callback': {
          if (data.resultCode == -1) {
            errorResponse = data;
          }
          break;
        }
      }
    })

    socket_client.send('removeAll')
    await delay(1000)
    expect(todoResponse.resultCode).toEqual(1);
    expect(todoResponse.data.list.length).toEqual(0);
    expect(completedResponse.resultCode).toEqual(1);
    expect(completedResponse.data.list.length).toEqual(0);
    expect(errorResponse.resultCode).toBeUndefined();
  })

  test('add todo', async () => {
    let todoResponse = {};
    let completedResponse = {};
    let errorResponse = {};

    socket_client.on('message', (message, data) => {
      switch (message) {
        case 'todoList': {
          todoResponse = data;
          break;
        }
        case 'completedList': {
          completedResponse = data;
          break;
        }
        case 'callback': {
          if (data.resultCode == -1) {
            errorResponse = data;
            testId = data.data.id;
          }
          break;
        }
      }
    })

    socket_client.send('addTodo', { text: testText })
    await delay(1000)
    expect(todoResponse.resultCode).toEqual(1);
    expect(Array.isArray(todoResponse.data.list)).toEqual(true);
    expect(todoResponse.data.list.filter(item => item.text == testText).length).toEqual(1);
    expect(completedResponse.resultCode).toEqual(1);
    expect(Array.isArray(completedResponse.data.list)).toEqual(true);
    expect(errorResponse.errcode).toBeUndefined();

    socket_client.send('addTodo', { text: testText })
    await delay(1000)
    expect(errorResponse.resultCode).toEqual(-1);
    expect(errorResponse.errcode).toEqual('003');

  });

  test('complete todo', async () => {
    let todoResponse = {};
    let completedResponse = {};
    let errorResponse = {};

    socket_client.on('message', (message, data) => {
      switch (message) {
        case 'todoList': {
          todoResponse = data;
          break;
        }
        case 'completedList': {
          completedResponse = data;
          break;
        }
        case 'callback': {
          if (data.resultCode == -1) {
            errorResponse = data;
            testId = data.data.id;
          }
          break;
        }
      }
    })

    socket_client.send('completeTodo', { id: testId })
    await delay(1000)
    expect(todoResponse.resultCode).toEqual(1);
    expect(todoResponse.data.list.length).toEqual(0);
    expect(completedResponse.resultCode).toEqual(1);
    expect(completedResponse.data.list.length).toEqual(1);
    expect(errorResponse.errcode).toBeUndefined();

    socket_client.send('completeTodo', { id: testId, flag: false })
    await delay(1000)
    expect(todoResponse.resultCode).toEqual(1);
    expect(todoResponse.data.list.length).toEqual(1);
    expect(completedResponse.resultCode).toEqual(1);
    expect(completedResponse.data.list.length).toEqual(0);
    expect(errorResponse.errcode).toBeUndefined();
  })

  test('search sockets', async () => {
    let todoSearchResponse = {};
    let completedSearchResponse = {};

    socket_client.on('message', (message, data) => {
      switch (message) {
        case 'todoSearchList': {
          todoSearchResponse = data;
          break;
        }
        case 'completedSearchList': {
          completedSearchResponse = data;
          break;
        }
      }
    })

    socket_client.send('search', { query: 'test' });

    await delay(2000)

    expect(todoSearchResponse.resultCode).toEqual(1);
    expect(Array.isArray(todoSearchResponse.data.list)).toEqual(true);
    expect(completedSearchResponse.resultCode).toEqual(1);
    expect(Array.isArray(completedSearchResponse.data.list)).toEqual(true);
  });
})