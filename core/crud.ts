import fs from "fs";
import { v4 as uuid } from "uuid";
const DB_FILE_PATH = "./core/db";

// console.log("[CRUD iniciado]");

type UUID = string;
interface Todo {
  id: UUID;
  date: string;
  content: string;
  done: boolean;
}

function create(content: string): Todo {
  const todo: Todo = {
    id: uuid(),
    date: new Date().toISOString(),
    content,
    done: false,
  };
  const todos: Array<Todo> = [...read(), todo];

  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos }, null, 2));
  return todo;
}

function update(id: UUID, partialTodo: Partial<Todo>): Todo {
  let updatedTodo;
  const todos = read();
  todos.forEach((todo) => {
    const isToUpdate = todo.id === id;
    if (isToUpdate) {
      updatedTodo = Object.assign(todo, partialTodo);
    }
  });

  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos }, null, 2));

  if (!updatedTodo) throw new Error("Todo not founded with the provided Id");

  return updatedTodo;
}

function updateContentById(id: UUID, content: string) {
  return update(id, { content });
}

function deleteById(id: UUID) {
  const todos = read();
  const todosUpdated = todos.filter((todo) => todo.id !== id);

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify({ todos: todosUpdated }, null, 2)
  );
}

export function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}");
  if (!db.todos) {
    // Fail Fast Validation
    return [];
  }

  return db.todos;
}

function cleanDb() {
  fs.writeFileSync(DB_FILE_PATH, "");
}

// SIMULATION
// cleanDb();
// create("Primeira TODO");
// const secondTodo = create("Segunda TODO");
// updateContentById(secondTodo.id, "Segunda TODO ATULAIZADA!");
// const thirdTodo = create("Teeerceira TODO");
// deleteById(thirdTodo.id);
// console.log(read());
