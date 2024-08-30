/*
  Warnings:

  - Added the required column `teaser` to the `Jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Jobs" ADD COLUMN     "teaser" TEXT NOT NULL;
