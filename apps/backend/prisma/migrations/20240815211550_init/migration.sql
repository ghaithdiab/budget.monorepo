-- CreateTable
CREATE TABLE "User_Verification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "User_Verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Verification_userId_key" ON "User_Verification"("userId");

-- AddForeignKey
ALTER TABLE "User_Verification" ADD CONSTRAINT "User_Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
