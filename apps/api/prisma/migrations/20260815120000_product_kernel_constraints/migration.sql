-- Kernel Commit 2: Constraint + ConstraintTerm (mutually exclusive assignments)

CREATE TABLE "Constraint" (
    "id" TEXT NOT NULL,
    "productRevisionId" TEXT NOT NULL,

    CONSTRAINT "Constraint_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConstraintTerm" (
    "constraintId" TEXT NOT NULL,
    "choiceValueId" TEXT NOT NULL,

    CONSTRAINT "ConstraintTerm_pkey" PRIMARY KEY ("constraintId","choiceValueId")
);

CREATE INDEX "Constraint_productRevisionId_idx" ON "Constraint"("productRevisionId");

CREATE INDEX "ConstraintTerm_choiceValueId_idx" ON "ConstraintTerm"("choiceValueId");

ALTER TABLE "Constraint" ADD CONSTRAINT "Constraint_productRevisionId_fkey" FOREIGN KEY ("productRevisionId") REFERENCES "ProductGraphVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConstraintTerm" ADD CONSTRAINT "ConstraintTerm_constraintId_fkey" FOREIGN KEY ("constraintId") REFERENCES "Constraint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConstraintTerm" ADD CONSTRAINT "ConstraintTerm_choiceValueId_fkey" FOREIGN KEY ("choiceValueId") REFERENCES "AttributeValue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
