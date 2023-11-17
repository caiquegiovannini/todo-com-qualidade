import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";

function get(_: NextApiRequest, res: NextApiResponse) {
  const output = todoRepository.get();

  res.status(200).json({
    total: output.total,
    pages: output.pages,
    todos: output.todos,
  });
}

export const todoController = {
  get,
};
