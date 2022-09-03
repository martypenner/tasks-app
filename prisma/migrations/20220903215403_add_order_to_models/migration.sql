-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "notes" TEXT DEFAULT '',
    "when" TEXT NOT NULL DEFAULT 'inbox',
    "whenDate" DATETIME,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "globalOrder" BIGINT NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deleted" DATETIME,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "areaId" TEXT,
    "headingId" TEXT,
    CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_headingId_fkey" FOREIGN KEY ("headingId") REFERENCES "Heading" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("areaId", "createdAt", "deleted", "done", "headingId", "id", "notes", "projectId", "title", "updatedAt", "userId", "when", "whenDate") SELECT "areaId", "createdAt", "deleted", "done", "headingId", "id", "notes", "projectId", "title", "updatedAt", "userId", "when", "whenDate" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_globalOrder_key" ON "Task"("globalOrder");
CREATE TABLE "new_Heading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "globalOrder" BIGINT NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archived" DATETIME,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    CONSTRAINT "Heading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Heading_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Heading" ("archived", "createdAt", "id", "projectId", "title", "updatedAt", "userId") SELECT "archived", "createdAt", "id", "projectId", "title", "updatedAt", "userId" FROM "Heading";
DROP TABLE "Heading";
ALTER TABLE "new_Heading" RENAME TO "Heading";
CREATE UNIQUE INDEX "Heading_globalOrder_key" ON "Heading"("globalOrder");
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "notes" TEXT DEFAULT '',
    "when" TEXT NOT NULL DEFAULT 'inbox',
    "whenDate" DATETIME,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "globalOrder" BIGINT NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deleted" DATETIME,
    "userId" TEXT NOT NULL,
    "areaId" TEXT,
    CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Project_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("areaId", "createdAt", "deleted", "done", "id", "notes", "title", "updatedAt", "userId", "when", "whenDate") SELECT "areaId", "createdAt", "deleted", "done", "id", "notes", "title", "updatedAt", "userId", "when", "whenDate" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_globalOrder_key" ON "Project"("globalOrder");
CREATE TABLE "new_Area" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "globalOrder" BIGINT NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deleted" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Area_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Area" ("createdAt", "deleted", "id", "title", "updatedAt", "userId") SELECT "createdAt", "deleted", "id", "title", "updatedAt", "userId" FROM "Area";
DROP TABLE "Area";
ALTER TABLE "new_Area" RENAME TO "Area";
CREATE UNIQUE INDEX "Area_globalOrder_key" ON "Area"("globalOrder");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
