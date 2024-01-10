const BASE_URL = "http://localhost:3000";

describe("Todos feed", () => {
  it("should show new todo when create a new one", () => {
    const newTodoContent = "Comer goiabada com queijo";
    // 0 - Interceptações/Intertecptação
    cy.intercept("POST", `${BASE_URL}/api/todos`, {
      statusCode: 201,
      body: {
        todo: {
          id: "ff997666-bbce-4c01-96e7-5c55cc439bd8",
          date: "2023-09-18T02:20:19.356Z",
          content: newTodoContent,
          done: false,
        },
      },
    }).as("createTodo");

    // 1 - Abrir a página
    cy.visit(BASE_URL);

    // 2 - Selecionar e digitar no input de criar nova todo
    const inputAddTodo = 'input[name="add-todo"]';
    cy.get(inputAddTodo).type(newTodoContent);

    // 4 - Clicar no botão
    const buttonAddTodo = 'button[aria-label="Adicionar novo item"]';
    cy.get(buttonAddTodo).click();

    // 5 - Checar se na página surgiu um novo elemento
    cy.get("table > tbody").contains(newTodoContent);
  });
});
