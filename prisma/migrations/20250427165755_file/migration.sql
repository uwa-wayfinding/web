-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('UPLOADING', 'CONVERTING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "convertedUrl" TEXT,
    "status" "FileStatus" NOT NULL DEFAULT 'UPLOADING',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "convertedAt" TIMESTAMP(3),
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "File_userId_idx" ON "File"("userId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
