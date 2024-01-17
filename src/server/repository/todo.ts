// import {
//   read,
//   create,
//   update,
//   deleteById as dbDeleteById,
// } from "@db-crud-todo";
import { supabase } from "@server/infra/db/supabase";
import { HttpNotFoundError } from "@server/infra/errors";
import { Todo, TodoSchema } from "@server/schema/todo";

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
  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit - 1;

  const { error, data, count } = await supabase
    .from("todos")
    .select("*", {
      count: "exact",
    })
    .order("date", { ascending: false })
    .range(startIndex, endIndex);

  if (error) throw new Error("Failed to fetch data");

  const parsedData = TodoSchema.array().safeParse(data);

  if (!parsedData.success) {
    // throw parsedData.error;
    throw new Error("Failed to parse TODO from database");
  }

  const todos = parsedData.data;
  const total = count || todos.length;
  const totalPages = Math.ceil(total / currentLimit);

  return {
    todos,
    total,
    pages: totalPages,
  };

  // const currentPage = page || 1;
  // const currentLimit = limit || 2;
  // const ALL_TODOS = read().reverse();

  // const startIndex = (currentPage - 1) * currentLimit;
  // const endIndex = currentPage * currentLimit;
  // const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
  // const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);

  // return {
  //   total: ALL_TODOS.length,
  //   todos: paginatedTodos,
  //   pages: totalPages,
  // };
}

async function createByContent(content: string): Promise<Todo> {
  const { error, data } = await supabase
    .from("todos")
    .insert([
      {
        content,
      },
    ])
    .select()
    .single();

  if (error) throw new Error("Failed to create todo");

  const parsedData = TodoSchema.parse(data);

  return parsedData;

  // const createdTodo = create(content);

  // return createdTodo;
}

async function getTodoById(id: string): Promise<Todo> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error("Failed to get todo by id");

  const parsedData = TodoSchema.safeParse(data);
  if (!parsedData.success) throw new Error("Failed to parse TODO created");

  return parsedData.data;
}

async function toggleDone(todoId: string): Promise<Todo> {
  const todo = await getTodoById(todoId);
  const { data, error } = await supabase
    .from("todos")
    .update({ done: !todo.done })
    .eq("id", todoId)
    .select()
    .single();

  if (error) throw new Error("Failed to get todo by id");

  const parsedData = TodoSchema.parse(data);

  return parsedData;

  // const ALL_TODOS = read();
  // const todoToUpdate = ALL_TODOS.find((todo) => todo.id === todoId);

  // if (!todoToUpdate) throw new Error(`Todo with id "${todoId}" not found!`);

  // const updatedTodo = update(todoId, {
  //   done: !todoToUpdate.done,
  // });

  // return updatedTodo;
}

async function deleteById(todoId: string) {
  const { error } = await supabase.from("todos").delete().match({
    id: todoId,
  });

  if (error) throw new HttpNotFoundError(`Todo with id "${todoId}" not found!`);

  // const ALL_TODOS = read();
  // const todoToUpdate = ALL_TODOS.find((todo) => todo.id === todoId);

  // if (!todoToUpdate)
  //   throw new HttpNotFoundError(`Todo with id "${todoId}" not found!`);

  // dbDeleteById(todoId);
}

export const todoRepository = {
  get,
  createByContent,
  toggleDone,
  deleteById,
};
