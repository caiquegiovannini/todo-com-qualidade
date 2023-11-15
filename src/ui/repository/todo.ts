interface TodoRepositoryGetParams {
  page: number;
  limit: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

function get({
  page,
  limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
  return fetch("api/todos").then(async (response) => {
    const responseString = await response.text();
    const todosFromServer = parseTodos(JSON.parse(responseString)).todos;

    const ALL_TODOS = todosFromServer;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
    const totalPages = Math.ceil(ALL_TODOS.length / limit);

    return {
      todos: paginatedTodos,
      total: ALL_TODOS.length,
      pages: totalPages,
    };
  });
}

export const todoRepository = {
  get,
};

// Model/Schema
interface Todo {
  id: string;
  content: string;
  date: Date;
  done: boolean;
}

function parseTodos(responseBody: unknown): { todos: Array<Todo> } {
  console.log(responseBody); // entrou como desconhecido
  if (
    responseBody !== null && // verificou existe algo
    typeof responseBody === "object" && // verificou se eh um objeto
    "todos" in responseBody && // verificou que tem 'todos' dentro desse objeto
    Array.isArray(responseBody.todos) // verificou que 'todos' eh um array
  ) {
    return {
      todos: responseBody.todos.map((todo) => {
        if (todo === null && typeof todo !== "object") {
          throw new Error("Invalid todo from API");
        }

        const { id, content, date, done } = todo as {
          id: string;
          content: string;
          date: string;
          done: string;
        };

        return {
          id,
          content,
          date: new Date(date),
          done: String(done).toLocaleLowerCase() === "true",
        };
      }),
    };
  }
  return {
    todos: [],
  };
}
