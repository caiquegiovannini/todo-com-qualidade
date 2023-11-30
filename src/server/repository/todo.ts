import { read, create, update } from "@db-crud-todo";

interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

async function get({
  page,
  limit,
}: TodoRepositoryGetParams = {}): Promise<TodoRepositoryGetOutput> {
  const currentPage = page || 1;
  const currentLimit = limit || 2;
  const ALL_TODOS = read().reverse();

  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit;
  const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
  const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);

  return {
    total: ALL_TODOS.length,
    todos: paginatedTodos,
    pages: totalPages,
  };
}

async function createByContent(content: string): Promise<Todo> {
  const createdTodo = create(content);

  return createdTodo;
}

async function toggleDone(todoId: string): Promise<Todo> {
  const ALL_TODOS = read();
  const todoToUpdate = ALL_TODOS.find((todo) => todo.id === todoId);

  if (!todoToUpdate) throw new Error(`Todo with id "${todoId}" not found!`);

  const updatedTodo = update(todoId, {
    done: !todoToUpdate.done,
  });

  return updatedTodo;
}

export const todoRepository = {
  get,
  createByContent,
  toggleDone,
};

// Model/Schema
interface Todo {
  id: string;
  content: string;
  date: string;
  done: boolean;
}
