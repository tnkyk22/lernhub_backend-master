-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('Handout', 'Sheet', 'Note');

-- CreateTable
CREATE TABLE "Admins" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Users" (
    "Id" SERIAL NOT NULL,
    "Email" TEXT NOT NULL,
    "UserName" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "facultyId" INTEGER,
    "departmentId" INTEGER,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Department" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "facultyId" INTEGER,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Course" (
    "Id" SERIAL NOT NULL,
    "Course_Id" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Course_name" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "courseId" INTEGER,

    CONSTRAINT "Course_name_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Sheet" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Path" TEXT NOT NULL,
    "Thumbnail" TEXT DEFAULT 'https://placehold.co/600x400/png',
    "NoteType" "NoteType" NOT NULL,
    "CreatedById" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "courseId" INTEGER,
    "course_nameId" INTEGER,

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "Id" SERIAL NOT NULL,
    "Score" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "sheetId" INTEGER NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Reports" (
    "Id" SERIAL NOT NULL,
    "Content" TEXT NOT NULL,
    "ReportDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "sheetId" INTEGER,

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "News" (
    "Id" SERIAL NOT NULL,
    "Thumbnail" TEXT NOT NULL,
    "NewsTitle" TEXT NOT NULL,
    "NewsContent" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admins_Email_key" ON "Admins"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_Email_key" ON "Users"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_Name_key" ON "Faculty"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_Name_key" ON "Department"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Course_Course_Id_key" ON "Course"("Course_Id");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_Name_key" ON "Course_name"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_sheetId_key" ON "Rating"("userId", "sheetId");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course_name" ADD CONSTRAINT "Course_name_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_CreatedById_fkey" FOREIGN KEY ("CreatedById") REFERENCES "Users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_course_nameId_fkey" FOREIGN KEY ("course_nameId") REFERENCES "Course_name"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
