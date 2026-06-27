-- CreateTable
CREATE TABLE "Academy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Branch_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    CONSTRAINT "Subject_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" JSONB NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activeAiConversationId" TEXT,
    CONSTRAINT "Teacher_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Teacher_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeacherSubject" (
    "teacherId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("teacherId", "subjectId"),
    CONSTRAINT "TeacherSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeacherSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeacherPreferences" (
    "teacherId" TEXT NOT NULL PRIMARY KEY,
    "locale" TEXT NOT NULL DEFAULT 'uz',
    "palette" TEXT NOT NULL DEFAULT 'saroy',
    "dark" BOOLEAN NOT NULL DEFAULT false,
    "notifPush" BOOLEAN NOT NULL DEFAULT true,
    "notifCards" BOOLEAN NOT NULL DEFAULT true,
    "notifMgmt" BOOLEAN NOT NULL DEFAULT true,
    "notifSurvey" BOOLEAN NOT NULL DEFAULT true,
    "shareProfile" BOOLEAN NOT NULL DEFAULT true,
    "anonSurvey" BOOLEAN NOT NULL DEFAULT false,
    "aiData" BOOLEAN NOT NULL DEFAULT true,
    "betaCalendar" BOOLEAN NOT NULL DEFAULT false,
    "betaVoice" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TeacherPreferences_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AiUsage" (
    "teacherId" TEXT NOT NULL PRIMARY KEY,
    "used" INTEGER NOT NULL DEFAULT 0,
    "limit" INTEGER NOT NULL DEFAULT 50000,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AiUsage_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teacherId" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" DATETIME,
    CONSTRAINT "AuthSession_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cohort" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Cohort_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Cohort_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cohort_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "cohortId" TEXT,
    "name" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "flag" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Student_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Student_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "takenById" TEXT NOT NULL,
    "takenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "present" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "percent" INTEGER NOT NULL,
    CONSTRAINT "AttendanceRecord_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AttendanceRecord_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AttendanceRecord_takenById_fkey" FOREIGN KEY ("takenById") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttendanceEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recordId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "present" BOOLEAN NOT NULL,
    CONSTRAINT "AttendanceEntry_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "AttendanceRecord" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AttendanceEntry_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CardType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "subtitle" JSONB NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CardType_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "cardTypeId" TEXT NOT NULL,
    "studentId" TEXT,
    "cohortId" TEXT,
    "issuerId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Card_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Card_cardTypeId_fkey" FOREIGN KEY ("cardTypeId") REFERENCES "CardType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Card_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Card_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Card_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TaskColumn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" JSONB NOT NULL,
    "color" TEXT NOT NULL,
    "order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Project_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,
    "projectId" TEXT,
    "ownerId" TEXT,
    "title" JSONB NOT NULL,
    "assigner" JSONB NOT NULL,
    "deadlineLabel" JSONB,
    "deadlineAt" DATETIME,
    "priority" TEXT,
    "urgent" BOOLEAN NOT NULL DEFAULT false,
    "fromMgmt" BOOLEAN NOT NULL DEFAULT false,
    "subtasksDone" INTEGER,
    "subtasksTotal" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Task_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Task_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "TaskColumn" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Teacher" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AiConversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "cohortId" TEXT,
    "name" JSONB NOT NULL,
    "isAll" BOOLEAN NOT NULL DEFAULT false,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastMessageAt" DATETIME,
    CONSTRAINT "AiConversation_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AiConversation_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AiConversation_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AiMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AiMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Printer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "location" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "capabilities" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Printer_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrintJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "printerId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "libraryFileId" TEXT,
    "doc" JSONB NOT NULL,
    "size" JSONB,
    "copies" INTEGER NOT NULL DEFAULT 1,
    "state" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PrintJob_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PrintJob_printerId_fkey" FOREIGN KEY ("printerId") REFERENCES "Printer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PrintJob_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PrintJob_libraryFileId_fkey" FOREIGN KEY ("libraryFileId") REFERENCES "LibraryFile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LibraryFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LibraryFile_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LibraryFile_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "issuer" JSONB NOT NULL,
    "questions" INTEGER NOT NULL DEFAULT 0,
    "estimateLabel" JSONB,
    "deadlineAt" DATETIME,
    "urgent" BOOLEAN NOT NULL DEFAULT false,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Survey_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "surveyId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rating" INTEGER,
    "comment" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SurveyResponse_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SurveyResponse_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MgmtThread" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "role" JSONB,
    "channel" BOOLEAN NOT NULL DEFAULT false,
    "lead" BOOLEAN NOT NULL DEFAULT false,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MgmtThread_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MgmtThread_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MgmtMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "threadId" TEXT NOT NULL,
    "dir" TEXT NOT NULL,
    "text" JSONB,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "taskCardEyebrow" JSONB,
    "taskCardTitle" JSONB,
    "taskCardTaskId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MgmtMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "MgmtThread" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "icon" TEXT,
    "title" JSONB NOT NULL,
    "body" JSONB NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academyId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "meta" JSONB,
    "sizeBytes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "aiSummary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Material_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "Academy" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Material_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Branch_academyId_idx" ON "Branch"("academyId");

-- CreateIndex
CREATE INDEX "Subject_academyId_idx" ON "Subject"("academyId");

-- CreateIndex
CREATE INDEX "Teacher_academyId_idx" ON "Teacher"("academyId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_academyId_username_key" ON "Teacher"("academyId", "username");

-- CreateIndex
CREATE INDEX "TeacherSubject_subjectId_idx" ON "TeacherSubject"("subjectId");

-- CreateIndex
CREATE INDEX "AuthSession_teacherId_idx" ON "AuthSession"("teacherId");

-- CreateIndex
CREATE INDEX "Cohort_academyId_idx" ON "Cohort"("academyId");

-- CreateIndex
CREATE INDEX "Cohort_teacherId_idx" ON "Cohort"("teacherId");

-- CreateIndex
CREATE INDEX "Student_academyId_idx" ON "Student"("academyId");

-- CreateIndex
CREATE INDEX "Student_cohortId_idx" ON "Student"("cohortId");

-- CreateIndex
CREATE INDEX "AttendanceRecord_cohortId_idx" ON "AttendanceRecord"("cohortId");

-- CreateIndex
CREATE INDEX "AttendanceEntry_studentId_idx" ON "AttendanceEntry"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceEntry_recordId_studentId_key" ON "AttendanceEntry"("recordId", "studentId");

-- CreateIndex
CREATE INDEX "CardType_academyId_idx" ON "CardType"("academyId");

-- CreateIndex
CREATE INDEX "Card_academyId_idx" ON "Card"("academyId");

-- CreateIndex
CREATE INDEX "Card_cardTypeId_idx" ON "Card"("cardTypeId");

-- CreateIndex
CREATE INDEX "Card_studentId_idx" ON "Card"("studentId");

-- CreateIndex
CREATE INDEX "Card_cohortId_idx" ON "Card"("cohortId");

-- CreateIndex
CREATE INDEX "Project_academyId_idx" ON "Project"("academyId");

-- CreateIndex
CREATE INDEX "Task_academyId_idx" ON "Task"("academyId");

-- CreateIndex
CREATE INDEX "Task_columnId_idx" ON "Task"("columnId");

-- CreateIndex
CREATE INDEX "AiConversation_teacherId_idx" ON "AiConversation"("teacherId");

-- CreateIndex
CREATE INDEX "AiMessage_conversationId_idx" ON "AiMessage"("conversationId");

-- CreateIndex
CREATE INDEX "Printer_academyId_idx" ON "Printer"("academyId");

-- CreateIndex
CREATE INDEX "PrintJob_printerId_idx" ON "PrintJob"("printerId");

-- CreateIndex
CREATE INDEX "PrintJob_academyId_idx" ON "PrintJob"("academyId");

-- CreateIndex
CREATE INDEX "LibraryFile_academyId_idx" ON "LibraryFile"("academyId");

-- CreateIndex
CREATE INDEX "Survey_academyId_idx" ON "Survey"("academyId");

-- CreateIndex
CREATE INDEX "SurveyResponse_teacherId_idx" ON "SurveyResponse"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyResponse_surveyId_teacherId_key" ON "SurveyResponse"("surveyId", "teacherId");

-- CreateIndex
CREATE INDEX "MgmtThread_teacherId_idx" ON "MgmtThread"("teacherId");

-- CreateIndex
CREATE INDEX "MgmtMessage_threadId_idx" ON "MgmtMessage"("threadId");

-- CreateIndex
CREATE INDEX "Notification_recipientId_idx" ON "Notification"("recipientId");

-- CreateIndex
CREATE INDEX "Material_academyId_idx" ON "Material"("academyId");
