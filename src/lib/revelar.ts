// Animação de entrada: ao rolar a página, cada foto surge com fade e uma leve subida.
// Só fotos: os textos (títulos, cardápio, avaliações, informações, rodapé) ficam sempre visíveis, sem animação.
// Só roda com JS (a classe .js no <html> esconde os blocos antes) e sem prefers-reduced-motion.
// Fotos de uma mesma grade entram em sequência (atraso por posição na linha).

const BLOCOS = [
  '.casa__foto',
  '.espaco__grade > li',
  '.destaques__grade > li',
  '.instagram__grade > li',
  '.galeria__grade > li',
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
