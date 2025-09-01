/*
  Warnings:

  - Added the required column `customerEmail` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_studentId_fkey";

-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "customerEmail" TEXT NOT NULL,
ADD COLUMN     "customerName" TEXT NOT NULL,
ALTER COLUMN "studentId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."library_files" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "library_files_title_idx" ON "public"."library_files"("title");

-- CreateIndex
CREATE INDEX "library_files_author_idx" ON "public"."library_files"("author");

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."students"("id") ON DELETE SET NULL ON UPDATE CASCADE;
