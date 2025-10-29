-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LoginHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "userAgent" TEXT,
    CONSTRAINT "LoginHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LoginHistory" ("id", "ip", "timestamp", "userAgent", "userId") SELECT "id", "ip", "timestamp", "userAgent", "userId" FROM "LoginHistory";
DROP TABLE "LoginHistory";
ALTER TABLE "new_LoginHistory" RENAME TO "LoginHistory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
