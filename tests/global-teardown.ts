import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendDir = path.resolve(__dirname, '../../agcera-ms-bn');

const run = (command: string) => {
  execSync(command, {
    stdio: 'inherit',
    cwd: backendDir,
    env: { ...process.env, NODE_ENV: 'test' },
  });
};

export default async () => {
  try {
    run('pnpm exec ts-node -r tsconfig-paths/register scripts/cleanup-test-db.ts');
    run('pnpm exec sequelize-cli db:seed:undo:all');
  } catch {
    // ignore seed rollback errors
  }
};
