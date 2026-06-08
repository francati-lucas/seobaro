import React from 'react';
import cardFrango from '../assets/images/cardFrango.jpg';
import cardPalmito from '../assets/images/cardPalmito.png';
import cardCostelinha from '../assets/images/cardCostelinha.png';

const ITEMS = [
  {
    id: 'frango',
    name: 'Torta de Frango',
    description:
      'Recheio especial de frango refogado com temperos naturais e uma quantidade generosa de requeijão Catupiry cremoso (o de pote). Massa leve e crocante! A melhor torta de frango do mundo.',
    tag: 'Salgada',
    img: cardFrango
  },
  {
    id: 'palmito',
    name: 'Torta de Palmito',
    description:
      'Torta especial com recheio de palmito pupunha e requeijão Catupiry. Uma opção vegetariana perfeita!',
    tag: 'Salgada',
    img: cardPalmito
  },
  {
    id: 'costelinha',
    name: 'Torta de Costelinha na Cerveja Preta',
    description:
      'Massa crocante e leve, recheio de costela suína diferenciada — no jeitinho mineiro. E uma camada generosa de requeijão Catupiry cremoso (o de pote).',
    tag: 'Salgada',
    img: cardCostelinha
  },
];

function MenuCard({ name, description, tag, img }) {
  return (
    <div className="menu-card">
      <div className="menu-media" aria-hidden="true" style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <span className="menu-tag">{tag}</span>
      </div>
      <div className="menu-info">
        <h3>{name}</h3>
        <p className="menu-desc">{description}</p>
      </div>
    </div>
  );
}

function MenuPreview() {
  return (
    <section id="cardapio" className="section section-menu">
      <div className="container reveal">
        <h2 className="section-title">As mais pedidas</h2>
        <div className="menu-grid">
          {ITEMS.map((i) => (
            <MenuCard key={i.id} name={i.name} description={i.description} tag={i.tag} img={i.img} />
          ))}
        </div>
        <div className="menu-footer">
          <p className="menu-note">Se quer saber mais sobre outros sabores, entre em contato com a gente.</p>
          <button
            type="button"
            className="btn btn-cta"
            onClick={() => window.dispatchEvent(new CustomEvent('sb:open-pedido-signup'))}
          >
            Falar com a gente
          </button>
        </div>
      </div>
    </section>
  );
}

export default MenuPreview;


