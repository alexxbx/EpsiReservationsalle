import emailjs from "@emailjs/browser";

type BookingEmail = {
  name: string;
  email: string;
  roomName: string;
  building: string;
  startsAt: string;
  endsAt: string;
  reservationId: string;
};

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const contactTemplateId = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export type ContactEmail = {
  toName: string;
  toEmail: string;
  fromName: string;
  fromEmail: string;
  message: string;
};

export function isEmailConfirmationConfigured(): boolean {
  return Boolean(serviceId && templateId && publicKey);
}

export async function sendContactEmail(contact: ContactEmail): Promise<void> {
  if (!serviceId || !contactTemplateId || !publicKey) {
    throw new Error("L’e-mail de contact n’est pas configuré. Ajoutez VITE_EMAILJS_CONTACT_TEMPLATE_ID dans le fichier .env puis redémarrez l’application.");
  }

  await emailjs.send(
    serviceId,
    contactTemplateId,
    {
      to_email: contact.toEmail,
      to_name: contact.toName,
      from_name: contact.fromName,
      from_email: contact.fromEmail,
      message: contact.message,
    },
    { publicKey },
  );
}

export async function sendBookingConfirmation(booking: BookingEmail): Promise<void> {
  if (!serviceId || !templateId || !publicKey) {
    throw new Error("L’envoi d’e-mail n’est pas configuré. Ajoutez les identifiants EmailJS dans le fichier .env puis redémarrez l’application.");
  }

  await emailjs.send(
    serviceId,
    templateId,
    {
      to_email: booking.email,
      to_name: booking.name,
      room_name: booking.roomName,
      building: booking.building,
      booking_date: new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(booking.startsAt)),
      start_time: new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(booking.startsAt)),
      end_time: new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(booking.endsAt)),
      reservation_id: booking.reservationId,
    },
    { publicKey },
  );
}
