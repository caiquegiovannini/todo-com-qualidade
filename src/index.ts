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

function read(): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, 'utf-8')
    const db = JSON.parse(dbString || '{}')
    if (!db.todos) { // Fail Fast Validation
        return []
    }

    return db.todos
}
}

// SIMULATION
create('Primeira TODO')
console.log(read())