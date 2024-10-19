-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "thumbnailURL" TEXT NOT NULL,
    "saleability" BOOLEAN NOT NULL,
    "buyLink" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gameResult" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "timestamp" DATE NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "gameResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "photoURL" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userBook" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "bookid" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "timestamo" DATE NOT NULL,

    CONSTRAINT "userBook_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "gameResult" ADD CONSTRAINT "gameResult_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userBook" ADD CONSTRAINT "userBook_bookid_fkey" FOREIGN KEY ("bookid") REFERENCES "Book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userBook" ADD CONSTRAINT "userBook_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
