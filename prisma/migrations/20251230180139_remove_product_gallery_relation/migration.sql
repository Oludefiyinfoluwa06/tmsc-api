/*
  Warnings:

  - You are about to drop the column `productId` on the `Gallery` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `GalleryGroup` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Gallery" DROP CONSTRAINT "Gallery_productId_fkey";

-- DropForeignKey
ALTER TABLE "GalleryGroup" DROP CONSTRAINT "GalleryGroup_productId_fkey";

-- AlterTable
ALTER TABLE "Gallery" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "GalleryGroup" DROP COLUMN "productId";
