"use client";
import { ArrowRight, ArrowUpRight, ExternalLink, Headphones, Heart, MapPin, MessageCircle, MessageSquare, Play, Star } from 'lucide-react';
import { instagramHandle, instagramUrl, spotifyPlaylistId } from '@/lib/demo-data';
import { InstagramIcon } from '@/components/shaky-social-icons';
import { useShaky } from '@/components/shaky-store';

const WHATSAPP_URL = 'https://wa.me/message/LQUZ6RVNYXGNC1';

// Contenido de vitrina tomado del diseño de referencia. Las cifras de
// reproducciones y reacciones son de maqueta: reemplazar por datos reales
// de la cuenta antes de publicar.
const HIGHLIGHTS: [string, string][] = [
  ['Clientes', '/assets/mark.webp'],
  ['Menú', '/assets/pollo.webp'],
  ['Procesos', '/assets/post-1.webp'],
  ['Tips', '/assets/post-2.webp'],
  ['Eventos', '/assets/post-6.webp'],
  ['Q&A', ''],
];

const POSTS: { title: string; views: string; image: string }[] = [
  { title: 'Mi almuerzo post-entreno favorito 🤩', views: '125 mil', image: '/assets/post-0.webp' },
  { title: 'Disciplina también se comparte 💪', views: '210 mil', image: '/assets/post-2.webp' },
  { title: 'Meal prep para la semana', views: '398 mil', image: '/assets/post-3.webp' },
  { title: 'Shake de chocolate real ⚡', views: '98 mil', image: '/assets/post-4.webp' },
];

const TESTIMONIALS: { user: string; since: string; quote: string; avatar: string; image: string; likes: string; comments: string }[] = [
  { user: 'valentina_trf', since: '2 sem', quote: 'Mis almuerzos favoritos sin complicarme la vida. ¡Todo delicioso! 💛', avatar: '/assets/person-0.webp', image: '/assets/post-0.webp', likes: '2.4 mil', comments: '86' },
  { user: 'juanp.c', since: '3 sem', quote: 'Práctico, saludable y con muy buen sabor. Se nota la calidad. 👊', avatar: '/assets/person-1.webp', image: '/assets/post-5.webp', likes: '1.8 mil', comments: '42' },
  { user: 'mariajose.g', since: '1 sem', quote: 'El shake de vainilla es otro nivel. 😍', avatar: '/assets/person-2.webp', image: '/assets/post-4.webp', likes: '3.1 mil', comments: '74' },
];

function Scribble({ className = '' }: { className?: string }) {
  return (
    <svg className={'cm-scribble ' + className} viewBox="0 0 260 22" fill="none" aria-hidden="true">
      <path d="M4 15C46 5 98 4 150 8c22 2 48 5 62 9-30 2-74-1-112-1-24 0-44 1-58 3 34 3 84 3 128 1" stroke="#ffe500" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function Crown({ className = '' }: { className?: string }) {
  return (
    <svg className={'cm-crown ' + className} viewBox="0 0 48 40" fill="none" aria-hidden="true">
      <path d="M5 33 3 9l12 10L24 4l9 15 12-10-2 24z" stroke="#ffe500" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function ComunidadPage() {
  const { setReviewOpen } = useShaky();

  return (
    <div className="cm">
      <section className="wrap cm-hero">
        <div className="cm-hero-copy">
          <h1>COMUNIDAD<br /><em>SHAKY</em></h1>
          <p>Personas reales, resultados reales.<Scribble /></p>
        </div>
        <div className="cm-hero-art">
          <img src="/assets/community-mobile.webp" alt="Clienta de Mr. Shaky disfrutando un bowl" />
          <Crown className="cm-crown-hero" />
          <span className="cm-sticker">DISCIPLINA<br />TAMBIÉN<br />SE COMPARTE</span>
        </div>
      </section>

      <a className="wrap cm-ig-bar" href={instagramUrl} target="_blank" rel="noreferrer">
        <span className="cm-ig-mark"><InstagramIcon size={30} /></span>
        <span className="cm-ig-copy">
          <strong>Síguenos en Instagram</strong>
          <span>Recetas, tips, entrenamientos, resultados y mucho más.</span>
        </span>
        <span className="btn cm-ig-btn">Ver perfil <ExternalLink size={17} /></span>
      </a>

      <section className="wrap cm-highlights" aria-label="Destacados de Instagram">
        {HIGHLIGHTS.map(([label, image]) => (
          <a key={label} className="cm-highlight" href={instagramUrl} target="_blank" rel="noreferrer">
            <span className="cm-highlight-ring">
              {image
                ? <img src={image} alt="" aria-hidden="true" />
                : <span className="cm-highlight-q" aria-hidden="true">?</span>}
            </span>
            <span>{label}</span>
          </a>
        ))}
      </section>

      <section className="wrap cm-block">
        <div className="cm-block-head">
          <h2>ÚLTIMAS PUBLICACIONES</h2>
          <a className="cm-see-all" href={instagramUrl} target="_blank" rel="noreferrer">Ver todas <ArrowRight size={16} /></a>
        </div>
        <div className="cm-posts">
          {POSTS.map(p => (
            <a key={p.title} className="cm-post" href={instagramUrl} target="_blank" rel="noreferrer">
              <span className="cm-post-media">
                <img src={p.image} alt="" aria-hidden="true" />
                <span className="cm-post-badge" aria-hidden="true"><Play size={13} fill="currentColor" /></span>
              </span>
              <h3>{p.title}</h3>
              <span className="cm-post-views"><Play size={12} fill="currentColor" />{p.views}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="wrap cm-block">
        <div className="cm-block-head cm-block-head-stacked">
          <div>
            <h2>LO QUE DICE<br /><em>NUESTRA COMUNIDAD</em></h2>
            <p>Historias reales de personas que ya hacen parte de Mr. Shaky.<Scribble className="cm-scribble-sm" /></p>
          </div>
          <button className="cm-see-all" onClick={() => setReviewOpen(true)}>Deja tu opinión <ArrowUpRight size={16} /></button>
        </div>
        <div className="cm-cards">
          {TESTIMONIALS.map(t => (
            <article key={t.user} className="cm-card">
              <header className="cm-card-top">
                <span className="cm-avatar"><img src={t.avatar} alt="" aria-hidden="true" /></span>
                <span className="cm-card-who">
                  <strong>{t.user}</strong>
                  <span>{t.since}</span>
                </span>
                <span className="cm-card-dots" aria-hidden="true">···</span>
              </header>
              <img className="cm-card-media" src={t.image} alt="" aria-hidden="true" />
              <p>{t.quote}</p>
              <footer className="cm-card-stats">
                <span><Heart size={16} fill="#ff3b5c" color="#ff3b5c" />{t.likes}</span>
                <span><MessageSquare size={16} />{t.comments}</span>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap cm-block">
        <div className="cm-block-head cm-block-head-stacked">
          <div>
            <div className="cm-eyebrow"><Headphones size={16} />DALE PLAY A TU RUTINA</div>
            <h2>MURO MUSICAL</h2>
            <p>La comida está lista. Que suene tu próxima repetición.</p>
          </div>
        </div>
        {spotifyPlaylistId ? (
          <iframe
            title="Playlist oficial de Mr. Shaky en Spotify"
            className="cm-spotify"
            src={`https://open.spotify.com/embed/playlist/${spotifyPlaylistId}`}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        ) : (
          <a className="btn" href="https://open.spotify.com/search/workout/playlists" target="_blank" rel="noreferrer">Explorar Spotify <ArrowUpRight size={17} /></a>
        )}
      </section>

      <section className="wrap cm-share">
        <Crown className="cm-crown-a" />
        <Crown className="cm-crown-b" />
        <div className="cm-share-copy">
          <h2>Comparte tu experiencia</h2>
          <p>Etiqueta a @{instagramHandle}<br />y sé parte de nuestra comunidad.</p>
          <div className="cm-share-actions">
            <a className="btn" href={instagramUrl} target="_blank" rel="noreferrer"><InstagramIcon size={18} /> Publicar en Instagram</a>
            <button className="btn outline" onClick={() => setReviewOpen(true)}><Star size={17} /> Dejar una reseña</button>
          </div>
        </div>
        <div className="cm-share-art" aria-hidden="true">
          <span className="cm-phone">
            <span className="cm-phone-top"><span className="cm-phone-dot" />@{instagramHandle}</span>
            <img src="/assets/post-4.webp" alt="" />
            <span className="cm-phone-caption">Mi bowl favorito del mes 🤩</span>
          </span>
        </div>
      </section>

      <section className="wrap cm-block cm-connect">
        <div className="cm-block-head"><h2>HAZ PARTE DE LA FAMILIA</h2></div>
        <div className="cm-connect-grid">
          <a className="cm-connect-card" href={instagramUrl} target="_blank" rel="noreferrer">
            <InstagramIcon size={24} />
            <h3>Síguenos</h3>
            <p>Menú, recetas y clientes reales en @{instagramHandle}.</p>
          </a>
          <a className="cm-connect-card" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            <MessageCircle size={24} />
            <h3>Escríbenos</h3>
            <p>Resolvemos tus dudas directo por WhatsApp.</p>
          </a>
          <a className="cm-connect-card" href="/#nosotros">
            <MapPin size={24} />
            <h3>Visítanos</h3>
            <p>Al lado del parqueadero del Imperio, Turbo.</p>
          </a>
        </div>
      </section>
    </div>
  );
}
