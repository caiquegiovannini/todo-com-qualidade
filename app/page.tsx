"use client";

import React, { useEffect, useRef, useState } from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { todoController } from "@ui/controller/todo";

const bg = "https://mariosouto.com/cursos/crudcomqualidade/bg";

interface HomeTodo {
  id: string;
  content: string;
  done: boolean;
}

export default function Page() {
  const initialLoadComplete = useRef(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<HomeTodo[]>([]);
  const [newTodoContent, setNewTodoContent] = useState("");
  const homeTodos = todoController.filterTodosByContent<HomeTodo>(
    search,
    todos
  );
  const hasNextPage = totalPages > currentPage;
  const hasNoTodos = homeTodos.length === 0 && !isLoading;

  useEffect(() => {
    if (!initialLoadComplete.current) {
      todoController
        .get({ page: currentPage, limit: 2 })
        .then(({ todos, pages }) => {
          setTodos(todos);
          setTotalPages(pages);
        })
        .finally(() => {
          setIsLoading(false);
          initialLoadComplete.current = true;
        });
    }
  }, []);

  return (
    <main>
      <GlobalStyles />
      <header
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      >
        <div className="typewriter">
          <h1>O que fazer hoje?</h1>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            todoController.create({
              content: newTodoContent,
              onError: (customMessage) =>
                alert(
                  customMessage ||
                    "Você precisa ter um conteúdo para criar uma TODO"
                ),
              onSuccess: (newTodo: HomeTodo) => {
                setTodos((currentTodos) => [...currentTodos, newTodo]);
                setNewTodoContent("");
              },
            });
          }}
        >
          <input
            name="add-todo"
            type="text"
            placeholder="Correr, Estudar..."
            value={newTodoContent}
            onChange={(event) => setNewTodoContent(event.target.value)}
          />
          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input
            type="text"
            placeholder="Filtrar lista atual, ex: Dentista"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </form>

        <table border={1}>
          <thead>
            <tr>
              <th align="left">
                <input type="checkbox" disabled />
              </th>
              <th align="left">Id</th>
              <th align="left">Conteúdo</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {homeTodos.map((todo) => (
              <tr key={todo.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() =>
                      todoController.toggleDone({
                        id: todo.id,
                        updateTodoOnScreen() {
                          setTodos((currentTodos) => {
                            return currentTodos.map((currentTodo) => {
                              if (currentTodo.id === todo.id) {
                                return {
                                  ...currentTodo,
                                  done: !currentTodo.done,
                                };
                              }

                              return currentTodo;
                            });
                          });
                        },
                        onError() {
                          alert("Falha ao atualizar a TODO :(");
                        },
                      })
                    }
                  />
                </td>
                <td>{todo.id.substring(0, 4)}</td>
                <td>{!todo.done ? todo.content : <s>{todo.content}</s>}</td>
                <td align="right">
                  <button
                    data-type="delete"
                    onClick={() => {
                      todoController
                        .deleteById(todo.id)
                        .then(() => {
                          setTodos((currentTodos) => {
                            return currentTodos.filter(
                              (currentTodo) => currentTodo.id !== todo.id
                            );
                          });
                        })
                        .catch(() => console.error("Failed to delete!"));
                    }}
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            ))}

            {isLoading && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Carregando...
                </td>
              </tr>
            )}

            {hasNoTodos && (
              <tr>
                <td colSpan={4} align="center">
                  Nenhum item encontrado
                </td>
              </tr>
            )}

            {hasNextPage && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  <button
                    data-type="load-more"
                    onClick={() => {
                      setIsLoading(true);
                      const nextPage = currentPage + 1;
                      setCurrentPage(nextPage);

                      todoController
                        .get({ page: nextPage, limit: 2 })
                        .then(({ todos, pages }) => {
                          setTodos((oldTodos) => {
                            return [...oldTodos, ...todos];
                          });
                          setTotalPages(pages);
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    }}
                  >
                    Página {currentPage}, Carregar mais{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "4px",
                        fontSize: "1.2em",
                      }}
                    >
                      ↓
                    </span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
