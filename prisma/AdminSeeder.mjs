import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    const adminExist = await prisma.admins.count();
    if (adminExist === 0) {
      const password = await bcrypt.hash("admin1234", 10);
      await prisma.admins.create({
        data: {
          Email: "admin@mail.com",
          Password: password,
          Name: "Admin",
        },
      });
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
