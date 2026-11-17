// Fotos do site.
// - historia: as 3 fotos da introdução ("A casa"), definidas mais abaixo
// - galeria: todas as outras, separadas por categoria (os filtros da galeria)
// Campos: arquivo (em /imagens), alt (grafia normal; a caixa alta é só visual),
// nome / porcao / preco (fotos do cardápio: viram a legenda da foto ampliada; preços conferidos com cardapio.md),
// posicao (object-position, quando o assunto não está no centro).
// Não use as imagens cardapio_*.png nem vinhos*.png: são páginas do cardápio impresso.

export type Categoria = 'lagoa' | 'pratos' | 'copos' | 'gente';

export interface Foto {
  arquivo: string;
  alt: string;
  nome?: string;
  porcao?: string;
  preco?: string;
  posicao?: string;
}

export interface FotoGaleria extends Foto { categoria: Categoria }

export const categorias: { id: Categoria; nome: string }[] = [
  { id: 'lagoa', nome: 'A Lagoa' },
  { id: 'pratos', nome: 'Pratos' },
  { id: 'copos', nome: 'Copos' },
  { id: 'gente', nome: 'Gente' },
];

export const galeria: FotoGaleria[] = [
  // A Lagoa
  { categoria: 'lagoa', arquivo: 'vista_da_lagoa_para_o_bar.png', alt: 'O Bar do Boni visto da água, com barcos atracados e a mata atrás' },
  { categoria: 'lagoa', arquivo: 'deck_externo.jpg', alt: 'Trapiche do bar com jet ski atracado e o morro ao fundo' },
  { categoria: 'lagoa', arquivo: 'sunset_bar_do_boni.png', alt: 'Pôr do sol sobre a Lagoa da Conceição visto do Bar do Boni, com um barco na água' },
  { categoria: 'lagoa', arquivo: 'area_externa.jpg', alt: 'Espreguiçadeira laranja e guarda-sóis no deck à beira da Lagoa' },
  { categoria: 'lagoa', arquivo: 'prato_completo_vista_lagoa.jpg', alt: 'Mesa com pratos na beira do deck, com barcos na Lagoa ao fundo' },
  { categoria: 'lagoa', arquivo: 'entrada.jpg', alt: 'Letreiro de madeira do Bar do Boni com placas coloridas' },
  { categoria: 'lagoa', arquivo: 'entrada2.png', alt: 'Fachada de madeira do Bar do Boni entre árvores' },
  { categoria: 'lagoa', arquivo: 'imagem_praia_placas_goodvibes.jpg', alt: 'Placas coloridas apontando para boa conversa, cerveja gelada e música boa, com a praia ao fundo' },
  { categoria: 'lagoa', arquivo: 'area_do_bar.jpg', alt: 'Balcão do bar com prateleiras de bebidas e o logo do Boni' },

  // Pratos (os do cardápio levam nome, porção e preço)
  { categoria: 'pratos', arquivo: 'camarao_a_milanesa.png', alt: 'Camarão à milanesa com limão', nome: 'Camarão à milanesa', porcao: '350g / 500g', preco: '69,90 / 98,90' },
  { categoria: 'pratos', arquivo: 'lula_a_milanesa.png', alt: 'Anéis de lula empanados sobre alface', nome: 'Lula à dorê', porcao: '350g / 500g', preco: '58,90 / 80,90' },
  { categoria: 'pratos', arquivo: 'bolinho_de_siri.png', alt: 'Bolinhos de siri dourados', nome: 'Bolinho de siri', porcao: '6 un.', preco: '43,90' },
  { categoria: 'pratos', arquivo: 'pastel_de_camarao.png', alt: 'Mão segurando um pastel de camarão', nome: 'Mini pastel', porcao: '10 un.', preco: '41,90' },
  { categoria: 'pratos', arquivo: 'prato_completo2.jpg', alt: 'Porção com isca de peixe, camarão, batata frita e salada', nome: 'Mista especial da casa', porcao: '1 kg', preco: '175,90' },
  { categoria: 'pratos', arquivo: 'dadinho_de_tapioca2.png', alt: 'Dadinhos de tapioca com molho', nome: 'Dadinhos de tapioca', porcao: '8 un.', preco: '32,90' },
  { categoria: 'pratos', arquivo: 'hamburguer2.png', alt: 'Hambúrguer com bacon e batata rústica', nome: 'BBB bacon', porcao: 'Costela 180g e bacon', preco: '43,90' },
  { categoria: 'pratos', arquivo: 'ostra_gratinada.png', alt: 'Ostras gratinadas com limão', nome: 'Ostra gratinada', preco: 'Consulte' },
  // CONFIRMAR com o dono: a foto parece mostrar camarão empanado, não alho e óleo.
  { categoria: 'pratos', arquivo: 'imagem_prato_com_camarao_a_milanesa.jpg', alt: 'Prato de camarão com salada', nome: 'Camarão alho e óleo', porcao: 'Sem casca, 350g / 500g', preco: '84,90 / 120,90' },
  { categoria: 'pratos', arquivo: 'ostra_ao_bafo.png', alt: 'Ostras ao bafo com limão e molho', nome: 'Ostra ao bafo', preco: 'Consulte' },
  { categoria: 'pratos', arquivo: 'frios.png', alt: 'Tábua de frios com azeitonas, queijos e salame', nome: 'Tábua de frios', preco: 'Consulte' },
  { categoria: 'pratos', arquivo: 'peixe_prato_completo.jpg', alt: 'Peixe com arroz e salada na mesa de madeira', nome: 'Peixe inteiro', preco: 'Consulte' },
  { categoria: 'pratos', arquivo: 'ostra_gratinada2.png', alt: 'Ostras gratinadas com limão e salada' },
  { categoria: 'pratos', arquivo: 'pastel.png', alt: 'Pastéis dourados no prato' },
  { categoria: 'pratos', arquivo: 'porcao_de_bolinho_de_peixe.png', alt: 'Porção de bolinhos com molho e limão' },
  { categoria: 'pratos', arquivo: 'prato_para_2_completo.jpg', alt: 'Pratos para dois na mesa do deck, com a Lagoa ao fundo' },
  { categoria: 'pratos', arquivo: 'prato_completo.jpg', alt: 'Mesa com peixe, batata frita e molho' },
  { categoria: 'pratos', arquivo: 'prato_completo3.jpg', alt: 'Medalhões de carne sobre purê' },
  { categoria: 'pratos', arquivo: 'prato_completo4.png', alt: 'Porção de iscas com tomate e farofa' },
  { categoria: 'pratos', arquivo: 'prato_completo5.png', alt: 'Prato gratinado servido na cumbuca' },

  // Copos (os do cardápio levam nome, porção e preço)
  { categoria: 'copos', arquivo: 'caipirinha_foto_drink.jpg', alt: 'Caipirinha de maracujá no copo do bar, com a praia ao fundo', nome: 'Caipira', porcao: 'Limão, morango, maracujá ou abacaxi', preco: '24,90+' },
  { categoria: 'copos', arquivo: 'foto_drink8.jpg', alt: 'BBzinha: drink de morango com uma garrafa de Smirnoff Ice virada na taça', nome: 'BBzinha', porcao: 'Smirnoff Ice e morango', preco: '57,90' },
  { categoria: 'copos', arquivo: 'foto_drink2.jpg', alt: 'Gin tônica com limão na taça, com o mar ao fundo', nome: 'Gin tônica', porcao: 'Nacional / importado', preco: '29,90 / 36,90' },
  { categoria: 'copos', arquivo: 'foto_drink6.png', alt: 'Caipirinha de frutas vermelhas com rodela de limão', nome: 'Especial de frutas', porcao: '500ml', preco: '54,90' },
  { categoria: 'copos', arquivo: 'balde_de_cerveja_e_petisco.jpg', alt: 'Balde de cervejas ao lado de uma porção de petiscos', nome: 'Cerveja 600ml', porcao: 'Heineken, Original, Stella', preco: '18,90+' },
  { categoria: 'copos', arquivo: 'adega_de_vinhos.png', alt: 'Garrafas de vinho deitadas na adega', nome: 'Vinhos', porcao: 'Brancos e espumantes', preco: '119,90+' },
  // Drinks ainda sem nome (pedir ao dono)
  { categoria: 'copos', arquivo: 'foto_drink3.jpg', alt: 'Drink em taça sobre o deck, com a Lagoa ao fundo' },
  { categoria: 'copos', arquivo: 'foto_drink.jpg', alt: 'Drink vermelho com canudo rosa sobre o deck, com a Lagoa ao fundo' },
  { categoria: 'copos', arquivo: 'foto_drink5.jpg', alt: 'Mão segurando um drink alaranjado no bar' },
  { categoria: 'copos', arquivo: 'foto_drink4.jpg', alt: 'Drink alaranjado com canudo sobre a mesa do salão' },
  { categoria: 'copos', arquivo: 'foto_drink7.png', alt: 'Caipirinha de limão em taça' },

  // Gente
  { categoria: 'gente', arquivo: 'celebrando_com_cerveja.png', alt: 'Dois copos de cerveja brindando contra o pôr do sol na Lagoa' },
  { categoria: 'gente', arquivo: 'clientes23.png', alt: 'Duas amigas sorrindo com drinks na mão' },
  { categoria: 'gente', arquivo: 'cliente_tirando_foto_de_prato.png', alt: 'Cliente fotografando o prato com o celular' },
  { categoria: 'gente', arquivo: 'clientes.png', alt: 'Casal numa mesa à beira da Lagoa, com barcos ao fundo' },
  { categoria: 'gente', arquivo: 'prato_completo_barco_do_bar_do_boni_ao_fundo.jpg', alt: 'Pratos na mesa com o barco do Bar do Boni ao fundo' },
];

// Aba "A casa": as mesmas fotos da galeria (mesmo texto alternativo e legenda), escolhidas pelo nome do arquivo.
const daGaleria = (arquivo: string): Foto => {
  const f = galeria.find((g) => g.arquivo === arquivo);
  if (!f) throw new Error(`Foto não encontrada na galeria: ${arquivo}`);
  return f;
};

/** "O lugar": mosaico de 8 fotos. Posições 1, 4, 5 e 8 são as altas (ocupam 2 linhas no desktop):
 *  coloque ali as fotos verticais; nas outras, as que aguentam corte (as horizontais ficam ótimas). */
export const espaco: Foto[] = [
  'vista_da_lagoa_para_o_bar.png', // alta
  'area_do_bar.jpg',
  'prato_completo_vista_lagoa.jpg',
  'sunset_bar_do_boni.png', // alta
  'area_externa.jpg', // alta
  'imagem_praia_placas_goodvibes.jpg',
  'entrada.jpg',
  'deck_externo.jpg', // alta
].map(daGaleria);

/** Agenda musical: os 5 destaques do carrossel do hero (cartazes dos próximos eventos), na proporção 4:5
 *  (o tamanho de um post do Instagram, ex.: 1080 x 1350). Cada um leva ao `link`; sem `link`, ao Instagram do bar.
 *  Para trocar: coloque o cartaz em /imagens e troque a linha. */
export const agenda: (Foto & { link?: string })[] = [
  { arquivo: 'reveillon_2026.png', alt: 'Cartaz do Réveillon do Bar do Boni: 31 de dezembro de 2026, às 21h, com open bar, open food, queima de fogos e shows', link: '/reveillon' },
  // provisórias, até chegarem os cartazes dos próximos eventos
  daGaleria('celebrando_com_cerveja.png'),
  daGaleria('clientes23.png'),
  daGaleria('sunset_bar_do_boni.png'),
  daGaleria('foto_drink8.jpg'),
];

/** História ("A casa"): 3 fotos lado a lado. Ordem: esquerda, direita e, na frente, a do meio. */
export const historia: Foto[] = [
  daGaleria('entrada2.png'),     // esquerda
  daGaleria('area_do_bar.jpg'),  // direita
  daGaleria('entrada.jpg'),      // meio, na frente
];

/** "O menu": destaques com nome, porção e preço (6: 4 pratos e 2 drinks). */
export const destaques: Foto[] = [
  'camarao_a_milanesa.png',
  'pastel_de_camarao.png',
  'bolinho_de_siri.png',
  'prato_completo2.jpg',
  'caipirinha_foto_drink.jpg',
  'foto_drink2.jpg',
].map(daGaleria);
