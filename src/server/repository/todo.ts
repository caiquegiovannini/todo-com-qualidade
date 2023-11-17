import { read } from "@db-crud-todo";

function get() {
  const ALL_TODOS = read();

  return {
    todos: ALL_TODOS,
  };
}

export const todoRepository = {
  get,
};
