// Gera as máscaras das pinceladas dos títulos a partir das pinceladas reais do cardápio impresso.
// Uso: node scripts/pinceladas.mjs   (gera public/pinceladas/pincelada-1.webp ... e imprime as medidas)
//
// Para cada recorte (pincelada creme numa página azul do cardápio):
// 1. "quanto é tinta": projeta a cor de cada pixel na reta azul do fundo → creme da tinta (0 = fundo, 1 = tinta),
//    o que preserva os fiapos, as falhas do pincel seco e as bordas suaves;
// 2. tapa as letras: o que é fundo mas não se liga à borda do recorte (fica cercado de tinta) vira tinta;
//    falhas abertas para fora continuam abertas. O buraco é engordado 2px para não sobrar contorno das letras;
// 3. amplia 2× (lanczos) e salva só o canal alfa (branco + transparência) em WebP.
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const sharp = createRequire(import.meta.url)('sharp');

const FUNDO = [62, 99, 119];   // azul do papel (#3E6377)
const TINTA = [240, 222, 197]; // creme da pincelada (#F0DEC5)
// Só pinceladas em que as letras ficam inteiras dentro da tinta ("Águas" e "Caipiras" ficaram de fora:
// o "A" e o "p" passam da borda e se ligam ao fundo, então não dá para tapar as letras).
const RECORTES = [
  { pagina: 'aguas', left: 103, top: 362, width: 394, height: 129 },       // Sucos
  { pagina: 'coqueteis', left: 39, top: 40, width: 510, height: 141 },     // Coquetéis
  { pagina: 'doses', left: 52, top: 53, width: 507, height: 138 },         // Doses Premium
  { pagina: 'doses', left: 119, top: 740, width: 366, height: 104 },       // Doses
];

const saida = new URL('../public/pinceladas/', import.meta.url);
await mkdir(saida, { recursive: true });
const d = TINTA.map((v, i) => v - FUNDO[i]);
const d2 = d.reduce((s, v) => s + v * v, 0);
const suave = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

for (const [n, r] of RECORTES.entries()) {
  const { data, info } = await sharp(fileURLToPath(new URL(`../imagens/cardapio_${r.pagina}.png`, import.meta.url)))
    .extract(r).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const t = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let s = 0; for (let c = 0; c < 3; c++) s += (data[i * 3 + c] - FUNDO[c]) * d[c];
    t[i] = suave(0.25, 0.8, s / d2); // tira o ruído da textura do fundo
  }
  // fundo ligado à borda = "fora"; o resto do fundo são as letras (buracos)
  const fora = new Uint8Array(N); const pilha = [];
  for (let x = 0; x < W; x++) pilha.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) pilha.push(y * W, y * W + W - 1);
  while (pilha.length) {
    const k = pilha.pop(); if (fora[k] || t[k] >= 0.5) continue; fora[k] = 1;
    const x = k % W, y = (k / W) | 0;
    if (x > 0) pilha.push(k - 1); if (x < W - 1) pilha.push(k + 1); if (y > 0) pilha.push(k - W); if (y < H - 1) pilha.push(k + W);
  }
  const buraco = new Uint8Array(N);
  for (let i = 0; i < N; i++) if (t[i] < 0.5 && !fora[i]) buraco[i] = 1;
  // engorda o buraco 2px (só por dentro da tinta) para não ficar o contorno das letras
  const tapado = Float32Array.from(t);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let perto = false;
    for (let dy = -2; dy <= 2 && !perto; dy++) for (let dx = -2; dx <= 2; dx++) {
      const xx = x + dx, yy = y + dy;
      if (xx >= 0 && yy >= 0 && xx < W && yy < H && buraco[yy * W + xx]) { perto = true; break; }
    }
    if (perto) tapado[y * W + x] = 1;
  }
  const rgba = Buffer.alloc(N * 4);
  for (let i = 0; i < N; i++) { rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = 255; rgba[i * 4 + 3] = Math.round(tapado[i] * 255); }
  // Medidas do "miolo cheio" (onde a tinta cobre ≥ 90%), em fração da caixa: para encaixar o texto
  const cheio = (i) => tapado[i] > 0.9;
  const linhas = []; for (let y = 0; y < H; y++) { let c = 0; for (let x = Math.round(W * .2); x < Math.round(W * .8); x++) c += cheio(y * W + x); linhas.push(c / (W * .6)); }
  const y0 = linhas.findIndex((v) => v > 0.9), y1 = H - 1 - [...linhas].reverse().findIndex((v) => v > 0.9);
  const cols = []; for (let x = 0; x < W; x++) { let c = 0; for (let y = y0; y <= y1; y++) c += cheio(y * W + x); cols.push(c / (y1 - y0 + 1)); }
  const x0 = cols.findIndex((v) => v > 0.9), x1 = W - 1 - [...cols].reverse().findIndex((v) => v > 0.9);

  // 3 partes: ponta esquerda e direita (mantêm a proporção) e o miolo (estica com o título).
  // Os cortes ficam um pouco para dentro do miolo cheio, para a emenda cair em tinta cheia.
  const corteE = Math.round(x0 + W * 0.03), corteD = Math.round(x1 - W * 0.02);
  const grande = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .resize(W * 2, H * 2, { kernel: 'lanczos3' }).raw().toBuffer();
  const partes = { esq: [0, corteE * 2], meio: [corteE * 2, corteD * 2], dir: [corteD * 2, W * 2] };
  for (const [parte, [a, b]] of Object.entries(partes)) {
    await sharp(grande, { raw: { width: W * 2, height: H * 2, channels: 4 } })
      .extract({ left: a, top: 0, width: b - a, height: H * 2 })
      .webp({ quality: 90, alphaQuality: 100 })
      .toFile(fileURLToPath(new URL(`pincelada-${n + 1}-${parte}.webp`, saida)));
  }
  // proporções das pontas (largura ÷ altura) e miolo vertical: vão para o CSS (.pincel--N em global.css)
  console.log(`pincelada-${n + 1} (${r.pagina})  --pincel-pe: ${(corteE / H).toFixed(3)}; --pincel-pd: ${((W - corteD) / H).toFixed(3)};  miolo y ${(y0 / H).toFixed(2)}–${(y1 / H).toFixed(2)}`);
}
