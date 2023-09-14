import fs from 'fs'
const DB_FILE_PATH = './src/db'

console.log('[CRUD iniciado]')

interface Todo {
    date: string
    content: string
    done: boolean
}

function create(content: string) {
    const todo: Todo = {
        date: new Date().toISOString(),
        content,
        done: false,
    }
    const todos: Array<Todo> = [
        ...read(),
        todo,
    ]

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos }, null, 2))
    return content
}

function read() {
    const db = fs.readFileSync(DB_FILE_PATH, 'utf-8')
    return db
}

// SIMULATION
create('Primeira TODO')
console.log(read())