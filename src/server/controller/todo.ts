import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const page = Number(query.page);
  const limit = Number(query.limit);

  if (page && isNaN(page)) {
    res.status(400).json({
      error: {
        message: "'page' must be a number",
      },
    });
    return;
  }

  if (limit && isNaN(limit)) {
    res.status(400).json({
      error: {
        message: "'limit' must be a number",
      },
    });
    return;
  }

  const output = await todoRepository.get({
    page,
    limit,
  });

  res.status(200).json({
    total: output.total,
    pages: output.pages,
    todos: output.todos,
  });
}

async function create(req: NextApiRequest, res: NextApiResponse) {
  const createdTodo = todoRepository.createByContent(req.body.content);

  res.status(201).json({
    todo: createdTodo,
  });
}

export const todoController = {
  get,
  create,
};
