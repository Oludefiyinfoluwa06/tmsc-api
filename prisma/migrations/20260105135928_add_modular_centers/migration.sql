-- CreateEnum
CREATE TYPE "CenterImageType" AS ENUM ('MACHINE', 'TRAINING');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MODULAR_CENTERS_ADMIN';

-- CreateTable
CREATE TABLE "ModularCenter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModularCenter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CenterImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "type" "CenterImageType" NOT NULL DEFAULT 'MACHINE',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "centerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CenterImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CenterImage" ADD CONSTRAINT "CenterImage_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "ModularCenter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
