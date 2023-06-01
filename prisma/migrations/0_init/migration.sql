yarn run v1.22.19
$ /home/cesare/Documents/Projects/node-test/node_modules/.bin/prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "firstname" VARCHAR(255),
    "lastname" VARCHAR(255),
    "address" VARCHAR(255),
    "email" VARCHAR(255),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

Done in 2.58s.
