// Gera o padrão de fundo do site, com a âncora, o barco e as ondas (imagens/ancora-boni.png, barco-boni.png
// e mar-boni.png) em silhueta de uma cor só, espalhados num azulejo que se repete sem emenda:
// - public/padrao-fundo.png: para o fundo azul (desenhos num azul um pouco mais escuro)
// - public/padrao-fundo-bege.png: para as categorias bege do cardápio (desenhos num bege um pouco mais escuro)
// Uso: node scripts/padrao-fundo.mjs
// Para mudar as cores, o tamanho ou a posição dos desenhos, edite CORES, LADO e PECAS abaixo e rode de novo.
import sharp from 'sharp';

const CORES = {
  'padrao-fundo': { r: 0, g: 57, b: 124 }, // azul só um pouco mais escuro que o fundo (#01418B), para ficar discreto
  'padrao-fundo-bege': { r: 229, g: 209, b: 181 }, // bege um pouco mais escuro que o fundo (#F0DEC5)
};
const LADO = 640; // tamanho do azulejo, em px (aparece em 320px: o arquivo é 2x para telas de alta densidade)

// x, y = centro do desenho; w = largura; rot = giro em graus
const PECAS = [
  { arq: 'ancora', x: 110, y: 120, w: 110, rot: -14 },
  { arq: 'mar', x: 450, y: 90, w: 210, rot: 6 },
  { arq: 'barco', x: 470, y: 330, w: 190, rot: 8 },
  { arq: 'mar', x: 170, y: 400, w: 190, rot: -8 },
  { arq: 'ancora', x: 340, y: 560, w: 96, rot: 18 },
  { arq: 'barco', x: 90, y: 590, w: 120, rot: -10 },
];

// silhueta: toda parte desenhada (contorno e preenchimento) vira a cor; o branco e o transparente somem
async function silhueta(arq, largura, rot, COR) {
  const { data, info } = await sharp(`imagens/${arq}-boni.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  // 1) máscara de um canal: o quanto cada pixel é "tinta" (opaco e não branco)
  const mascara = Buffer.alloc(info.width * info.height);
  for (let i = 0; i < info.width * info.height; i++) {
    const [r, g, b, a] = data.subarray(i * 4, i * 4 + 4);
    const claro = Math.min(r, g, b); // branco = 255
    const tinta = claro > 200 ? Math.max(0, (255 - claro) / 55) : 1; // transição suave no serrilhado do branco
    mascara[i] = Math.round(a * tinta);
  }
  // 2) reduz e gira só a máscara (em tons de cinza, sem cor para vazar nas bordas)
  const m = await sharp(mascara, { raw: { width: info.width, height: info.height, channels: 1 } })
    .resize({ width: largura })
    .rotate(rot, { background: '#000' })
    .extractChannel(0)
    .raw().toBuffer({ resolveWithObject: true });
  // 3) pinta: cor fixa e a máscara como transparência
  const w = m.info.width, h = m.info.height;
  const px = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) px.set([COR.r, COR.g, COR.b, m.data[i]], i * 4);
  return sharp(px, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer({ resolveWithObject: true });
}

for (const [nome, cor] of Object.entries(CORES)) {
const camadas = [];
for (const p of PECAS) {
  const { data, info } = await silhueta(p.arq, p.w, p.rot, cor);
  const left = Math.round(p.x - info.width / 2);
  const top = Math.round(p.y - info.height / 2);
  // repete nas bordas para o azulejo emendar sem corte
  for (const dx of [-LADO, 0, LADO]) for (const dy of [-LADO, 0, LADO]) {
    const l = left + dx, t = top + dy;
    if (l + info.width <= 0 || t + info.height <= 0 || l >= LADO || t >= LADO) continue;
    // o sharp não aceita camada saindo do quadro: recorta a parte visível
    const cx = Math.max(0, -l), cy = Math.max(0, -t);
    const cw = Math.min(info.width - cx, LADO - Math.max(l, 0));
    const ch = Math.min(info.height - cy, LADO - Math.max(t, 0));
    const pedaco = await sharp(data).extract({ left: cx, top: cy, width: cw, height: ch }).toBuffer();
    camadas.push({ input: pedaco, left: Math.max(l, 0), top: Math.max(t, 0) });
  }
}

await sharp({ create: { width: LADO, height: LADO, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite(camadas)
  .png({ compressionLevel: 9 })
  .toFile(`public/${nome}.png`);
console.log(`public/${nome}.png gerado`);
}
