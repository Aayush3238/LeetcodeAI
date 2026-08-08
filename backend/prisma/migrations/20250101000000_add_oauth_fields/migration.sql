-- AlterTable: Add OAuth fields to User
ALTER TABLE "User" ADD COLUMN "googleId" TEXT,
ADD COLUMN "githubId" TEXT,
ADD COLUMN "githubToken" TEXT,
ADD COLUMN "leetcodeSession" TEXT,
ADD COLUMN "lastSyncedAt" TIMESTAMP(3);

-- CreateIndex: Unique constraints for OAuth IDs
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");
