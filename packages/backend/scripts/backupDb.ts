import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

async function backupDatabase() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../backups');
    const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

    // Ensure backup directory exists
    await fs.mkdir(backupDir, { recursive: true });

    // Extract connection details from POSTGRES_URL
    const url = new URL(process.env.POSTGRES_URL || '');
    const host = url.hostname;
    const port = url.port;
    const database = url.pathname.substring(1);
    const username = url.username;
    const password = url.password;

    // Create environment variable for password
    process.env.PGPASSWORD = password;

    // Create backup command
    const command = `pg_dump -h ${host} -p ${port} -U ${username} -d ${database} -f ${backupFile}`;

    // Execute backup
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating backup: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Backup stderr: ${stderr}`);
        return;
      }
      console.log(`Database backup created successfully at ${backupFile}`);
    });
  } catch (error) {
    console.error('Error in backup process:', error);
  }
}

backupDatabase();
