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
            <a className="btn btn-secondary" href="https://wa.me/5519984380002?text=Oi%20tudo%20bem%20%3F%21%20Gostaria%20de%20saber%20mais%20como%20ser%20um%20revendedor%20%21" target="_blank" rel="noopener noreferrer">Quero ser revendedor</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HistorySection;


