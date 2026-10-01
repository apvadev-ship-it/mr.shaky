"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowUpRight, ArrowRight, ShoppingBag, Search, Menu, Home, Utensils, CalendarDays, Headphones, Minus, Plus, Trash2, Crown, Tag, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Toaster } from 'sonner';
import { products, money } from '@/lib/demo-data';
import { useShaky } from './shaky-store';
import { InstagramIcon, TikTokIcon, SpotifyIcon, YouTubeIcon } from './shaky-social-icons';

const NAV_LINKS: [string, string][] = [
  ['Inicio', '/'],
  ['Menú', '/menu'],
  ['Pedido', '/pedido'],
  ['Calculadora', '/calculadoras'],
  ['Comunidad', '/comunidad'],
];

export function ShakyChrome() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    count, cart, catalog, subtotal, discount, total, cartOpen, setCartOpen, navOpen, setNavOpen, changeQty, removeFromCart,
    couponInput, setCouponInput, appliedCoupon, couponError, applyCoupon, removeCoupon,
  } = useShaky();
  const [q, setQ] = useState('');
  const [hash, setHash] = useState('');

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    // Next's router changes the URL with pushState, which fires neither
    // hashchange nor popstate, so patch it to emit our own event.
    const { pushState, replaceState } = window.history;
    const patch = (fn: typeof pushState) => function (this: History, ...args: Parameters<typeof pushState>) {
      fn.apply(this, args);
      window.dispatchEvent(new Event('shaky:urlchange'));
    };
    window.history.pushState = patch(pushState);
    window.history.replaceState = patch(replaceState);
    for (const e of ['hashchange', 'popstate', 'shaky:urlchange']) window.addEventListener(e, sync);
    return () => {
      window.history.pushState = pushState;
      window.history.replaceState = replaceState;
      for (const e of ['hashchange', 'popstate', 'shaky:urlchange']) window.removeEventListener(e, sync);
    };
  }, [pathname]);

  const isActive = (href: string) => {
    if (href.includes('#')) return pathname === '/' && hash === href.slice(href.indexOf('#'));
    if (href === '/') return pathname === '/' && !hash;
    if (href === '/pedido') return pathname === '/pedido' || pathname.startsWith('/checkout');
    return pathname === href || pathname.startsWith(href + '/');
  };


  return (
    <>
      <Toaster richColors position="top-center" />
      <a className="skip" href="/menu">Ir al menú</a>
      <header className={'header wrap' + (cartOpen ? ' header-hidden' : '')}>
        <Link href="/" aria-label="Mr. Shaky, inicio"><img className="wordmark" src="/mascot.png" alt="Mr. Shaky" /></Link>
        <nav>{NAV_LINKS.map(([label, href]) => <Link key={label} href={href} className={isActive(href) ? 'active' : ''} onClick={() => setHash(href.includes('#') ? href.slice(href.indexOf('#')) : '')}>{label}</Link>)}</nav>
        <form className="header-search" onSubmit={e => { e.preventDefault(); router.push('/menu?q=' + encodeURIComponent(q)) }}>
          <Search size={16} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="¿Qué se te antoja hoy?" aria-label="Buscar productos" />
        </form>
        <div className="header-actions">
          <button aria-label={`Abrir carrito, ${count} productos`} onClick={() => setCartOpen(true)}><ShoppingBag />{count > 0 && <b className="badge">{count}</b>}</button>
          <Link className="btn" href="/menu">Haz tu pedido <ArrowUpRight size={18} /></Link>
          <button className="mobile-menu" aria-label="Abrir navegación" onClick={() => setNavOpen(true)}><Menu /></button>
        </div>
      </header>

      <nav className="bottom-nav" aria-label="Navegación móvil">
        <Link href="/" className={pathname === '/' ? 'active' : ''}><Home /><span>Inicio</span></Link>
        <Link href="/menu" className={pathname.startsWith('/menu') ? 'active' : ''}><Utensils /><span>Menú</span></Link>
        <button onClick={() => setCartOpen(true)}><ShoppingBag /><span>Carrito{count ? ` (${count})` : ''}</span></button>
        <Link href="/pedido" className={pathname === '/pedido' || pathname.startsWith('/checkout') ? 'active' : ''}><CalendarDays /><span>Pedido</span></Link>
        <Link href="/comunidad" className={pathname.startsWith('/comunidad') ? 'active' : ''}><Headphones /><span>Comunidad</span></Link>
      </nav>

      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent className="home-legacy shaky-sheet">
          <SheetTitle>Navega a tu ritmo</SheetTitle>
          <SheetDescription>Todo Mr. Shaky, en un lugar.</SheetDescription>
          <div className="mobile-links">{NAV_LINKS.map(([label, href]) => <Link key={label} href={href} onClick={() => setNavOpen(false)}>{label}<ArrowUpRight /></Link>)}</div>
        </SheetContent>
      </Sheet>

      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="home-legacy shaky-sheet cart-sheet">
          <SheetTitle>TU CARRITO <em>({count})</em></SheetTitle>
          <SheetDescription>Tu próxima comida empieza aquí. Precios en COP.</SheetDescription>
          {!count ? (
            <div className="empty"><ShoppingBag size={45} /><h3>Tu carrito tiene hambre.</h3><p>Encuentra tu próximo favorito en el menú.</p><Link className="btn" href="/menu" onClick={() => setCartOpen(false)}>Explorar menú</Link></div>
          ) : (
            <>
              <div className="cart-items">{catalog.filter(p => cart[p.id]).map(p => (
                <div className="cart-item" key={p.id}>
                  {p.image
                    ? <img className="cart-photo" src={p.image} alt="" aria-hidden="true" />
                    : <span className={`food-sprite cart-photo food-${p.id}`} role="img" aria-label={p.name} />}
                  <div>
                    <h3>{p.name}</h3>
                    <p>{money(p.price)}</p>
                    <div className="quantity">
                      <button aria-label={'Quitar una unidad de ' + p.name} onClick={() => changeQty(p.id, -1)}><Minus size={15} /></button>
                      <output>{cart[p.id]}</output>
                      <button disabled={cart[p.id] >= 99} aria-label={'Añadir una unidad de ' + p.name} onClick={() => changeQty(p.id, 1)}><Plus size={15} /></button>
                    </div>
                  </div>
                  <button className="delete" aria-label={'Eliminar ' + p.name} onClick={() => removeFromCart(p.id)}><Trash2 size={18} /></button>
                </div>
              ))}</div>
              <div className="cart-summary">
                <div className="coupon-box">
                  {appliedCoupon ? (
                    <div className="coupon-applied"><Tag size={15} /><span>{appliedCoupon}</span><button aria-label="Quitar cupón" onClick={removeCoupon}><X size={14} /></button></div>
                  ) : (
                    <form onSubmit={e => { e.preventDefault(); applyCoupon() }}>
                      <input aria-label="Código de descuento" placeholder="Código de descuento" value={couponInput} onChange={e => setCouponInput(e.target.value)} />
                      <button className="btn outline" type="submit">Aplicar</button>
                    </form>
                  )}
                  {couponError && <span className="coupon-error">{couponError}</span>}
                </div>
                {discount > 0 && <div className="coupon-line"><span>Subtotal</span><span>{money(subtotal)}</span></div>}
                {discount > 0 && <div className="coupon-line discount"><span>Descuento</span><span>-{money(discount)}</span></div>}
                <div><span>Total</span><strong>{money(total)}</strong></div>
                <p>Recogida en sucursal · Sin costo de envío</p>
                <Link className="btn" href="/checkout" onClick={() => setCartOpen(false)}>Elegir hora de recogida <ArrowRight size={18} /></Link>
                <span className="fineprint">No se realizan cobros ni pedidos reales.</span>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

export function ShakyFooter() {
  return (
    <footer className="wrap" id="nosotros">
      <div className="footer-brand">
        <Link href="/" className="footer-logo">
          <img src="/mascot.png" alt="" />
          <span><strong>Mr. Shaky</strong><small>NUTRIBAR</small></span>
        </Link>
        <p className="footer-tagline-text">Comida real para<br />gente que entrena.</p>
        <div className="social-links">
          <a aria-label="Instagram" href="https://www.instagram.com/mr_shaky_nutribar/" target="_blank" rel="noreferrer"><InstagramIcon /></a>
          <a aria-label="TikTok" href="https://tiktok.com" target="_blank" rel="noreferrer"><TikTokIcon /></a>
          <a aria-label="Spotify" href="https://open.spotify.com" target="_blank" rel="noreferrer"><SpotifyIcon /></a>
          <a aria-label="YouTube" href="https://youtube.com" target="_blank" rel="noreferrer"><YouTubeIcon /></a>
        </div>
      </div>
      <div className="footer-links">
        <Link href="/">Inicio</Link>
        <Link href="/menu">Menú</Link>
        <Link href="/pedido">Pedido</Link>
        <Link href="/#nosotros">Nosotros</Link>
        <Link href="/comunidad">Comunidad</Link>
      </div>
      <span>© {new Date().getFullYear()} Mr. Shaky Nutribar</span>
      <div className="footer-tagline"><Crown size={20} />COMIDA QUE<br />IMPULSA PERSONAS</div>
    </footer>
  );
}
