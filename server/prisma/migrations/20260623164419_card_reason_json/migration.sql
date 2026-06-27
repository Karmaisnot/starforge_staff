/*
  Warnings:

  - You are about to alter the column `reason` on the `Card` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "cardTypeId" TEXT NOT NULL,
    "studentId" TEXT,
    "cohortId" TEXT,
    "issuerId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "reason" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Card_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Card_cardTypeId_fkey" FOREIGN KEY ("cardTypeId") REFERENCES "CardType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Card_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Card_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Card_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Card" ("academyId", "cardTypeId", "cohortId", "createdAt", "id", "issuerId", "kind", "reason", "studentId") SELECT "academyId", "cardTypeId", "cohortId", "createdAt", "id", "issuerId", "kind", "reason", "studentId" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
CREATE INDEX "Card_academyId_idx" ON "Card"("academyId");
CREATE INDEX "Card_cardTypeId_idx" ON "Card"("cardTypeId");
CREATE INDEX "Card_studentId_idx" ON "Card"("studentId");
CREATE INDEX "Card_cohortId_idx" ON "Card"("cohortId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
