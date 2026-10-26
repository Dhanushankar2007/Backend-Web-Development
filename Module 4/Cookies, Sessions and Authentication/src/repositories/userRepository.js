const prisma = require('../db/prisma');
function findByEmail(email) {
return prisma.user.findUnique({ where: { email } }); // full row, for bcrypt only
}
function findPublicById(id) {
return prisma.user.findUnique({
where: { id },
select: { id: true, name: true, email: true }, // allowlist: no passwordHash
});
}
module.exports = { findByEmail, findPublicById };