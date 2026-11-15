import type { ImageMetadata } from 'astro';

// Todas as fotos de /imagens, menos as páginas do cardápio impresso (cardapio_*, vinhos*).
const arquivos = import.meta.glob<{ default: ImageMetadata }>(
  ['/imagens/*.{jpg,jpeg,png,webp}', '!/imagens/cardapio_*', '!/imagens/vinhos*'],
  { eager: true },
);

/** Devolve a imagem de /imagens pelo nome do arquivo. Falha no build se o arquivo não existir. */
export function imagem(nome: string): ImageMetadata {
  const mod = arquivos[`/imagens/${nome}`];
  if (!mod) throw new Error(`Foto não encontrada: imagens/${nome}`);
  return mod.default;
}

/** Larguras geradas para todas as fotos (as originais têm 600px). */
export const LARGURAS = [300, 600];

/** Prefixa "R$" quando o preço é numérico; "Consulte" fica como está. */
export const formatarPreco = (preco: string) => (/\d/.test(preco) ? `R$ ${preco}` : preco);
