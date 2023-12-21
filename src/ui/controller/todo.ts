import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod";

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

interface TodoControllerCreateParams {
  content?: string;
  onError: (customMessage?: string) => void;
  onSuccess: (newTodo: Todo) => void;
}
function create({ content, onError, onSuccess }: TodoControllerCreateParams) {
  // Fail Fast
  const parsedParams = schema.string().min(1).safeParse(content);
  if (!parsedParams.success) {
    onError();
    return;
  }

  todoRepository
    .createByContent(parsedParams.data)
    .then((newTodo) => onSuccess(newTodo))
    .catch(() => onError());
}

interface TodoControllerToggleDoneParams {
  id: string;
  updateTodoOnScreen: () => void;
  onError: () => void;
}
function toggleDone({
  id,
  updateTodoOnScreen,
  onError,
}: TodoControllerToggleDoneParams) {
  todoRepository
    .toggleDone(id)
    .then(() => updateTodoOnScreen())
    .catch(() => onError());
}

export const todoController = {
  get,
  filterTodosByContent,
  create,
  toggleDone,
};
