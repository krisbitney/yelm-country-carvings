async function hashPassword() {
  if (process.argv.length < 3) {
    console.error('Usage: bun hashPassword.ts <password>');
    process.exit(1);
  }

  const password = process.argv[2];

  // Hash the password using Bun's built-in password hashing utility
  const hash = await Bun.password.hash(password);

  console.log(hash);
}

hashPassword();
