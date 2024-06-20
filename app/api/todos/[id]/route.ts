import { todoController } from "@server/controller/todo";

async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  return new Response(`Eu sou o id: ${id}`, {
    status: 200,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return await todoController.deleteById(request, params.id);
}

// import { todoController } from "@server/controller/todo";
// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   request: NextApiRequest,
//   response: NextApiResponse
// ) {
//   if (request.method === "DELETE") {
//     await todoController.deleteById(request, response);
//     return;
//   }

//   response.status(405).json({ error: { message: "Method allowed" } });
// }
