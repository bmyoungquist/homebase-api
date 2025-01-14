/*
  Warnings:

  - You are about to drop the column `isActive` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_addressId_fkey";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "isActive",
ADD COLUMN     "placeId" INTEGER,
ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Price" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Unit" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- DropTable
DROP TABLE "Address";

-- CreateTable
CREATE TABLE "Place" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "streetOne" TEXT,
    "streetTwo" TEXT,
    "unit" TEXT,
    "zipCode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "coordX" INTEGER,
    "coordY" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;
