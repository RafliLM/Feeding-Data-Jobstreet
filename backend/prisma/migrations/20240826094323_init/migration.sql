/*
  Warnings:

  - You are about to drop the column `tag` on the `Jobs` table. All the data in the column will be lost.
  - Added the required column `keyword` to the `Jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Jobs" DROP COLUMN "tag",
ADD COLUMN     "keyword" TEXT NOT NULL;
