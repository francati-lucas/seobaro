import React from 'react';

const PRODUCTS = [
  { id: '1', name: 'Torta de Limão', description: 'Base crocante, creme cítrico e merengue suíço.', price: 'R$ 64,90' },
  { id: '2', name: 'Torta de Chocolate', description: 'Chocolate 50% cacau com ganache cremoso.', price: 'R$ 69,90' },
  { id: '3', name: 'Torta de Morango', description: 'Creme leve com morangos frescos.', price: 'R$ 74,90' },
  { id: '4', name: 'Torta de Maracujá', description: 'Equilíbrio perfeito entre doce e azedo.', price: 'R$ 64,90' },
];

function ProductCard({ name, description, price }) {
  return (
    <div className="product-card">
      <div className="product-media" aria-hidden="true" />
      <div className="product-info">
        <h3>{name}</h3>
        <p className="product-desc">{description}</p>
        <div className="product-meta">
          <span className="product-price">{price}</span>
          <a className="btn btn-secondary" href="#contato">Fazer pedido</a>
        </div>
      </div>
    </div>
  );
}

function ProductGrid() {
  return (
    <section id="produtos" className="section section-products">
      <div className="container">
        <h2 className="section-title">Nossas Tortas</h2>
        <div className="product-grid">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} name={p.name} description={p.description} price={p.price} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductGrid;


