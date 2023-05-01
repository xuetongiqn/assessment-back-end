# Marvelous V2.0 Back-End

## Background
This project is the back-end part of an assessment. It is a todo list project. The front-end part repository is here: [front-end](https://github.com/xuetongiqn/assessment-front-end)

## Online Demo
```
http://ec2-13-56-11-106.us-west-1.compute.amazonaws.com:8080/
```

## Description
The server side is designed in MVC pattern.
Static file service path is ```public/```, and all the APIs are supported in socket. 
The websocket is in ```routes/ws.ts```
The routes are in ```routes/routers.ts```. 
The data model is in ```model/Todo.ts```.
The main business logics are in ```controller/todoController.ts```.

In the websocket part, if there is any update of the list by a client, server will send boardcast message to all of the clients in order to update the data.

## Install
This project uses [Koa2](https://koajs.com/), [PostgreSQL](https://www.postgresql.org/) and [Socket.io](https://socket.io/). Please install the dependencies first.
```
$ npm install
```
or
```
$ yarn
```
## Launch in development mode
Use below command to launch the project. It will listen 8080 port by default(both the http and websocket are in the same port). You can change the port in ```src/server.js```.
```
$ npm start
```
or
```
$ yarn start
```
## Unit Test
Use the command below. Because it is an exercise project. The test is also connected to the onnline database.
```
npm test
```
or
```
yarn test
```

## Build release
1. Use the command below, and the compiled files are in the ```build/``` folder.
```
$ npm build
```
or
```
$ yarn build
```

2. Copy the font-end compiled files into the ```build/public``` folder.

3. Run the ```index.js``` in the server.
```
$ yarn && node index.js
```