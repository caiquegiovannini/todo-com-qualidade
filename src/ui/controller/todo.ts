import { todoRepository } from "@ui/repository/todo";

interface TodoControllerGetParams {
  page?: number;
}

function get(params: TodoControllerGetParams = {}) {
  console.log(params);
  return todoRepository.get({ page: 1, limit: 1 });
}

export const todoController = {
  get,
};
