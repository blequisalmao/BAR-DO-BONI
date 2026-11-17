import site from '../data/site.json';

/** Link do WhatsApp de reservas, com a mensagem pronta (a padrão do site.json, ou outra, ex.: a do Réveillon). */
export const linkWhatsapp = (mensagem: string = site.whatsapp.mensagem) =>
  `https://wa.me/${site.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`;
