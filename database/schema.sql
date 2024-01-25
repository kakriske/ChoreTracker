set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
  "userId" serial PRIMARY KEY,
  "username" varchar,
  "password" text,
  "role" varchar,
  "createdAt" timestamptz(6)
);

CREATE TABLE "tasks" (
  "taskId" serial PRIMARY KEY,
  "taskContent" text,
  "priority" integer,
  "assignedUserId" integer,
  "createdById" integer,
  "completed" boolean,
  "createdAt" timestamptz(6),
  "completedAt" timestamptz(6)
);

CREATE TABLE "completedTasks" (
  "completedTaskId" serial PRIMARY KEY,
  "taskId" integer,
  "userId" integer,
  "completedAt" timestamptz(6)
);

COMMENT ON COLUMN "tasks"."taskContent" IS 'Content of the post';

ALTER TABLE "tasks" ADD FOREIGN KEY ("createdById") REFERENCES "users" ("userId");

ALTER TABLE "tasks" ADD FOREIGN KEY ("assignedUserId") REFERENCES "users" ("userId");

ALTER TABLE "completedTasks" ADD FOREIGN KEY ("taskId") REFERENCES "tasks" ("taskId");

ALTER TABLE "completedTasks" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");
