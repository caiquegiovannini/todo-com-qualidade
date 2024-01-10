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

    // 2 - Selecionar o input de criar nova todo
    const $inputAddTodo = cy.get('input[name="add-todo"]');
    // 3 - Digitar no input de criar nova todo
    $inputAddTodo.type(newTodoContent);
    // 4 - Clicar no botão
    cy.get('button[aria-label="Adicionar novo item"]').click();
    // 5 - Checar se na página surgiu um novo elemento
    cy.get("table > tbody").contains(newTodoContent);
  });
});
