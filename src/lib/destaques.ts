// Destaques (<mark>) e pinceladas dos títulos (.pincel) pintados da esquerda para a direita quando entram na tela
// (uma vez só). O estilo e a transição ficam em global.css; este script só adiciona a classe .marcado.
// - Só roda com animação ligada (html.js-revelar: com JS e sem prefers-reduced-motion); senão o CSS já mostra pronto.
// - Vários destaques na mesma frase entram em sequência (--atraso-marca).
// - Na primeira visita, espera a tela de carregamento sair (evento boni:pronto), para a animação do topo não
//   acontecer escondida atrás dela.

const INTERVALO = 380; // ms entre um destaque e o seguinte na mesma frase

export function iniciarDestaques() {
  const raiz = document.documentElement;
  const alvos = [...document.querySelectorAll<HTMLElement>('mark, .pincel')];
  if (!alvos.length) return;
  if (!raiz.classList.contains('js-revelar') || !('IntersectionObserver' in window)) {
    alvos.forEach((a) => a.classList.add('marcado'));
    return;
  }

  // destaques: atraso em sequência dentro do mesmo bloco de texto (título ou parágrafo)
  document.querySelectorAll<HTMLElement>('mark').forEach((m) => {
    const bloco = m.closest('h1, h2, h3, p') ?? m.parentElement;
    const irmas = bloco ? [...bloco.querySelectorAll('mark')] : [m];
    m.style.setProperty('--atraso-marca', `${Math.max(0, irmas.indexOf(m)) * INTERVALO}ms`);
  });

  // No cardápio (.paleta-bege), as pinceladas das categorias são pintadas todas juntas, logo ao abrir a página,
  // em vez de uma a uma ao rolar.
  const deUmaVez = alvos.filter((a) => a.matches('.paleta-bege .pincel'));
  const aoRolar = alvos.filter((a) => !deUmaVez.includes(a));

  const comecar = () => {
    // força o estado inicial (sem tinta) a ser desenhado antes, para a transição acontecer
    requestAnimationFrame(() => requestAnimationFrame(() => deUmaVez.forEach((a) => a.classList.add('marcado'))));
    const observador = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('marcado');
        observador.unobserve(e.target);
      }
    }, { threshold: 0.6 });
    aoRolar.forEach((a) => observador.observe(a));
  };

  if (raiz.classList.contains('js-carregando')) addEventListener('boni:pronto', comecar, { once: true });
  else comecar();
}
