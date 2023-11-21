import { todoRepository } from "@ui/repository/todo";

interface TodoControllerGetParams {
  page: number;
  limit: number;
}

function get(params: TodoControllerGetParams) {
  return todoRepository.get({ page: params.page, limit: params.limit });
}

export const todoController = {
  get,
};
