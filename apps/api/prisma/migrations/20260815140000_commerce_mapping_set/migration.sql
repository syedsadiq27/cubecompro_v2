-- CreateTable
CREATE TABLE "CommerceMappingSet" (
    "id" TEXT NOT NULL,
    "productRevisionId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,

    CONSTRAINT "CommerceMappingSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommerceIdentityChoice" (
    "mappingSetId" TEXT NOT NULL,
    "choiceId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CommerceIdentityChoice_pkey" PRIMARY KEY ("mappingSetId","choiceId")
);

-- CreateTable
CREATE TABLE "CommerceMapping" (
    "id" TEXT NOT NULL,
    "mappingSetId" TEXT NOT NULL,
    "identitySignature" TEXT NOT NULL,
    "externalType" TEXT NOT NULL DEFAULT 'VARIANT',
    "externalId" TEXT NOT NULL,
    "sku" TEXT,

    CONSTRAINT "CommerceMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommerceMappingTerm" (
    "mappingId" TEXT NOT NULL,
    "choiceValueId" TEXT NOT NULL,

    CONSTRAINT "CommerceMappingTerm_pkey" PRIMARY KEY ("mappingId","choiceValueId")
);

-- CreateIndex
CREATE INDEX "CommerceMappingSet_productRevisionId_idx" ON "CommerceMappingSet"("productRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "CommerceMappingSet_productRevisionId_provider_key" ON "CommerceMappingSet"("productRevisionId", "provider");

-- CreateIndex
CREATE INDEX "CommerceIdentityChoice_choiceId_idx" ON "CommerceIdentityChoice"("choiceId");

-- CreateIndex
CREATE INDEX "CommerceMapping_mappingSetId_idx" ON "CommerceMapping"("mappingSetId");

-- CreateIndex
CREATE UNIQUE INDEX "CommerceMapping_mappingSetId_identitySignature_key" ON "CommerceMapping"("mappingSetId", "identitySignature");

-- CreateIndex
CREATE INDEX "CommerceMappingTerm_choiceValueId_idx" ON "CommerceMappingTerm"("choiceValueId");

-- AddForeignKey
ALTER TABLE "CommerceMappingSet" ADD CONSTRAINT "CommerceMappingSet_productRevisionId_fkey" FOREIGN KEY ("productRevisionId") REFERENCES "ProductGraphVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommerceIdentityChoice" ADD CONSTRAINT "CommerceIdentityChoice_mappingSetId_fkey" FOREIGN KEY ("mappingSetId") REFERENCES "CommerceMappingSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommerceIdentityChoice" ADD CONSTRAINT "CommerceIdentityChoice_choiceId_fkey" FOREIGN KEY ("choiceId") REFERENCES "ProductAttribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommerceMapping" ADD CONSTRAINT "CommerceMapping_mappingSetId_fkey" FOREIGN KEY ("mappingSetId") REFERENCES "CommerceMappingSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommerceMappingTerm" ADD CONSTRAINT "CommerceMappingTerm_mappingId_fkey" FOREIGN KEY ("mappingId") REFERENCES "CommerceMapping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommerceMappingTerm" ADD CONSTRAINT "CommerceMappingTerm_choiceValueId_fkey" FOREIGN KEY ("choiceValueId") REFERENCES "AttributeValue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
