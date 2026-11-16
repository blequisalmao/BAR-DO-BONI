// Gera o QR Code das mesas apontando para o endereço do site (campo "url" de src/data/site.json).
// Uso: npm run qrcode            → usa o url do site.json
//      npm run qrcode -- https://outro-endereco.com.br
// Saída: qrcode/qrcode-mesa.svg (para a gráfica, vetorial) e qrcode/qrcode-mesa.png (2000 px).
import QRCode from 'qrcode';
import { mkdir, readFile } from 'node:fs/promises';

const site = JSON.parse(await readFile(new URL('../src/data/site.json', import.meta.url), 'utf8'));
const endereco = process.argv[2] ?? site.url;
const opcoes = { errorCorrectionLevel: 'H', margin: 2, color: { dark: '#01418BFF', light: '#F3B416FF' } };

await mkdir('qrcode', { recursive: true });
await QRCode.toFile('qrcode/qrcode-mesa.svg', endereco, { ...opcoes, type: 'svg' });
await QRCode.toFile('qrcode/qrcode-mesa.png', endereco, { ...opcoes, type: 'png', width: 2000 });
console.log(`QR Code gerado para ${endereco} em ./qrcode (svg e png).`);
