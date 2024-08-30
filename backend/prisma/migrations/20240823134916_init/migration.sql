-- CreateTable
CREATE TABLE "Jobs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "workType" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "salary" TEXT NOT NULL,
    "listingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bulletPoints" TEXT[],

    CONSTRAINT "Jobs_pkey" PRIMARY KEY ("id")
);
