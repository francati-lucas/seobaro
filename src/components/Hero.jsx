import React, { useEffect, useRef } from 'react';

function Hero({
  title = 'Tortas artesanais com sabor de casa',
  subtitle = 'Produzidas com ingredientes selecionados, sem conservantes e com aquele carinho que faz a diferença.',
  ctaLabel = 'Ver produtos',
  ctaHref = '#produtos',
  productImage,
  splashImage,
  badgeImage
}) {
  const revealRef = useRef(null);

  // Garante que a hero revele no carregamento (sem precisar rolar)
  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;
    if (el.classList.contains('is-visible')) return;
    // Força layout antes de aplicar a classe para disparar a transição
    requestAnimationFrame(() => {
      el.classList.remove('is-visible');
      void el.offsetHeight;
      el.classList.add('is-visible');
    });
  }, []);

  return (
    <section id="inicio" className="hero hero-rounded hero-glass">
      <div ref={revealRef} className="container hero-grid reveal">
        <div className="hero-copy">
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <div className="hero-cta">
            <a className="btn btn-cta" href={ctaHref} target="_blank" rel="noopener noreferrer">{ctaLabel}</a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          {badgeImage && <img className="badge" src={badgeImage} alt="" />}
          {splashImage && <img className="splash" src={splashImage} alt="" />}
          {productImage && <img className="product" src={productImage} alt="Torta de frango" />}
        </div>
      </div>
      <div className="hero-scroll-hint" aria-hidden="false">
        <svg className="mouse-icon" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="30" rx="9" ry="9" fill="none" strokeWidth="2" className="mouse-outline" />
          <circle cx="12" cy="10" r="2" className="mouse-wheel" />
        </svg>
        <span>Para saber como ser um revendedor, role para baixo!</span>
      </div>
    </section>
  );
}

export default Hero;


