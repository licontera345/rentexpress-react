import { cpSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
cpSync(join(root, 'WEB-INF'), join(root, 'dist', 'WEB-INF'), { recursive: true });
console.log('WEB-INF copiado a dist/');
