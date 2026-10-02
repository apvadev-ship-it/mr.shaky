"use client";
import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight, ArrowUpRight, Check, Mail } from 'lucide-react';
import { storeAddress } from '@/lib/demo-data';

export function LocationSection() {
  return (
    <section className="location-section">
      <div className="wrap">
        <div className="store-head">
          <h2 className="store-title">NUESTRA<br/><em>TIENDA</em></h2>
          <a className="store-directions" href={`https://www.google.com/maps/search/${encodeURIComponent(storeAddress)}`} target="_blank" rel="noreferrer">Cómo llegar <ArrowUpRight size={18} /></a>
        </div>
        <div className="location-grid">
          <div className="location-map">
            <iframe
              title="Ubicación Mr. Shaky Nutribar en Turbo, Antioquia"
              src={`https://www.google.com/maps?q=${encodeURIComponent(storeAddress)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <section className="nl">
      <div className="nl-card wrap">
        <div className="nl-body">
          <span className="nl-icon" aria-hidden="true"><Mail size={30} /></span>
          <h2 className="nl-title">Suscríbete a nuestro<br /><em>boletín de información</em></h2>
          <p className="nl-lead">
            Recibe promociones exclusivas, nuevos bowls, tips de nutrición y
            contenido saludable directo en tu correo.
          </p>

          {sent ? (
            <p className="nl-done"><Check size={20} aria-hidden="true" />¡Listo! Ya estás dentro de la familia Shaky.</p>
          ) : (
            <form
              className="nl-form"
              onSubmit={e => {
                e.preventDefault();
                setTouched(true);
                if (!email.trim() || !consent) return;
                setSent(true);
                toast.success('Te suscribiste al boletín Shaky');
              }}
            >
              <label className="sr-only" htmlFor="newsletter-email">Tu correo electrónico</label>
              <span className="nl-field">
                <Mail size={20} aria-hidden="true" />
                <input
                  id="newsletter-email" type="email" required
                  placeholder="Tu correo electrónico"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </span>
              <button className="nl-submit" type="submit">
                Suscribirme <ArrowRight size={20} aria-hidden="true" />
              </button>

              {/* Sin marcar de salida: el consentimiento para recibir correos
                  tiene que darlo la persona, no venir puesto. */}
              <label className="nl-consent">
                <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
                <span className="nl-box" aria-hidden="true"><Check size={14} strokeWidth={3.5} /></span>
                Acepto recibir correos con promociones y novedades de MR. SHAKY.
              </label>
              {touched && !consent && (
                <p className="nl-error" role="alert">Marca la casilla para poder enviarte el boletín.</p>
              )}
            </form>
          )}
        </div>

        <div className="nl-photo">
          <img src="/assets/bowl-hero.webp" alt="" aria-hidden="true" />
          <span className="nl-note handwritten" aria-hidden="true">
            Tips, recetas<br />y promociones<br />solo para ti
            <svg viewBox="0 0 70 60" aria-hidden="true">
              <path d="M62 4C58 22 44 38 20 46" fill="none" stroke="#ffe500" strokeWidth="4" strokeLinecap="round" />
              <path d="M10 36 8 48l13-2" fill="none" stroke="#ffe500" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}
