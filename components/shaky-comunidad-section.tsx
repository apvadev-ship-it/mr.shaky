"use client";
import { ArrowUpRight, ArrowRight, Headphones } from 'lucide-react';
import { spotifyPlaylistId } from '@/lib/demo-data';
import { Review } from '@/components/shaky-dialogs';
import { useShaky } from '@/components/shaky-store';

export function ComunidadSection() {
  const { reviews, setReviewOpen } = useShaky();
  const avgRating = (reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1);
  return (
    <section className="community light" id="comunidad">
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
    </section>
  );
}
