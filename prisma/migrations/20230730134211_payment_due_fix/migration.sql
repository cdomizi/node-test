-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "paymentDue" SET DEFAULT (now() + '720:00:00'::interval);
