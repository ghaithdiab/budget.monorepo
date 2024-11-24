/*
  Warnings:

  - Added the required column `isVerified` to the `User_Verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User_Verification" ADD COLUMN     "isVerified" BOOLEAN NOT NULL;
