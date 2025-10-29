/*
  Warnings:

  - You are about to drop the column `createdAt` on the `LoginHistory` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `LoginHistory` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `LoginHistory` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LoginHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LoginHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LoginHistory" ("id", "userId") SELECT "id", "userId" FROM "LoginHistory";
DROP TABLE "LoginHistory";
ALTER TABLE "new_LoginHistory" RENAME TO "LoginHistory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
