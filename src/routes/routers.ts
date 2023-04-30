import { Server, Socket } from "socket.io";
import * as TodoController from '../controller/todoController';
import Router from "../utils/router";

const router: Router = new (Router as any)();

router.get('addTodo', TodoController.addTodo);
router.get('removeAll', TodoController.removeAllList);
router.get('search', TodoController.search);
router.get('completeTodo', TodoController.completeTodo);
router.get('todoList', TodoController.todoList);
router.get('completedList', TodoController.completedList);


export default router;