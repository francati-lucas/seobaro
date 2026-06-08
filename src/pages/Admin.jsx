import React, { useEffect, useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const DEFAULT_PRODUCTS = [
  {
    id: 'frango',
    nome: 'Torta de Frango (Inteira)',
    descricao: 'Recheio especial de frango refogado com temperos naturais e uma quantidade generosa de requeijão Catupiry cremoso (o de pote). Massa leve e crocante!',
    tag: 'Salgada',
    available: true
  },
  {
    id: 'palmito',
    nome: 'Torta de Palmito (Inteira)',
    descricao: 'Torta especial com recheio de palmito pupunha e requeijão Catupiry. Uma opção vegetariana perfeita!',
    tag: 'Salgada',
    available: true
  },
  {
    id: 'costela',
    nome: 'Torta de Costela (Inteira)',
    descricao: 'Massa crocante e leve, recheio de costela suína diferenciada — no jeitinho mineiro. E uma camada generosa de requeijão Catupiry cremoso (o de pote).',
    tag: 'Salgada',
    available: true
  }
];

export default function Admin() {
  const { userData, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nome: '',
    descricao: '',
    tag: 'Salgada'
  });
  const [activeTab, setActiveTab] = useState('cardapio');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const prodList = [];
      querySnapshot.forEach((docSnap) => {
        prodList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setProducts(prodList);
    } catch (e) {
      console.error("Erro ao buscar produtos:", e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersList = [];
      querySnapshot.forEach((docSnap) => {
        ordersList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setOrders(ordersList);
    } catch (e) {
      console.error("Erro ao buscar pedidos:", e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (userData?.isAdmin) {
      fetchProducts();
      fetchOrders();
    }
  }, [userData]);

  const reportData = useMemo(() => {
    const stats = {};
    orders.forEach(order => {
       const key = order.customerCnpj || order.userId;
       if (!stats[key]) {
          stats[key] = {
             nome: order.customerName || 'Desconhecido',
             cnpj: order.customerCnpj || 'Não informado',
             totalPedidos: 0,
             totalTortas: 0
          }
       }
       stats[key].totalPedidos += 1;
       stats[key].totalTortas += order.totalItems || 0;
    });
    return Object.values(stats).sort((a,b) => b.totalTortas - a.totalTortas);
  }, [orders]);

  const { totalClientes, totalPedidosGeral, totalTortasGeral } = useMemo(() => {
    return {
      totalClientes: reportData.length,
      totalPedidosGeral: reportData.reduce((acc, row) => acc + row.totalPedidos, 0),
      totalTortasGeral: reportData.reduce((acc, row) => acc + row.totalTortas, 0)
    };
  }, [reportData]);

  const toggleAvailability = async (productId, currentStatus) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        available: !currentStatus
      });
      // Update local state to reflect change immediately
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, available: !currentStatus } : p));
    } catch (e) {
      console.error("Erro ao atualizar status:", e);
      alert("Erro ao atualizar. Tente novamente.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Tem certeza que deseja excluir esta torta permanentemente?")) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (e) {
      console.error("Erro ao excluir torta:", e);
      alert("Erro ao excluir torta.");
    }
  };

  const seedDatabase = async () => {
    setIsSeeding(true);
    try {
      for (const prod of DEFAULT_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
      await fetchProducts();
      alert("Cardápio inicial criado com sucesso!");
    } catch (e) {
      console.error("Erro ao criar cardápio inicial:", e);
      alert("Erro ao criar cardápio inicial.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.nome || !newProduct.descricao) {
      alert("Preencha nome e descrição!");
      return;
    }
    
    setIsSaving(true);
    try {
      // Gera um ID simples a partir do nome
      const newId = newProduct.nome.toLowerCase().replace(/[^a-z0-9]/g, '');
      const productToSave = {
        id: newId,
        nome: newProduct.nome,
        descricao: newProduct.descricao,
        tag: newProduct.tag,
        available: true
      };
      
      await setDoc(doc(db, 'products', newId), productToSave);
      
      // Reseta e atualiza
      setNewProduct({ nome: '', descricao: '', tag: 'Salgada' });
      setShowForm(false);
      await fetchProducts();
    } catch (err) {
      console.error("Erro ao adicionar torta:", err);
      alert("Erro ao adicionar torta.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="section" style={{ minHeight: '100vh', background: '#f7f6f5', paddingTop: '88px' }}>
          <div className="container">Carregando...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!userData?.isAdmin) {
    return (
      <>
        <Header />
        <main className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: '#f7f6f5', paddingTop: '88px' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2>Acesso Restrito</h2>
            <p className="sb-muted">Esta página é exclusiva para administradores.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pedido-page" style={{ minHeight: '100vh', background: '#f5f7fa', paddingBottom: '60px' }}>
        
        {/* Dashboard Header */}
        <section style={{ backgroundColor: '#fff', padding: '30px 0', borderBottom: '1px solid #eaeaea', marginBottom: '30px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '28px', color: '#111827' }}>Painel de Controle</h1>
                <p style={{ margin: '5px 0 0', color: '#6b7280', fontSize: '15px' }}>Visão geral do sistema Seo Baro</p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px' }}>
                <button 
                  onClick={() => setActiveTab('cardapio')}
                  style={{ 
                    padding: '8px 16px', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontWeight: '600',
                    fontSize: '14px',
                    backgroundColor: activeTab === 'cardapio' ? '#fff' : 'transparent',
                    color: activeTab === 'cardapio' ? '#111827' : '#6b7280',
                    boxShadow: activeTab === 'cardapio' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  🛒 Cardápio
                </button>
                <button 
                  onClick={() => setActiveTab('relatorio')}
                  style={{ 
                    padding: '8px 16px', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontWeight: '600',
                    fontSize: '14px',
                    backgroundColor: activeTab === 'relatorio' ? '#fff' : 'transparent',
                    color: activeTab === 'relatorio' ? '#111827' : '#6b7280',
                    boxShadow: activeTab === 'relatorio' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  📊 Relatórios
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '30px' }}>
              <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ margin: 0, color: '#6b7280', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>Revendedores Ativos</h3>
                <p style={{ margin: '10px 0 0', fontSize: '32px', fontWeight: '800', color: '#111827' }}>{totalClientes}</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ margin: 0, color: '#6b7280', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>Total de Pedidos</h3>
                <p style={{ margin: '10px 0 0', fontSize: '32px', fontWeight: '800', color: '#111827' }}>{totalPedidosGeral}</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ margin: 0, color: '#6b7280', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>Volume de Tortas</h3>
                <p style={{ margin: '10px 0 0', fontSize: '32px', fontWeight: '800', color: '#8b3a2b' }}>{totalTortasGeral}</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="container">
            {activeTab === 'cardapio' && (
              <>
                {loadingProducts ? (
                  <p>Carregando cardápio...</p>
                ) : products.length === 0 ? (
                  <div className="sb-stack" style={{ textAlign: 'center', padding: '40px 0' }}>
                    <h3>O cardápio está vazio!</h3>
                    <p>Parece que é a primeira vez que você entra aqui. Vamos criar as tortas iniciais?</p>
                    <button 
                      className="sb-btn sb-btn--primary" 
                      onClick={seedDatabase} 
                      disabled={isSeeding}
                      style={{ maxWidth: '300px', margin: '0 auto' }}
                    >
                      {isSeeding ? 'Criando...' : 'Criar Cardápio Inicial'}
                    </button>
                  </div>
                ) : (
                  <div className="sb-stack">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h2 className="section-title" style={{ margin: 0 }}>Tortas Cadastradas</h2>
                      <button 
                        className="sb-btn sb-btn--primary" 
                        onClick={() => setShowForm(!showForm)}
                      >
                        {showForm ? 'Cancelar' : '+ Nova Torta'}
                      </button>
                    </div>

                    {showForm && (
                      <form onSubmit={handleAddProduct} style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        marginBottom: '20px',
                        border: '1px solid #eadfda'
                      }}>
                        <h3 style={{ marginTop: 0 }}>Cadastrar Nova Torta</h3>
                        <div className="sb-form" style={{ marginBottom: '15px' }}>
                          <div className="sb-field">
                            <label className="sb-field__label">Nome da Torta</label>
                            <input 
                              type="text" 
                              className="sb-field__input" 
                              placeholder="Ex: Torta de Calabresa"
                              value={newProduct.nome}
                              onChange={e => setNewProduct({...newProduct, nome: e.target.value})}
                              required
                            />
                          </div>
                          <div className="sb-field">
                            <label className="sb-field__label">Categoria (Tag)</label>
                            <select 
                              className="sb-field__input"
                              value={newProduct.tag}
                              onChange={e => setNewProduct({...newProduct, tag: e.target.value})}
                            >
                              <option value="Salgada">Salgada</option>
                              <option value="Doce">Doce</option>
                              <option value="Especial">Especial</option>
                            </select>
                          </div>
                          <div className="sb-field sb-field--full">
                            <label className="sb-field__label">Descrição</label>
                            <textarea 
                              className="sb-field__textarea" 
                              placeholder="Ingredientes e detalhes da torta..."
                              rows={3}
                              value={newProduct.descricao}
                              onChange={e => setNewProduct({...newProduct, descricao: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <button type="submit" className="sb-btn sb-btn--primary" disabled={isSaving}>
                          {isSaving ? 'Salvando...' : 'Salvar Torta'}
                        </button>
                      </form>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {products.map(p => (
                        <div key={p.id} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          padding: '20px',
                          backgroundColor: '#fff',
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          borderLeft: p.available ? '4px solid #10b981' : '4px solid #ef4444'
                        }}>
                          <div>
                            <h3 style={{ margin: '0 0 5px 0' }}>{p.nome}</h3>
                            <span style={{ 
                              fontSize: '0.85rem', 
                              padding: '3px 8px', 
                              borderRadius: '4px',
                              backgroundColor: p.available ? '#d1fae5' : '#fee2e2',
                              color: p.available ? '#065f46' : '#991b1b',
                              fontWeight: 'bold'
                            }}>
                              {p.available ? 'Disponível no Site' : 'Oculto / Esgotado'}
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className={`sb-btn ${p.available ? 'sb-btn--secondary' : 'sb-btn--primary'}`}
                              onClick={() => toggleAvailability(p.id, p.available)}
                            >
                              {p.available ? 'Desativar Torta' : 'Ativar Torta'}
                            </button>
                            <button 
                              className="sb-btn sb-btn--ghost"
                              style={{ color: '#e5484d', borderColor: '#f8c4c5' }}
                              onClick={() => handleDeleteProduct(p.id)}
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'relatorio' && (
              <div className="sb-stack">
                <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '10px' }}>Relatório de Revendedores</h2>
                <p className="sb-muted" style={{ marginBottom: '20px' }}>Acompanhe o volume de compras de cada cliente (ordenado pelos que mais compram).</p>
                
                {loadingOrders ? (
                  <p>Carregando relatório...</p>
                ) : reportData.length === 0 ? (
                  <div style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '12px', textAlign: 'center', border: '1px solid #eadfda' }}>
                    <p>Nenhuma venda registrada ainda no site.</p>
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eadfda', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead style={{ backgroundColor: '#f7f6f5', borderBottom: '1px solid #eadfda' }}>
                        <tr>
                          <th style={{ padding: '16px', fontWeight: '800', color: 'var(--text)' }}>Revendedor / Empresa</th>
                          <th style={{ padding: '16px', fontWeight: '800', color: 'var(--text)' }}>CNPJ</th>
                          <th style={{ padding: '16px', fontWeight: '800', color: 'var(--text)', textAlign: 'center' }}>Total de Pedidos</th>
                          <th style={{ padding: '16px', fontWeight: '800', color: 'var(--text)', textAlign: 'center' }}>Tortas Compradas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f0e9e5' }}>
                            <td style={{ padding: '16px', fontWeight: '600' }}>{row.nome}</td>
                            <td style={{ padding: '16px', color: 'var(--muted)', fontSize: '0.9rem' }}>{row.cnpj}</td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              <span style={{ backgroundColor: '#e2e8f0', padding: '4px 12px', borderRadius: '99px', fontWeight: '700', fontSize: '0.9rem' }}>
                                {row.totalPedidos}
                              </span>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              <span style={{ backgroundColor: '#ffedd5', color: '#c2410c', padding: '4px 12px', borderRadius: '99px', fontWeight: '800', fontSize: '0.9rem' }}>
                                {row.totalTortas}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
