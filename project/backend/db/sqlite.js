import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'studycalendar.db');
const schemaPath = path.join(__dirname, 'schema.sql');

const db = new Database(dbPath);

// Ejecutar schema de inicializacion
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

export default db;
