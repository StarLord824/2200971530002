/*
  Warnings:

  - A unique constraint covering the columns `[shortenedUrl]` on the table `Url` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[analyticsId]` on the table `Url` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `analyticsId` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "analyticsId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Analytics" (
    "id" SERIAL NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Url_shortenedUrl_key" ON "Url"("shortenedUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Url_analyticsId_key" ON "Url"("analyticsId");

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_analyticsId_fkey" FOREIGN KEY ("analyticsId") REFERENCES "Analytics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
