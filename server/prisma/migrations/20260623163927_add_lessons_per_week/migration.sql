-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cohort" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "subjectId" TEXT,
    "name" TEXT NOT NULL,
    "level" JSONB NOT NULL,
    "subjectLabel" JSONB NOT NULL,
    "room" JSONB NOT NULL,
    "color" TEXT NOT NULL,
    "nextAt" DATETIME,
    "nextLabel" JSONB,
    "lessonsPerWeek" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Cohort_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Cohort_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cohort_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Cohort" ("academyId", "color", "createdAt", "id", "level", "name", "nextAt", "nextLabel", "room", "subjectId", "subjectLabel", "teacherId") SELECT "academyId", "color", "createdAt", "id", "level", "name", "nextAt", "nextLabel", "room", "subjectId", "subjectLabel", "teacherId" FROM "Cohort";
DROP TABLE "Cohort";
ALTER TABLE "new_Cohort" RENAME TO "Cohort";
CREATE INDEX "Cohort_academyId_idx" ON "Cohort"("academyId");
CREATE INDEX "Cohort_teacherId_idx" ON "Cohort"("teacherId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
