-- Add new stockKg column with default
ALTER TABLE "Sweet"
ADD COLUMN "stockKg" DOUBLE PRECISION NOT NULL DEFAULT 0;

