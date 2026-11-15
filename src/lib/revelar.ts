// Animação de entrada: ao rolar a página, cada bloco surge com fade e uma leve subida.
// Só roda com JS (a classe .js no <html> esconde os blocos antes) e sem prefers-reduced-motion.
// Fotos de uma mesma grade entram em sequência (atraso por posição na linha).

const BLOCOS = [
  '.secao__cab',
  '.casa__texto > *',
  '.casa__foto',
  '.cardapio details',
  '.galeria__grade > li',
  '.info > *',
  '.avaliacoes__lista > li',
  '.avaliacoes__acoes',
  '.rodape__marca',
  '.rodape__linha',
];

export function iniciarRevelar() {
  const raiz = document.documentElement;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    raiz.classList.remove('js-revelar');
    return;
  }

  const observador = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('visivel');
      observador.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  document.querySelectorAll<HTMLElement>(BLOCOS.join(',')).forEach((el) => {
    // atraso em cascata para itens irmãos (até 6 por linha)
    const irmaos = el.parentElement ? [...el.parentElement.children] : [el];
    const posicao = irmaos.length > 1 ? irmaos.indexOf(el) % 6 : 0;
    el.style.setProperty('--atraso', `${posicao * 80}ms`);
    el.classList.add('revelar');
    observador.observe(el);
  });
}
