import "dotenv/config";
import { z } from "zod";
import { closeDatabase, database } from "./db.js";

const role = process.argv[2];
const email = z.email().safeParse(process.argv[3]);
try {
  if ((role !== "admin" && role !== "student") || !email.success) {
    console.error("Usage : npm run admin:promote -- adresse@example.com");
    console.error("   ou : npm run admin:demote -- adresse@example.com");
    process.exitCode = 1;
  } else {
    const result = await database.run("UPDATE users SET role = ? WHERE LOWER(email) = ?", role, email.data.toLowerCase());
    if (result.changes === 0) {
      console.error(`Aucun compte trouvé pour ${email.data}.`);
      process.exitCode = 1;
    } else {
      console.log(`Le rôle du compte ${email.data} est maintenant « ${role} ».`);
    }
  }
} catch (error) {
  console.error("Impossible de modifier le rôle du compte :", error);
  process.exitCode = 1;
} finally {
  await closeDatabase();
}
