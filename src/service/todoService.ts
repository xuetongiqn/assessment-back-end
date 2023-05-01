import { Op } from 'sequelize';
import Todo from '../model/Todo';

// Change the database here.

export function addTodo(text: string, priority = 1, isCompleted = false) {
  return Todo.sync().then(() => {
    return Todo.create({
      text,
      priority,
      isCompleted,
    })
  })
}

export function completeTodo(id: number, flag = true) {
  return Todo.update({
    isCompleted: flag,
    completedTime: flag ? new Date() : null,
  }, {
    where: { id }
  })
}

export function getTodoByText(text: string) {
  return Todo.findOne({
    where: {
      text
    }
  })
}

export function geTodoList(query?: string) {
  const where: any = { isCompleted: false }
  if (query) where.text = { [Op.like]: '%' + query + '%' };

  return Todo.findAll({
    where,
    order: [['text', 'ASC']]
  })
}

export async function geCompletedList(limit: number = 10, query?: string) {
  const where: any = { isCompleted: true }
  if (query) where.text = { [Op.like]: '%' + query + '%' };

  let list = await Todo.findAll({
    where,
    limit,
    order: [['completedTime', 'DESC']]
  });
  
  // the done list should sorted by alphabet
  list.sort((a: any, b: any) => {
    if (a.text < b.text) return -1;
    if (a.text > b.text) return 1;
    return 0
  });

  return list;
}

export function removeAllList() {
  return Todo.truncate();
}
