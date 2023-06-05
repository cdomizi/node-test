-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "paymentDue" SET DEFAULT NOW() + INTERVAL '30 days';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "rating" DECIMAL(3,2);
