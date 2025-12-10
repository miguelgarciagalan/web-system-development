import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "./connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.resolve(__dirname, "../../../docs/database.sql");

const initDb = () =>
  new Promise((resolve, reject) => {
    fs.readFile(schemaPath, "utf8", (err, sql) => {
      if (err) return reject(err);
      db.exec(sql, (execErr) => {
        if (execErr) return reject(execErr);
        resolve();
      });
    });
  });

export default initDb;
