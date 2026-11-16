# Bar do Boni: site

Site de página única do Bar do Boni, na beira da Lagoa da Conceição, em Florianópolis/SC.
Feito com Astro, Tailwind CSS v4 e TypeScript. Saída estática, sem framework de UI.

**Páginas:**

- `/` (início): a apresentação do bar, uma seção atrás da outra, separadas pela faixa de renda de bilro (de ponta a ponta da página): hero ("Música ao vivo / de quinta a domingo / na Lagoa da Conceição", botões e faixa de fotos em carrossel infinito), história, "O lugar" (mosaico e botão para a galeria), "Da cozinha e do bar" (6 destaques com preço e o botão "Ver cardápio"), agenda, avaliações reais do Google, Instagram e "Reserve seu evento conosco" (endereço, horário, WhatsApp e mapa).
- `/cardapio`: o cardápio completo, com as categorias alternando fundo azul e amarelo, como as páginas do cardápio impresso.
- `/galeria` e `/contato`: uma página para cada. Links com âncora (`/#agenda`, `/#avaliacoes`) levam direto à seção da página inicial (o antigo `/avaliacoes` redireciona para lá). O contato reúne a chamada "Reserve seu evento conosco", os contatos, o endereço, o horário e o mapa (o antigo `/como-chegar` redireciona para `/contato`).

O cabeçalho (amarelo, com texto azul) fica sempre visível: logo, menu (Início, Cardápio, Agenda, Galeria, Contato), ícones do Instagram e do Facebook e o botão "Reservar". Abaixo de 1024px, o menu vira um botão que abre um painel. O rodapé (azul) tem os links grandes em Bricolage Grotesque, uma chamada, endereço, horário, contatos, redes e "Voltar ao topo".

## Rodar no computador

Precisa do Node (versão 22 ou mais nova).

```bash
npm install        # só na primeira vez
npm run dev        # abre em http://localhost:4321 e atualiza sozinho a cada mudança
```

Para conferir a versão final, igual à que vai para o ar:

```bash
npm run build      # gera a pasta dist/
npm run preview    # serve a dist/ em http://localhost:4321
```

### Capturas e verificações automáticas

Com o site rodando (`dev` ou `preview`):

```bash
npx playwright install chromium   # só na primeira vez
npm run screenshots               # ou: URL=http://localhost:4322 npm run screenshots
```

O script salva capturas em `capturas/` (todas as páginas em 390px e 1440px, mais a foto ampliada da galeria) e **falha** se houver erro no console, rolagem horizontal, foto com mais de 600px de largura ou foto distorcida.

**Windows:** os comandos `dev`, `build`, `preview` e `check` passam por `scripts/astro.mjs`, que corrige a letra do disco para maiúscula. Sem isso, num terminal aberto em `c:\...` (minúsculo, comum no VS Code), o `dev` falha com `ImageNotFound` e o `build` gera páginas sem CSS. Use sempre `npm run ...`, não `npx astro ...` direto.

## Onde trocar cada coisa

| O quê | Arquivo |
|---|---|
| Fotos da aba "A casa" (`hero` = carrossel, `historia` = as 3 fotos da história, `espaco` = mosaico de "O lugar", `destaques` = "Da cozinha e do bar", `instagram`) e da galeria (categoria, texto alternativo e legenda do cardápio: nome, porção, preço) | `src/data/fotos.ts` |
| Frase e botões do hero | `src/components/Hero.astro` |
| Texto da introdução "A casa" e chamadas das seções | `src/components/Casa.astro` |
| Agenda (eventos com data, hora, título, descrição e link; os que passaram somem sozinhos) | `src/data/agenda.json` |
| Instagram (as 6 fotos; com `link`, a foto aponta para um post) | `src/data/fotos.ts` → `instagram` |
| Páginas (início, galeria, contato) | `src/pages/` |
| Links do menu | `src/components/Cabecalho.astro` |
| Links e informações do rodapé | `src/components/Rodape.astro` |
| Faixa de renda de bilro (divisor entre as seções da home) | `src/components/Renda.astro` (desenho) e `.divisor` em `src/components/Casa.astro` |
| Pinceladas dos títulos (tiradas do cardápio impresso) | `public/pinceladas/`, geradas por `node scripts/pinceladas.mjs`; variações `.pincel--1` a `.pincel--4` em `global.css` |
| Avaliações reais do Google escolhidas a dedo (em uso), nota e total | `src/data/avaliacoes.json` |
| Animação de entrada ao rolar (quais blocos animam) | `src/lib/revelar.ts` |
| Tela de carregamento com a logo | `src/components/Carregando.astro` |
| Cardápio completo (categorias, itens, descrições, preços) | `src/data/cardapio.json` |
| Endereço, telefone, WhatsApp, e-mail, redes, horário, domínio | `src/data/site.json` |
| Cores e fontes | `src/styles/global.css` (bloco `@theme`) |

**Fotos:** coloque o arquivo novo em `imagens/` e troque o nome em `fotos.ts` (na galeria, escolha a categoria: lagoa, pratos, copos ou gente). As fotos são otimizadas no build (AVIF e WebP, 300px e 600px). Não use as páginas do cardápio impresso (`cardapio_*.png`, `vinhos*.png`) como fotos: elas ficam fora do site de propósito.

**Mapa:** a página "Contato" mostra o mapa do Google com a localização do bar. Para trocar o ponto, edite `mapaEmbed` em `src/data/site.json` (e `mapa`, o link do botão "Abrir no mapa").

## Avaliações do Google (reais)

O site nunca inventa avaliações. Elas aparecem na aba "A casa". Hoje o site usa o modo manual (2), com avaliações escolhidas a dedo. Há três modos, nesta ordem:

1. **Automático (recomendado):** o build busca a nota, o total e até 5 avaliações recentes direto da API do Google Places.
   - No Google Cloud Console, ative a **Places API (New)** e crie uma chave de API (restrinja à Places API).
   - Descubra o **Place ID** do Bar do Boni no [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id).
   - Crie um arquivo `.env` na raiz (ou configure as variáveis na Vercel/Netlify):
     ```
     GOOGLE_PLACES_API_KEY=sua-chave
     GOOGLE_PLACE_ID=o-place-id
     ```
   - Rode `npm run build`. As avaliações são atualizadas a cada novo build (dá para agendar um build por semana na Vercel/Netlify).
2. **Manual:** sem a chave, o site usa `src/data/avaliacoes.json`. Cole ali avaliações reais do perfil no Google Maps.
3. **Vazio:** sem nenhuma das duas, a seção mostra só os botões "Ver avaliações no Google" e "Avaliar no Google".

## Regras de estilo (resumo)

- Tudo em caixa alta via CSS; nos arquivos de dados o texto fica em grafia normal.
- Títulos de seção e categorias do cardápio: **Aliya Ramsey** (`public/fonts/AliyaRamsey.ttf`) sobre uma **pincelada de verdade, recortada do cardápio impresso** (classe `.pincel`, com 4 variações; cada pincelada tem ponta esquerda, miolo e ponta direita, e só o miolo estica com o título). No fundo creme, pincel azul e letra creme; nos blocos `.tema-invertido`, o contrário. A pincelada tem o tamanho do texto, cobre as letras inteiras e **nunca quebra linha**: título longo vira duas pinceladas empilhadas (ver "Reserve seu evento conosco." em `Casa.astro`). Textos grandes (frase do hero, frase da história, links do menu e do rodapé) em **Bricolage Grotesque 800**;
- Cores: só duas, azul `#3E6377` e amarelo `#F3B416` (contraste 3,5:1). Fundo azul com texto, pinceladas, CTAs e destaques (palavra marcada, sublinhados) em amarelo; cabeçalho, rodapé e as categorias alternadas do cardápio (`.tema-invertido`) ao contrário, amarelos com texto azul, e ali CTAs e destaques ficam azuis. Tokens fixos `--azul`/`--amarelo` e papéis `--color-base`/`--color-texto`/`--color-ousada` em `global.css`.
- Espaçamentos em múltiplos de 8px, inclusive os 8px entre todas as fotos (variável `--junta`).
- Animações: tela de carregamento com a logo (só na 1ª visita da sessão), entrada das fotos ao rolar (os textos ficam sempre visíveis), foto ampliada com o site desfocado atrás e o carrossel do hero (passa a cada 5 s, para com o mouse/foco em cima, tem botão de pausar). Tudo respeita `prefers-reduced-motion`.
- Setas: um padrão só (quadrado amarelo, flecha azul, uma de cada lado), classe `.seta-lateral` em `global.css`.
- Ornamento: a faixa de **renda de bilro** (`Renda.astro`), na cor do texto (nunca amarela), só como divisor entre as seções da home, na largura toda da página.
- Sem degradê, sem emoji, sem sombra, cantos retos. Exceção: as 3 fotos da história, lado a lado com a do meio na frente (cantos de cima arredondados e contorno azul deslocado para cima e para a esquerda, `.pilha` em `Casa.astro`). O hover só muda cor e sublinhado; nas fotos clicáveis (todas abrem ampliadas, e as do Instagram são links) aparece um véu azul suave e o cursor vira a mãozinha (`.moldura::after` em `global.css`).
- Fotos nunca distorcem: ficam numa moldura com proporção fixa e são cortadas (`object-fit: cover`), exceto na foto ampliada, que mostra a foto inteira.

## Fonte dos títulos (Aliya Ramsey)

Arquivo em `public/fonts/AliyaRamsey.ttf` (pré-carregado no `Base.astro`), com os acentos do português. A pasta `font/` guarda os arquivos originais e fica fora do Git.

A pincelada foi calibrada para esta fonte, **medindo os pixels das letras** (as métricas que a fonte declara não batem com o desenho): `line-height: 1.35` e `padding` lateral em `.pincel` (`global.css`), e os tamanhos dos títulos limitados pela largura da tela para o mais longo caber numa linha no celular. Se trocar a fonte, meça e ajuste de novo.

**Licença:** confira se a licença da fonte permite uso em site comercial (webfont) e se o arquivo pode ficar num repositório público; se não puder, deixe o repositório privado ou sirva a fonte de outro lugar.

## Publicar (quando for a hora)

O site é estático: basta publicar a pasta `dist/`. Antes, troque `url` em `src/data/site.json` (e a linha `
**Vercel:** em vercel.com, "Add New → Project", importe o repositório. A Vercel reconhece o Astro sozinha (build `npm run build`, saída `dist`). Depois, em "Settings → Domains", ligue o domínio.

**Netlify:** em app.netlify.com, "Add new site → Import an existing project", escolha o repositório, com build command `npm run build` e publish directory `dist`. O domínio fica em "Domain management".

As duas publicam de novo sozinhas a cada `git push`.

## QR Code das mesas

```bash
npm run qrcode                                  # usa o "url" de src/data/site.json
npm run qrcode -- https://bardoboni.netlify.app # ou um endereço específico
```

Gera `qrcode/qrcode-mesa.svg` (vetorial, para a gráfica) e `qrcode/qrcode-mesa.png` (2000 px), nas cores do site. Rode de novo sempre que o endereço do site mudar, antes de imprimir.

## Apresentação da proposta

`apresentacao/index.html`: abra no navegador. Setas do teclado (ou os botões no canto) passam os slides; Ctrl+P salva em PDF, um slide por página. Os valores e os campos entre colchetes (`[Seu nome]`, `[seu WhatsApp]`, prazo) são para editar direto no arquivo.
