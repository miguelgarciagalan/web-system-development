import db from './sqlite.js';

const mapTaskRow = (row) => {
  if (!row) return null;
  return {
    id: String(row.id),
    title: row.title,
    description: row.description || '',
    date: row.date,
    startTime: row.start_time || null,
    endTime: row.end_time || null,
    status: row.status,
    important: Boolean(row.important),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    userId: String(row.user_id),
  };
};

export const getAllTasks = async (userId) => {
  const rows = db
    .prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY date ASC, start_time ASC')
    .all(userId);
  return rows.map(mapTaskRow);
};

export const getTaskById = async (id, userId) => {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, userId);
  return mapTaskRow(row);
};

export const createTask = async (userId, taskData) => {
  const now = new Date().toISOString();
  const {
    title,
    description = '',
    date,
    startTime = null,
    endTime = null,
    status,
    important = false,
  } = taskData;

  const stmt = db.prepare(
    `INSERT INTO tasks (user_id, title, description, date, start_time, end_time, status, important, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const info = stmt.run(
    userId,
    title,
    description,
    date,
    startTime,
    endTime,
    status,
    important ? 1 : 0,
    now,
    now
  );

  return {
    id: String(info.lastInsertRowid),
    userId: String(userId),
    title,
    description,
    date,
    startTime,
    endTime,
    status,
    important: Boolean(important),
    createdAt: now,
    updatedAt: now,
  };
};

export const updateTask = async (id, userId, updates) => {
  const existing = await getTaskById(id, userId);
  if (!existing) return null;

  const merged = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const stmt = db.prepare(
    `UPDATE tasks
     SET title = ?, description = ?, date = ?, start_time = ?, end_time = ?, status = ?, important = ?, updated_at = ?
     WHERE id = ? AND user_id = ?`
  );
  stmt.run(
    merged.title,
    merged.description,
    merged.date,
    merged.startTime,
    merged.endTime,
    merged.status,
    merged.important ? 1 : 0,
    merged.updatedAt,
    id,
    userId
  );

  return merged;
};

export const deleteTask = async (id, userId) => {
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?');
  const info = stmt.run(id, userId);
  return info.changes > 0;
};
