-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Approved', 'Pending', 'Rejected');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'Pending',
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "businessId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Secret Key',
    "key" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "expiresIn" TEXT NOT NULL DEFAULT '24h',

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "password" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_price_id" TEXT,
    "stripe_current_period_end" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationTokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "image" TEXT,
    "imageBlurhash" TEXT,
    "imagesGallery" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Members" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "chapter" TEXT,
    "code" TEXT NOT NULL,
    "drugStoreName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "emailAdd" TEXT NOT NULL,
    "mobileNo" TEXT NOT NULL,
    "telNo" TEXT,
    "ownershipType" TEXT NOT NULL,
    "membershipType" TEXT NOT NULL,
    "dpDateEstablished" TIMESTAMP(3),
    "opPhImageUrl" TEXT NOT NULL,
    "drugstoreClass" TEXT NOT NULL,
    "dpSetup" TEXT,
    "dpLocation" TEXT,
    "dpStoreHours" TEXT,
    "dpInvSystem" TEXT,
    "dpDSClassDetails" JSONB,
    "opLastName" TEXT NOT NULL,
    "opFirstName" TEXT NOT NULL,
    "opMiddleName" TEXT,
    "opAddress" TEXT,
    "opBirthday" TIMESTAMP(3),
    "opEmail" TEXT,
    "opTelNo" TEXT,
    "opCellNo" TEXT,
    "opStatus" TEXT,
    "opGender" TEXT,
    "opEducCollege" JSONB,
    "opEducMasters" JSONB,
    "opEducDoctorate" JSONB,
    "opEducSpecialProg" JSONB,
    "opEducOthers" JSONB,
    "opDsapMember" JSONB,
    "fdaLtoNo" TEXT,
    "fdaDateIssued" TIMESTAMP(3),
    "fdaDateExpiry" TIMESTAMP(3),
    "fdaUrlAttachment" TEXT,
    "bpNo" TEXT,
    "bpDateIssued" TIMESTAMP(3),
    "bpDateExpiry" TIMESTAMP(3),
    "bpUrlAttachment" TEXT,
    "docNo" TEXT,
    "docDateIssued" TIMESTAMP(3),
    "docDateExpiry" TIMESTAMP(3),
    "docUrlAttachment" TEXT,
    "message" TEXT,
    "proofOfPaymentUrl" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tasks" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "priority" TEXT NOT NULL,

    CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "code" TEXT NOT NULL,
    "convention" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "emailAdd" TEXT NOT NULL,
    "address" JSONB,
    "drugstoreInfo" JSONB,
    "proofOfPaymentUrl" TEXT NOT NULL,
    "delegateClass" TEXT NOT NULL DEFAULT '',
    "title" TEXT,
    "delegateMembershipInfo" JSONB,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_id_key" ON "Organization"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_code_key" ON "Organization"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Business_id_key" ON "Business"("id");

-- CreateIndex
CREATE INDEX "Business_organizationId_idx" ON "Business"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Business_code_key" ON "Business"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Location_id_key" ON "Location"("id");

-- CreateIndex
CREATE INDEX "Location_businessId_idx" ON "Location"("businessId");

-- CreateIndex
CREATE INDEX "Location_organizationId_idx" ON "Location"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_code_key" ON "Location"("code");

-- CreateIndex
CREATE INDEX "ApiKey_businessId_idx" ON "ApiKey"("businessId");

-- CreateIndex
CREATE INDEX "ApiKey_locationId_idx" ON "ApiKey"("locationId");

-- CreateIndex
CREATE INDEX "Accounts_userId_idx" ON "Accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_provider_providerAccountId_key" ON "Accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Sessions_sessionToken_key" ON "Sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "Sessions_userId_idx" ON "Sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_stripe_customer_id_key" ON "Users"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_stripe_subscription_id_key" ON "Users"("stripe_subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationTokens_token_key" ON "VerificationTokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationTokens_identifier_token_key" ON "VerificationTokens"("identifier", "token");

-- CreateIndex
CREATE INDEX "Posts_authorId_idx" ON "Posts"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Posts_slug_key" ON "Posts"("slug");

-- CreateIndex
CREATE INDEX "Members_chapter_idx" ON "Members"("chapter");

-- CreateIndex
CREATE UNIQUE INDEX "Members_code_key" ON "Members"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_code_key" ON "Registration"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_code_key" ON "Chapter"("code");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accounts" ADD CONSTRAINT "Accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Members" ADD CONSTRAINT "Members_chapter_fkey" FOREIGN KEY ("chapter") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
