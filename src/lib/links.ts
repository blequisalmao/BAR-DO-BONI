import site from '../data/site.json';

/** Link do WhatsApp de reservas, com a mensagem pronta. */
export const linkWhatsapp = () =>
  `https://wa.me/${site.whatsapp.numero}?text=${encodeURIComponent(site.whatsapp.mensagem)}`;
