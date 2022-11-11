/*
  Warnings:

  - You are about to drop the column `userId` on the `Heading` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Area` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Task` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Heading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "globalOrder" BIGINT NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archived" DATETIME,
    "projectId" TEXT,
    CONSTRAINT "Heading_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Heading" ("archived", "createdAt", "globalOrder", "id", "projectId", "title", "updatedAt") SELECT "archived", "createdAt", "globalOrder", "id", "projectId", "title", "updatedAt" FROM "Heading";
DROP TABLE "Heading";
ALTER TABLE "new_Heading" RENAME TO "Heading";
CREATE UNIQUE INDEX "Heading_globalOrder_key" ON "Heading"("globalOrder");
CREATE TABLE "new_Area" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "globalOrder" BIGINT NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deleted" DATETIME
);
INSERT INTO "new_Area" ("createdAt", "deleted", "globalOrder", "id", "title", "updatedAt") SELECT "createdAt", "deleted", "globalOrder", "id", "title", "updatedAt" FROM "Area";
DROP TABLE "Area";
ALTER TABLE "new_Area" RENAME TO "Area";
CREATE UNIQUE INDEX "Area_globalOrder_key" ON "Area"("globalOrder");
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "notes" TEXT DEFAULT '',
    "when" TEXT NOT NULL DEFAULT 'inbox',
    "whenDate" DATETIME,
    "completedDate" DATETIME,
    "globalOrder" BIGINT NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deleted" DATETIME,
    "areaId" TEXT,
    CONSTRAINT "Project_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("areaId", "completedDate", "createdAt", "deleted", "globalOrder", "id", "notes", "title", "updatedAt", "when", "whenDate") SELECT "areaId", "completedDate", "createdAt", "deleted", "globalOrder", "id", "notes", "title", "updatedAt", "when", "whenDate" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_globalOrder_key" ON "Project"("globalOrder");
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "notes" TEXT DEFAULT '',
    "when" TEXT NOT NULL DEFAULT 'inbox',
    "whenDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'in-progress',
    "completedDate" DATETIME,
    "globalOrder" BIGINT NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deleted" DATETIME,
    "projectId" TEXT,
    "areaId" TEXT,
    "headingId" TEXT,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_headingId_fkey" FOREIGN KEY ("headingId") REFERENCES "Heading" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("areaId", "completedDate", "createdAt", "deleted", "globalOrder", "headingId", "id", "notes", "projectId", "status", "title", "updatedAt", "when", "whenDate") SELECT "areaId", "completedDate", "createdAt", "deleted", "globalOrder", "headingId", "id", "notes", "projectId", "status", "title", "updatedAt", "when", "whenDate" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_globalOrder_key" ON "Task"("globalOrder");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
