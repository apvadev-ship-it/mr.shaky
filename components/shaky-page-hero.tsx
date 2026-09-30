import { Crown } from 'lucide-react';

type Props = {
  title: string;
  accent: string;
  subtitle: string;
  image: string;
  /** Foto alternativa para móvil, cuando el recorte ancho no funciona. */
  mobileImage?: string;
  sticker?: string;
};

export function PageHero({ title, accent, subtitle, image, mobileImage, sticker }: Props) {
  const style = {
    '--hero-photo': `url('${image}')`,
    '--hero-photo-mobile': `url('${mobileImage ?? image}')`,
  } as React.CSSProperties;
  return (
    <section className="page-hero" style={style}>
      <div className="page-hero-photo" aria-hidden="true" />
      <div className="wrap page-hero-inner">
        <div>
          <h1>{title}<br /><em>{accent}</em></h1>
          <p>{subtitle}</p>
        </div>
        {sticker && (
          <span className="page-hero-sticker">
            {sticker.split('\n').map((line, i) => <span key={i}>{line}</span>)}
            <Crown size={40} />
          </span>
        )}
      </div>
    </section>
  );
}
