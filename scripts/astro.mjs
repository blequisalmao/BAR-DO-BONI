// Roda o Astro (dev, build, preview, check) com a letra do disco em maiúscula no Windows.
// Por quê: quando o terminal abre a pasta como "c:\..." (minúsculo, comum no terminal do VS Code), o Vite mistura
// "c:" e "C:" nos caminhos e o site sai quebrado: imagens com ImageNotFound no `npm run dev` e páginas
// sem CSS nenhum no `npm run build`. Em qualquer outro sistema, só repassa o comando.
// Uso (já configurado no package.json): node scripts/astro.mjs <comando> [opções]
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

let cwd = process.cwd();
if (process.platform === 'win32' && /^[a-z]:/.test(cwd)) cwd = cwd[0].toUpperCase() + cwd.slice(1);

const astro = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url));
const filho = spawn(process.execPath, [astro, ...process.argv.slice(2)], { cwd, stdio: 'inherit' });
filho.on('exit', (codigo, sinal) => (sinal ? process.kill(process.pid, sinal) : process.exit(codigo ?? 0)));
// Ctrl+C: repassa para o Astro encerrar o servidor direito
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => filho.kill(s));
