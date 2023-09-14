import fs from 'fs'
const DB_FILE_PATH = './src/db'

console.log('[CRUD iniciado]')

function create(content: string) {
    fs.writeFileSync(DB_FILE_PATH, content)
    return content
}

function read() {
    const db = fs.readFileSync(DB_FILE_PATH, 'utf-8')
    return db
}

// SIMULATION
create('Primeira TODO')
console.log(read())