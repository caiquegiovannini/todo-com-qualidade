import { todoRepository } from "@ui/repository/todo";

interface TodoControllerGetParams {
  page: number;
  limit: number;
}

function get(params: TodoControllerGetParams) {
  return todoRepository.get({ page: params.page, limit: params.limit });
}

function filterTodosByContent<Todo>(
  search: string,
  todos: Array<Todo & { content: string }>
): Todo[] {
  const searchNormalized = search.toLowerCase();
  const homeTodos = todos.filter((todo) => {
    const contentNormalized = todo.content.toLowerCase();
    return contentNormalized.includes(searchNormalized);
  });

  return homeTodos;
}

export const todoController = {
  get,
  filterTodosByContent,
};
