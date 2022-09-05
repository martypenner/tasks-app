/*
  Warnings:

  - You are about to drop the column `done` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN "completedDate" DATETIME;

-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    "userId" TEXT NOT NULL,
    "areaId" TEXT,
    CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Project_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("areaId", "createdAt", "deleted", "globalOrder", "id", "notes", "title", "updatedAt", "userId", "when", "whenDate") SELECT "areaId", "createdAt", "deleted", "globalOrder", "id", "notes", "title", "updatedAt", "userId", "when", "whenDate" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_globalOrder_key" ON "Project"("globalOrder");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
