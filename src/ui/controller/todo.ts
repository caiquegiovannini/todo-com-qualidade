function get() {
  return fetch("api/todos").then(async (response) => {
    const responseString = await response.text();
    return JSON.parse(responseString).todos;
  });
}

export const todoController = {
  get,
};
