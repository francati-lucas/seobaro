import React from 'react';

function JoinFamilySection() {
  return (
    <section id="familia" className="section section-join">
      <div className="container join-grid reveal">
        <div className="join-copy">
          <h2 className="join-title">Quer fazer parte da nossa família?</h2>
          <p className="join-text">Se você deseja revender as tortas da Seo Baro, clique no botão abaixo e fale com a gente.</p>

          <ul className="join-benefits">
            <li>Qualidade artesanal com ingredientes selecionados</li>
            <li>Treinamento e material de apoio para revenda</li>
            <li>Entrega programada e suporte dedicado</li>
          </ul>

          <div className="delivery-track">
            <div className="track-line" />
            <div className="truck">
              <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="22" width="70" height="22" rx="4" fill="#8b3a2b" />
                <rect x="74" y="26" width="26" height="16" rx="4" fill="#c0694d" />
                <circle cx="26" cy="50" r="7" fill="#333" />
                <circle cx="62" cy="50" r="7" fill="#333" />
                <circle cx="87" cy="50" r="7" fill="#333" />
                <rect x="82" y="30" width="9" height="7" fill="#fff" opacity="0.9" />
              </svg>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-cta join-btn"
            onClick={() => window.dispatchEvent(new CustomEvent('sb:open-pedido-signup'))}
          >
            Quero ser revendedor
          </button>
          <p className="join-note">Sem taxa de adesão. Condições especiais para os primeiros pedidos.</p>
        </div>

        <div className="join-stats" aria-hidden="false">
          <div className="stat">
            <strong>+50</strong>
            <span>Cidades atendidas</span>
          </div>
          <div className="stat">
            <strong>72h</strong>
            <span>Prazo médio de entrega</span>
          </div>
          <div className="stat">
            <strong>7d</strong>
            <span>Suporte semanal</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JoinFamilySection;


