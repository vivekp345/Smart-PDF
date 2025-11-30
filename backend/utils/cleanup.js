import fs from 'fs';
import path from 'path';

export const cleanUploadsFolder = () => {
  const uploadDir = 'uploads/';

  if (!fs.existsSync(uploadDir)) return;

  fs.readdir(uploadDir, (err, files) => {
    if (err) return console.error("❌ Cleanup Error:", err);

    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);

      fs.stat(filePath, (err, stats) => {
        if (err) return;

        // Calculate time difference
        const now = Date.now();
        const fileTime = new Date(stats.ctime).getTime();
        const diffHours = (now - fileTime) / (1000 * 60 * 60);

        // Delete if older than 1 hour
        if (diffHours > 1) {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete ${file}`);
            else console.log(`🧹 Janitor: Deleted old file ${file}`);
          });
        }
      });
    });
  });
};