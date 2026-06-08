import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import tortaInteira from '../assets/images/TortaInteira.png';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const WHATSAPP_NUMBER = '5519984380002';

// Os produtos agora são carregados do banco de dados Firebase

function buildWhatsAppCartLink({ items, customerName, customerAddress, customerCnpj }) {
  const lines = items.map((i) => `- ${i.qtd}x ${i.nome}`);
  const parts = ['Olá! Gostaria de fazer um pedido (tortas inteiras):'];

  if (customerName?.trim()) parts.push(`Empresa/Nome: ${customerName.trim()}`);
  if (customerCnpj?.trim()) parts.push(`CNPJ: ${customerCnpj.trim()}`);
  if (customerAddress?.trim()) parts.push(`Cidade/Endereço: ${customerAddress.trim()}`);

  parts.push('', ...lines, '', '');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(parts.join('\n'))}`;
}

function PedidoCard({ item, qtdNoCarrinho, onAdicionar, onRemoverUm }) {
  return (
    <article className="menu-card pedido-menu-card">
      <div
        className="menu-media"
        aria-hidden="true"
        style={{
          backgroundImage: `url(${item.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <span className="menu-tag">{item.tag}</span>
      </div>

      <div className="menu-info pedido-menu-info">
        <h3>{item.nome}</h3>
        <p className="menu-desc">{item.descricao}</p>

        <div className="pedido-card-actions">
          <div className="pedido-inline-qtd" aria-label="Quantidade no carrinho">
            <button type="button" className="pedido-inline-qtd__btn" onClick={onRemoverUm} disabled={qtdNoCarrinho <= 0}>
              −
            </button>
            <span className="pedido-inline-qtd__value" aria-live="polite">
              {qtdNoCarrinho}
            </span>
            <button type="button" className="pedido-inline-qtd__btn" onClick={onAdicionar}>
              +
            </button>
          </div>

          <button type="button" className="pedido-add-btn" onClick={onAdicionar}>
            Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Pedido() {
  const { userData } = useAuth();
  const [cart, setCart] = React.useState(() => ({}));
  const [cartOpen, setCartOpen] = React.useState(false);
  const [customerName, setCustomerName] = React.useState('');
  const [customerAddress, setCustomerAddress] = React.useState('');
  const [customerCnpj, setCustomerCnpj] = React.useState('');
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [availableProducts, setAvailableProducts] = React.useState([]);
  const [loadingProducts, setLoadingProducts] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    async function loadProducts() {
      try {
        const q = query(collection(db, 'products'), where('available', '==', true));
        const querySnapshot = await getDocs(q);
        const prods = [];
        querySnapshot.forEach((docSnap) => {
          // Injeta a imagem padrao (pois não estamos salvando URL no banco neste momento)
          prods.push({ id: docSnap.id, img: tortaInteira, ...docSnap.data() });
        });
        setAvailableProducts(prods);
      } catch (e) {
        console.error("Erro ao buscar cardápio:", e);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  React.useEffect(() => {
    if (userData) {
      setCustomerName(userData.empresa || userData.responsavel || '');
      setCustomerAddress(userData.cidade || '');
      setCustomerCnpj(userData.cnpj || '');
    }
  }, [userData]);

  const cartItems = React.useMemo(() => {
    return availableProducts.map((t) => ({ ...t, qtd: cart[t.id] || 0 }))
      .filter((t) => t.qtd > 0)
      .map(({ id, nome, qtd }) => ({ id, nome, qtd }));
  }, [cart, availableProducts]);

  const cartCount = React.useMemo(
    () => Object.values(cart).reduce((acc, v) => acc + (typeof v === 'number' ? v : 0), 0),
    [cart]
  );

  const addItem = React.useCallback((id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const removeOne = React.useCallback((id) => {
    setCart((prev) => {
      const next = { ...prev };
      const current = next[id] || 0;
      if (current <= 1) delete next[id];
      else next[id] = current - 1;
      return next;
    });
  }, []);

  const clearCart = React.useCallback(() => setCart({}), []);

  const canSendOrder = React.useMemo(() => {
    return cartItems.length > 0 && customerName.trim().length > 0 && customerAddress.trim().length > 0;
  }, [cartItems.length, customerAddress, customerName]);

  const nameMissing = submitAttempted && customerName.trim().length === 0;
  const addressMissing = submitAttempted && customerAddress.trim().length === 0;
  const cartMissing = submitAttempted && cartItems.length === 0;

  const filteredTortas = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return availableProducts;
    return availableProducts.filter((t) => t.nome.toLowerCase().includes(q));
  }, [search, availableProducts]);

  const handleFinalizarPedido = async () => {
    setSubmitAttempted(true);
    if (!canSendOrder) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        userId: userData?.uid || 'anonymous',
        customerName,
        customerCnpj,
        customerAddress,
        items: cartItems,
        totalItems: cartCount,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);

      const link = buildWhatsAppCartLink({
        items: cartItems,
        customerName,
        customerAddress,
        customerCnpj
      });
      
      window.open(link, '_blank');
      setCart({});
      setCartOpen(false);
    } catch (err) {
      console.error("Erro ao salvar pedido:", err);
      alert("Houve um erro ao registrar seu pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pedido-page">
        <section className="section section-alt pedido-hero">
          <div className="container">
            <h1 className="pedido-title">Cardápio de Pedidos</h1>
            <p className="pedido-subtitle">Escolha sua torta salgada grande e finalize rapidinho pelo WhatsApp.</p>
          </div>
        </section>

        <section className="section pedido-section">
          <div className="container">
            <h2 className="section-title pedido-section__title">Tortas salgadas grandes</h2>
            <div className="pedido-search">
              <input
                className="pedido-search__input"
                type="search"
                placeholder="Buscar por nome da torta (ex.: frango, palmito...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar torta pelo nome"
              />
              {search.trim().length > 0 && (
                <button type="button" className="pedido-search__clear" onClick={() => setSearch('')} aria-label="Limpar busca">
                  Limpar
                </button>
              )}
            </div>
            <div className="pedido-grid">
              {loadingProducts ? (
                <p>Carregando cardápio...</p>
              ) : filteredTortas.map((item) => (
                <PedidoCard
                  key={item.id}
                  item={item}
                  qtdNoCarrinho={cart[item.id] || 0}
                  onAdicionar={() => addItem(item.id)}
                  onRemoverUm={() => removeOne(item.id)}
                />
              ))}
            </div>
            {!loadingProducts && filteredTortas.length === 0 && search.trim() === '' && (
              <p className="pedido-note">Nenhuma torta disponível no momento.</p>
            )}
            {!loadingProducts && filteredTortas.length === 0 && search.trim() !== '' && (
              <p className="pedido-note">Nenhuma torta encontrada com esse nome.</p>
            )}
            <p className="pedido-note">
              Dica: no WhatsApp, você pode informar endereço, forma de pagamento e horário.
            </p>
          </div>
        </section>
      </main>

      <div className="pedido-cartbar" aria-hidden={cartCount === 0}>
        <div className="container pedido-cartbar__inner">
          <div className="pedido-cartbar__text">
            <strong>Carrinho</strong> <span>{cartCount} item(ns)</span>
          </div>
          <button type="button" className="pedido-cartbar__btn" onClick={() => setCartOpen(true)} disabled={cartCount === 0}>
            Ver carrinho
          </button>
        </div>
      </div>

      {cartOpen && (
        <div className="pedido-modal" role="dialog" aria-modal="true" aria-label="Carrinho de pedido">
          <button type="button" className="pedido-modal__overlay" onClick={() => setCartOpen(false)} aria-label="Fechar carrinho" />
          <div className="pedido-modal__panel">
            <div className="pedido-modal__header">
              <h3 className="pedido-modal__title">Seu carrinho</h3>
              <button type="button" className="pedido-modal__close" onClick={() => setCartOpen(false)} aria-label="Fechar">
                ✕
              </button>
            </div>

            <div className="pedido-modal__form">
              <label className={`pedido-field ${nameMissing ? 'has-error' : ''}`}>
                <span className="pedido-field__label">Nome</span>
                <input
                  className="pedido-field__input"
                  type="text"
                  placeholder="Seu nome"
                  value={customerName}
                  aria-invalid={nameMissing}
                  onChange={(e) => setCustomerName(e.target.value)}
                  onBlur={() => setSubmitAttempted(true)}
                />
                {nameMissing && <span className="pedido-field__error">Informe seu nome.</span>}
              </label>

              <label className={`pedido-field ${addressMissing ? 'has-error' : ''}`}>
                <span className="pedido-field__label">Endereço</span>
                <input
                  className="pedido-field__input"
                  type="text"
                  placeholder="Rua, número, bairro, cidade..."
                  value={customerAddress}
                  aria-invalid={addressMissing}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  onBlur={() => setSubmitAttempted(true)}
                />
                {addressMissing && <span className="pedido-field__error">Informe seu endereço.</span>}
              </label>
            </div>

            {cartItems.length === 0 ? (
              <p className="pedido-modal__empty">Seu carrinho está vazio.</p>
            ) : (
              <div className="pedido-modal__list">
                {cartItems.map((i) => (
                  <div key={i.id} className="pedido-modal__item">
                    <div className="pedido-modal__iteminfo">
                      <strong>{i.nome}</strong>
                      <span>{i.qtd} un.</span>
                    </div>
                    <div className="pedido-modal__itemactions">
                      <button type="button" className="pedido-inline-qtd__btn" onClick={() => removeOne(i.id)}>
                        −
                      </button>
                      <button type="button" className="pedido-inline-qtd__btn" onClick={() => addItem(i.id)}>
                        +
                      </button>
                      <button
                        type="button"
                        className="pedido-modal__remove"
                        onClick={() => setCart((prev) => {
                          const next = { ...prev };
                          delete next[i.id];
                          return next;
                        })}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pedido-modal__footer">
              <button type="button" className="pedido-modal__clear" onClick={clearCart} disabled={cartItems.length === 0 || isSubmitting}>
                Limpar
              </button>
              <button
                type="button"
                className={`pedido-modal__send ${!canSendOrder || isSubmitting ? 'is-disabled' : ''}`}
                onClick={handleFinalizarPedido}
                disabled={isSubmitting}
                style={{ border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                {isSubmitting ? 'Registrando...' : 'Finalizar no WhatsApp'}
              </button>
            </div>

            {cartMissing && <p className="pedido-modal__error">Adicione pelo menos 1 item no carrinho.</p>}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

