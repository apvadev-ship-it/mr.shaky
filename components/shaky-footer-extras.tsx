"use client";
import { useState } from 'react';
import { toast } from 'sonner';
import { MapPin, ArrowUpRight, Mail, Zap, Gift, Bell } from 'lucide-react';
import { branches, storeAddress } from '@/lib/demo-data';

export function LocationSection() {
  const branch = branches[0];
  return (
    <section className="location-section">
      <div className="wrap">
        <div className="section-head">
          <div><div className="eyebrow"><MapPin size={16} />VISÍTANOS</div><h2>NUESTRA TIENDA</h2><p>Recogida en tienda, sin filas ni esperas.</p></div>
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
          <div className="location-list">
            <div className="location-card" key={branch.id}>
              <MapPin size={20} />
              <div>
                <h3>{branch.name}</h3>
                <p>{storeAddress}</p>
              </div>
              <a className="text-button" href={`https://www.google.com/maps/search/${encodeURIComponent(storeAddress)}`} target="_blank" rel="noreferrer">Cómo llegar <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const PERKS: [any, string][] = [
  [Zap, 'Recetas nuevas antes que nadie'],
  [Gift, 'Promos y descuentos exclusivos'],
  [Bell, 'Avisos de lanzamientos y eventos'],
];

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <section className="newsletter-section">
      <div className="wrap newsletter-wrap">
        <div className="newsletter-copy">
          <h2 className="newsletter-title">Tu próxima<br />comida favorita<br /><em>empieza aquí.</em></h2>
          <p className="newsletter-sub">Recetas, promos y lanzamientos directo a tu correo.</p>
          <ul className="newsletter-perks">{PERKS.map(([Icon, text]) => (
            <li key={text}><Icon size={16} />{text}</li>
          ))}</ul>
        </div>
        <div className="newsletter-panel">
          {sent ? (
            <div className="newsletter-success"><Mail size={22} /><span>¡Listo! Ya estás dentro de la familia Shaky.</span></div>
          ) : (
            <form className="newsletter-form" onSubmit={e => { e.preventDefault(); if (!email.trim()) return; setSent(true); toast.success('Te suscribiste al boletín Shaky'); }}>
              <label htmlFor="newsletter-email">Tu correo</label>
              <input id="newsletter-email" type="email" required placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} />
              <button className="btn" type="submit">Suscribirme <ArrowUpRight size={18} /></button>
              <span className="newsletter-fineprint">Sin spam. Cancela cuando quieras.</span>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
