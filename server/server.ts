/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express, { application } from 'express';
import pg, { Client } from 'pg';
import {
  ClientError,
  defaultMiddleware,
  authMiddleware,
  errorMiddleware,
} from './lib/index.js';
// import { argon2d } from "argon2";
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

type User = {
  userId: number;
  username: string;
  password: string;
};
// type Entry = {
//   entryId: number;
//   title: string;
// };
type Auth = {
  username: string;
  password: string;
};

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
const db = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

// app.get('/api/hello', (req, res) => {
//   res.json({ message: 'Hello, World!' });
// });

app.use(express.json());

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "users" ("username", "password")
      values ($1, $2)
      returning *
    `;
    const params = [username, hashedPassword];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    console.log('username received:', username);
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
    select "userId",
      "username",
      "password"
      from "users"
      where "username" = $1
      `;
    const params = [username];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;

    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const {
      userId,
      username: userUsername,
      password: hashedPasswordFromDB,
    } = user;
    if (!(await argon2.verify(hashedPasswordFromDB, password))) {
      throw new ClientError(401, 'invalid login');
    }

    const sqlTasks = `
    select "taskId", "taskContent", "priority"
    from "tasks"
    where "assignedUserId" = $1
    `;

    const tasksResult = await db.query(sqlTasks, [userId]);
    const tasks = tasksResult.rows;

    const payload = { userId, username: userUsername };
    const token = jwt.sign(payload, hashKey);
    console.log('generated token:', token);
    res.json({ token, user: payload });
  } catch (error) {
    next(error);
  }
});

app.post('/api/tasks', authMiddleware, async (req, res, next) => {
  try {
    const { taskContent, priority } = req.body;
    const assignedUserId = req.user?.userId;
    console.log('request body:', req.body);
    console.log('task details:', { taskContent, priority, assignedUserId });

    const sql = `
    insert into "tasks" ("taskContent", "priority", "assignedUserId")
    values ($1, $2, $3)
    returning *
    `;
    const params = [taskContent, priority, assignedUserId];
    console.log('SQL query:', sql);
    console.log('SQL parameters:', params);
    const result = await db.query(sql, params);
    const [newTask] = result.rows;

    console.log('new task', newTask);

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

app.get('/api/tasks/:taskId', authMiddleware, async (req, res, next) => {
  const userId = req.user?.userId;
  const { taskId } = req.params;

  try {
    const sql = `SELECT * FROM "tasks" WHERE "taskId" = $1 AND "assignedUserId" = $2`;
    const params = [taskId, userId];
    const result = await db.query(sql, params);
    if (!userId) {
      throw new ClientError(401, 'Unauthorized: no userId');
    }

    if (result.rows.length === 0) {
      throw new ClientError(404, 'Task not found');
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/*
 * Middleware that handles paths that aren't handled by static middleware
 * or API route handlers.
 * This must be the _last_ non-error middleware installed, after all the
 * get/post/put/etc. route handlers and just before errorMiddleware.
 */
app.use(defaultMiddleware(reactStaticDir));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
