const { PrismaClient } = require("@prisma/client");
const { createEncryptionMiddleware } = require("./prismaMiddleware");

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

if (process.env.ENCRYPTION_KEY) {
  prisma.$use(createEncryptionMiddleware());
}

module.exports = prisma;
