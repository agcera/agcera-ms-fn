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
    run('pnpm exec sequelize-cli db:create');
  } catch {
    // database might already exist
  }

  run('pnpm db:rollback');
  run('pnpm db:migrate');
  run('pnpm db:seed');
};
