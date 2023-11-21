import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";

function get(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const page = Number(query.page);
  const limit = Number(query.page);

  if (isNaN(page)) {
    res.status(400).json({
      error: {
        message: "'page' must be a number",
      },
    });
  }

  if (isNaN(limit)) {
    res.status(400).json({
      error: {
        message: "'limit' must be a number",
      },
    });
  }

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
