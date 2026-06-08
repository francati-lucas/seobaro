import React from 'react';

function HistorySection({ imageSrc }) {
  return (
    <section id="historia" className="section section-history">
      <div className="container history-grid reveal">
        <div className="history-image" aria-hidden="true">
          {imageSrc && <img src={imageSrc} alt="Torta artesanal" />}
        </div>
        <div className="history-content">
          <h2 className="history-title">Nossa História</h2>
          <p>
            A Seo Baro começou de forma simples: receitas de família, fornos
            pequenos e muita dedicação. Com o tempo, a qualidade das nossas tortas
            conquistou paladares e nos levou a ampliar a produção, sem abrir mão
            do cuidado artesanal.
          </p>
          <p>
            Hoje, unimos tradição e processos modernos para garantir o mesmo sabor
            de casa em cada fatia. Seguimos crescendo ao lado de parceiros e
            revendedores que compartilham do nosso propósito: encantar as pessoas
            com experiências doces e memoráveis.
          </p>
          <div className="history-cta">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => window.dispatchEvent(new CustomEvent('sb:open-pedido-signup'))}
            >
              Quero ser revendedor
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HistorySection;


