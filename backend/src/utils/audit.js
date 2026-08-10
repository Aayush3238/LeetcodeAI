const prisma = require("../config/db");

async function logAudit(userId, action, details, ip) {
  try {
    await prisma.auditLog.create({
      data: { userId, action, details, ip },
    });
  } catch (error) {
    console.error("[Audit Log Error]", error.message);
  }
}

module.exports = { logAudit };
