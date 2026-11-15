# Bar do Boni: site

Site de página única do Bar do Boni, na beira da Lagoa da Conceição, em Florianópolis/SC.
Feito com Astro, Tailwind CSS v4 e TypeScript. Saída estática, sem framework de UI.

**Páginas:**

- `/` (início): duas abas. **A casa** é a apresentação do bar: história (com a arte "Venha conhecer o Bar do Boni"), "O lugar" (fotos do espaço), "Da cozinha e do bar" (destaques com preço e botão para o cardápio), avaliações reais do Google e "Reserve seu evento conosco" (endereço, horário, WhatsApp e mapa). **Cardápio** tem o cardápio completo, em fundo azul.
- `/galeria` e `/contato`: uma página para cada, acessadas pelo rodapé. O link "Avaliações" do rodapé leva às avaliações na aba "A casa" (`/#avaliacoes`; o antigo `/avaliacoes` redireciona para lá). O contato reúne a chamada "Reserve seu evento conosco", os contatos, o endereço, o horário e o mapa (o antigo `/como-chegar` redireciona para `/contato`).

O cabeçalho (azul bem claro, com a logo em PNG e o botão "Reservar") fica sempre visível. O rodapé (azul) tem só os links HOME, GALERIA, AVALIAÇÕES e CONTATO, em Urbanist.

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

## Onde trocar cada coisa

| O quê | Arquivo |
|---|---|
| Fotos da aba "A casa" (`casa`, `espaco` = "O lugar", `destaques` = "Da cozinha e do bar") e da galeria (categoria, texto alternativo e legenda do cardápio: nome, porção, preço) | `src/data/fotos.ts` |
| Texto da introdução "A casa" | `src/components/Casa.astro` |
| Páginas (início, galeria, contato) | `src/pages/` |
| Links do rodapé | `src/components/Rodape.astro` |
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
- Títulos em **Urbanist 800**; corpo em **DM Sans**, de 16 a 18px.
- Três cores: base `#F1F9F9`, texto `#1F4E6B` e amarelo `#FFC72C` (só em botões, sublinhados e na palavra marcada; nunca como cor de texto).
- Espaçamentos em múltiplos de 8px, inclusive os 8px entre todas as fotos (variável `--junta`).
- Animações: tela de carregamento com a logo (só na 1ª visita da sessão), entrada das fotos ao rolar (os textos ficam sempre visíveis) e foto ampliada com o site desfocado atrás. Tudo respeita `prefers-reduced-motion`.
- Setas: um padrão só (quadrado amarelo, flecha azul, uma de cada lado), classe `.seta-lateral` em `global.css`.
- Sem degradê, sem emoji, sem sombra, cantos retos. O hover só muda cor e sublinhado; fotos não reagem ao hover.
- Fotos nunca distorcem: ficam numa moldura com proporção fixa e são cortadas (`object-fit: cover`), exceto na foto ampliada, que mostra a foto inteira.

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
