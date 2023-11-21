interface TodoRepositoryGetParams {
  page: number;
  limit: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

async function get({
  page,
  limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
  console.log(page, limit);
  return fetch(`api/todos?page=${page}&limit=${limit}`).then(
    async (response) => {
      const responseString = await response.text();
      const responseParsed = parseTodos(JSON.parse(responseString));

      return {
        todos: responseParsed.todos,
        total: responseParsed.total,
        pages: responseParsed.pages,
      };
    }
  );
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

function parseTodos(responseBody: unknown): {
  total: number;
  pages: number;
  todos: Array<Todo>;
} {
  // console.log(responseBody); // entrou como desconhecido
  if (
    responseBody !== null && // verificou existe algo
    typeof responseBody === "object" && // verificou se eh um objeto
    "todos" in responseBody && // verificou que tem 'todos' dentro desse objeto
    "pages" in responseBody && // verificou que tem 'pages' dentro desse objeto
    "total" in responseBody && // verificou que tem 'total' dentro desse objeto
    Array.isArray(responseBody.todos) // verificou que 'todos' eh um array
  ) {
    return {
      total: Number(responseBody.total),
      pages: Number(responseBody.pages),
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
    pages: 1,
    total: 0,
    todos: [],
  };
}
