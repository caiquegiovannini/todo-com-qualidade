import fs from 'fs'
import { v4 as uuid } from 'uuid';
const DB_FILE_PATH = './src/db'

console.log('[CRUD iniciado]')

interface Todo {
    id: string
    date: string
    content: string
    done: boolean
}

function create(content: string): Todo {
    const todo: Todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content,
        done: false,
    }
    const todos: Array<Todo> = [
        ...read(),
        todo,
    ]

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos }, null, 2))
    return todo
}

function update(id: string, partialTodo: Partial<Todo>): Todo {
    let updatedTodo;
    const todos = read()
    todos.forEach(todo => {
        const isToUpdate = todo.id === id
        if (isToUpdate) {
            updatedTodo = Object.assign(todo, partialTodo)
        }
    })

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos }, null, 2))

    if (!updatedTodo) throw new Error('Todo not founded with the provided Id')

    return updatedTodo
}

function updateContentById(id: string, content: string) {
    return update(id, { content })
}

function read(): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, 'utf-8')
    const db = JSON.parse(dbString || '{}')
    if (!db.todos) { // Fail Fast Validation
        return []
    }

    return db.todos
}

function cleanDb() {
    fs.writeFileSync(DB_FILE_PATH, '')
}

// SIMULATION
cleanDb()
create('Primeira TODO')
const segundaTodo = create('Segunda TODO')
create('Teeerceira TODO')
updateContentById(segundaTodo.id, 'Segunda TODO ATULAIZADA!')
console.log(read())