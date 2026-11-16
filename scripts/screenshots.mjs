// Capturas e verificações automáticas com Playwright, em todas as páginas.
// Uso: com o site rodando (npm run dev ou npm run preview), rode `npm run screenshots`.
// Opcional: URL=http://localhost:4321 npm run screenshots
// Falha (exit 1) se: houver erro no console, rolagem horizontal, foto com mais de 600px de largura CSS,
// foto distorcida (proporção diferente da natural sem object-fit: cover) ou se a galeria não se comportar.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = (process.env.URL ?? 'http://localhost:4321/').replace(/\/$/, '');
const SAIDA = 'capturas';
const LARGURAS = [390, 1440];
const PAGINAS = [
  { caminho: '/', nome: 'inicio' },
  { caminho: '/cardapio', nome: 'cardapio' },
  { caminho: '/galeria', nome: 'galeria' },
  { caminho: '/contato', nome: 'contato' },
];
const falhas = [];

await mkdir(SAIDA, { recursive: true });
const navegador = await chromium.launch();

for (const largura of LARGURAS) {
  for (const { caminho, nome } of PAGINAS) {
    const pagina = await navegador.newPage({ viewport: { width: largura, height: largura < 800 ? 844 : 900 } });
    const rotulo = `[${largura} ${caminho}]`;
    const erros = [];
    // erros do próprio site; avisos de serviços de terceiros (ex.: o mapa do Google, num iframe) não contam
    pagina.on('console', (m) => { if (m.type() === 'error' && (m.location().url ?? '').startsWith(BASE)) erros.push(m.text()); });
    pagina.on('pageerror', (e) => erros.push(String(e)));

    await pagina.goto(BASE + caminho, { waitUntil: 'networkidle' });
    // a tela de carregamento (logo) sai sozinha depois do load
    await pagina.waitForSelector('[data-carregando]', { state: 'detached', timeout: 8000 });

    // Força o carregamento de todas as imagens e revela os blocos animados antes de medir
    await pagina.evaluate(async () => {
      const imgs = [...document.images].filter((i) => i.getAttribute('src'));
      imgs.forEach((i) => { i.loading = 'eager'; });
      await Promise.all(imgs.map((i) => i.decode().catch(() => {})));
      await document.fonts.ready;
      document.querySelectorAll('.revelar').forEach((el) => el.classList.add('visivel'));
    });
    await pagina.waitForTimeout(1000);

    // 1. Rolagem horizontal
    const rolagem = await pagina.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
    if (rolagem.sw !== rolagem.iw) falhas.push(`${rotulo} rolagem horizontal: scrollWidth ${rolagem.sw} ≠ innerWidth ${rolagem.iw}`);

    // 2 e 3. Largura máxima e distorção (só imagens visíveis; diálogos fechados não contam)
    const medidas = await pagina.evaluate(() => [...document.images].map((img) => {
      const r = img.getBoundingClientRect();
      return {
        arquivo: decodeURIComponent(img.currentSrc || img.src).match(/imagens\/([^?&]+)/)?.[1] ?? img.currentSrc,
        w: r.width, h: r.height, nw: img.naturalWidth, nh: img.naturalHeight,
        fit: getComputedStyle(img).objectFit,
        visivel: r.width > 0 && r.height > 0 && !img.closest('dialog') && !img.closest('[hidden]'),
      };
    }));
    for (const m of medidas) {
      if (!m.visivel) continue;
      if (m.w > 600.5) falhas.push(`${rotulo} ${m.arquivo}: ${m.w.toFixed(0)}px de largura (máx. 600)`);
      if (m.nw && m.nh && m.fit !== 'cover') {
        const natural = m.nw / m.nh;
        const desvio = Math.abs(m.w / m.h - natural) / natural;
        if (desvio > 0.01) falhas.push(`${rotulo} ${m.arquivo}: distorcida (${(desvio * 100).toFixed(1)}%)`);
      }
    }
    console.log(`${rotulo} ${medidas.filter((m) => m.visivel).length} imagens medidas`);

    await pagina.screenshot({ path: `${SAIDA}/${nome}-${largura}.png`, fullPage: true });

    // Início: sem abas; seções separadas pela faixa de renda; "Ver cardápio" leva à página do cardápio
    if (caminho === '/') {
      const estado = await pagina.evaluate(() => ({
        abas: document.querySelectorAll('[role="tablist"]').length,
        divisores: document.querySelectorAll('.divisor .renda').length,
        verCardapio: [...document.querySelectorAll('a')].filter((a) => a.getAttribute('href') === '/cardapio').length,
      }));
      console.log(`${rotulo} início: ${estado.divisores} divisores de renda, ${estado.verCardapio} links para /cardapio`);
      if (estado.abas) falhas.push(`${rotulo} início: ainda há barra de abas`);
      if (estado.divisores < 6) falhas.push(`${rotulo} início: só ${estado.divisores} divisores de renda entre as seções`);
      if (!estado.verCardapio) falhas.push(`${rotulo} início: nenhum link para /cardapio`);
      // a faixa de renda vai de ponta a ponta da página (sem margem nas laterais)
      const faixa = await pagina.evaluate(() => {
        const r = document.querySelector('.divisor .renda').getBoundingClientRect();
        return { esq: Math.round(r.left), dir: Math.round(innerWidth - r.right) };
      });
      if (faixa.esq !== 0 || faixa.dir > 1) falhas.push(`${rotulo} início: a faixa de renda não ocupa a largura toda (${JSON.stringify(faixa)})`);
    }

    // Galeria: 12 fotos de início, filtro "Pratos", "Ver mais fotos" e foto ampliada (setas e legenda)
    if (caminho === '/galeria') {
      const galeria = pagina.locator('#galeria');
      const visiveis = () => galeria.locator('[data-galeria-grade] > li:not([hidden])').count();
      const inicial = await visiveis();
      if (inicial !== 12) falhas.push(`${rotulo} galeria: ${inicial} fotos de início, esperado 12`);
      await galeria.locator('[data-filtro="pratos"]').click();
      const pratos = await visiveis();
      await galeria.locator('[data-galeria-mais]').click();
      const pratosTodos = await visiveis();
      console.log(`${rotulo} galeria: ${inicial} de início; Pratos: ${pratos}, depois de Ver mais: ${pratosTodos}`);
      if (pratosTodos <= pratos) falhas.push(`${rotulo} galeria: Ver mais não mostrou mais fotos`);

      await galeria.locator('[data-galeria-grade] > li:not([hidden]) [data-ver]').first().click();
      await pagina.waitForTimeout(400);
      // a foto ampliada da galeria é só a imagem: sem nome, porção ou preço
      if (await pagina.locator('[data-ver-legenda]').isVisible()) falhas.push(`${rotulo} foto ampliada da galeria com legenda`);
      await pagina.screenshot({ path: `${SAIDA}/ver-foto-${largura}.png` });
      await pagina.locator('[data-ver-proxima]').click();
      await pagina.waitForTimeout(300);
      await pagina.keyboard.press('Escape');
    }

    for (const e of erros) falhas.push(`${rotulo} erro no console: ${e}`);
    await pagina.close();
  }
}

await navegador.close();

if (falhas.length) {
  console.error(`\n${falhas.length} problema(s):`);
  falhas.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log(`\nTudo certo. Capturas em ./${SAIDA}`);
