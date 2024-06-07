-- CreateTable
CREATE TABLE "book" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "book_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "member" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isPenalized" BOOLEAN NOT NULL DEFAULT false,
    "penalizedAt" TIMESTAMP(3),

    CONSTRAINT "member_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "bookBorrowedByMember" (
    "id" SERIAL NOT NULL,
    "bookCode" TEXT NOT NULL,
    "memberCode" TEXT NOT NULL,
    "borrowedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" TIMESTAMP(3),

    CONSTRAINT "bookBorrowedByMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bookBorrowedByMember" ADD CONSTRAINT "bookBorrowedByMember_bookCode_fkey" FOREIGN KEY ("bookCode") REFERENCES "book"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookBorrowedByMember" ADD CONSTRAINT "bookBorrowedByMember_memberCode_fkey" FOREIGN KEY ("memberCode") REFERENCES "member"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
