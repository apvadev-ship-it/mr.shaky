"use client";
import { ArrowUpRight, ArrowRight, Headphones, MapPin, MessageCircle, Star } from 'lucide-react';
import { spotifyPlaylistId, instagramHandle, instagramUrl } from '@/lib/demo-data';
import { Review } from '@/components/shaky-dialogs';
import { InstagramIcon } from '@/components/shaky-social-icons';
import { useShaky } from '@/components/shaky-store';

const WHATSAPP_URL = 'https://wa.me/message/LQUZ6RVNYXGNC1';

export function ComunidadSection({ full = false }: { full?: boolean }) {
  const { reviews, setReviewOpen } = useShaky();
  const avgRating = (reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1);
  return (
    <section className="community light" id="comunidad">
      {full && (
        <div className="wrap community-intro">
          <span className="eyebrow">MÁS QUE COMIDA</span>
          <h2>LA COMUNIDAD SHAKY</h2>
          <p>Gente real entrenando, comiendo bien y compartiendo su progreso. Esto es lo que construimos juntos.</p>
          <div className="community-stats">
            <div><strong>{reviews.length}+</strong><span>Reseñas de la familia</span></div>
            <div><strong>{avgRating}</strong><span>Calificación promedio</span></div>
            <div><strong>2.9K+</strong><span>Siguiéndonos en Instagram</span></div>
          </div>
        </div>
      )}
      <div className="wrap community-grid">
        <div>
          <div className="section-head">
            <div>
              <div className="tool-heading"><Headphones /><span className="eyebrow">DALE PLAY A TU RUTINA</span></div>
              <h2>MURO MUSICAL</h2>
              <p>La comida está lista. Que suene tu próxima repetición.</p>
            </div>
          </div>
          {spotifyPlaylistId ? (
            <iframe title="Playlist oficial de Mr. Shaky en Spotify" className="spotify-frame" src={`https://open.spotify.com/embed/playlist/${spotifyPlaylistId}`} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
          ) : (
            <div className="music-card">
              <div className="music-art"><Headphones size={55} /></div>
              <div>
                <span className="eyebrow">MR. SHAKY GYM MIX</span>
                <h3>Tu energía<br />tiene soundtrack.</h3>
                <p>La playlist oficial llegará pronto.</p>
                <a href="https://open.spotify.com/search/workout/playlists" target="_blank" rel="noreferrer" className="btn">Explorar Spotify <ArrowUpRight size={17} /></a>
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="section-head">
            <div><h2>LA FAMILIA SHAKY</h2><p>{avgRating} / 5</p></div>
            <button className="review-link" onClick={() => setReviewOpen(true)}>Ver todas <ArrowUpRight size={16} /></button>
          </div>
          <div className="review-grid">{reviews.slice(-2).map(r => <Review key={r.id} r={r} />)}</div>
          <button className="text-button" onClick={() => setReviewOpen(true)}>Deja tu opinión <ArrowRight size={17} /></button>
        </div>
      </div>

      {full && (
        <div className="wrap all-reviews-block">
          <div className="section-head">
            <div><h2>TODAS LAS OPINIONES</h2><p>Lo que dice la familia Shaky, sin editar.</p></div>
          </div>
          <div className="all-reviews-grid">{reviews.map(r => <Review key={r.id} r={r} />)}</div>
        </div>
      )}

      {full && (
        <a className="wrap ig-card" href={instagramUrl} target="_blank" rel="noreferrer">
          <div className="ig-card-icon"><InstagramIcon size={26} /></div>
          <div className="ig-card-body">
            <span className="eyebrow">SÍGUENOS EN INSTAGRAM</span>
            <h3>@{instagramHandle}</h3>
            <p><MapPin size={14} /> Al lado del parqueadero del Imperio, Turbo · Jugos · Proteínas · Sanduches · Helados</p>
          </div>
          <span className="btn dark">Seguir <ArrowUpRight size={17} /></span>
        </a>
      )}

      {full && (
        <div className="wrap join-block">
          <div className="section-head">
            <div><h2>HAZ PARTE DE LA FAMILIA</h2><p>Tres formas de conectar con nosotros.</p></div>
          </div>
          <div className="join-grid">
            <a className="join-card" href={instagramUrl} target="_blank" rel="noreferrer">
              <InstagramIcon size={24} />
              <h3>Síguenos</h3>
              <p>Menú, recetas y clientes reales en @{instagramHandle}.</p>
            </a>
            <a className="join-card" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <MessageCircle size={24} />
              <h3>Escríbenos</h3>
              <p>Resolvemos tus dudas directo por WhatsApp.</p>
            </a>
            <button className="join-card" onClick={() => setReviewOpen(true)}>
              <Star size={24} />
              <h3>Cuéntanos tu experiencia</h3>
              <p>Tu reseña ayuda a otros a decidirse.</p>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
