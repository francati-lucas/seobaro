import React from 'react';
import logo from '../assets/images/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import PedidoAccessModal from './PedidoAccessModal';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const isSolidPage = location.pathname === '/pedido' || isAdminPage;
  const headerRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [pedidoModalOpen, setPedidoModalOpen] = React.useState(false);
  const [pedidoModalStep, setPedidoModalStep] = React.useState('choose');
  
  const { currentUser } = useAuth();
  const sessionActive = currentUser !== null;

  const goToHash = React.useCallback(
    (hash) => {
      const id = hash.replace('#', '');
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.location.hash = hash;
    },
    []
  );

  const handleNavToSection = React.useCallback(
    (e, hash) => {
      e.preventDefault();
      setMenuOpen(false);

      if (location.pathname === '/') {
        goToHash(hash);
        return;
      }

      navigate('/');
      window.setTimeout(() => goToHash(hash), 0);
    },
    [goToHash, location.pathname, navigate]
  );

  React.useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;

    if (isSolidPage) {
      el.classList.add('scrolled');
      return undefined;
    }

    const handleScroll = () => {
      const headerEl = headerRef.current;
      if (!headerEl) return;
      if (window.scrollY > 10) {
        headerEl.classList.add('scrolled');
      } else {
        headerEl.classList.remove('scrolled');
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSolidPage]);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search || '');
    const needsAuth = params.get('auth') === 'required';
    if (!needsAuth) return;
    if (sessionActive) return;
    setPedidoModalStep('login');
    setPedidoModalOpen(true);
    // remove o parâmetro para não ficar reabrindo
    params.delete('auth');
    const nextSearch = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : '',
      },
      { replace: true, state: location.state }
    );
  }, [location.pathname, location.search, navigate, sessionActive]);

  React.useEffect(() => {
    const openSignup = () => {
      setMenuOpen(false);
      setPedidoModalStep('signup');
      setPedidoModalOpen(true);
    };

    window.addEventListener('sb:open-pedido-signup', openSignup);
    return () => window.removeEventListener('sb:open-pedido-signup', openSignup);
  }, []);

  const handlePedidoClick = React.useCallback(() => {
    setMenuOpen(false);
    if (sessionActive) {
      if (location.pathname !== '/pedido') navigate('/pedido');
      return;
    }
    setPedidoModalStep('choose');
    setPedidoModalOpen(true);
  }, [location.pathname, navigate, sessionActive]);

  const handleLogout = React.useCallback(async () => {
    setMenuOpen(false);
    try {
      await signOut(auth);
      if (location.pathname === '/pedido') navigate('/');
    } catch (e) {
      console.error(e);
    }
  }, [location.pathname, navigate]);

  return (
    <header ref={headerRef} className={`site-header ${isSolidPage ? 'is-solid' : ''}`}>
      <div className="container header-content">
        <div className="brand">
          <img src={logo} alt="Seo Baro" style={{ height: 86 }} />
        </div>
        <div className="header-right">
          <nav className={`nav nav-links ${menuOpen ? 'open' : ''}`}>
            {!isAdminPage && (
              <>
                <a href="/#inicio" onClick={(e) => handleNavToSection(e, '#inicio')}>Início</a>
                <a href="/#historia" onClick={(e) => handleNavToSection(e, '#historia')}>Sobre</a>
                <a href="/#cardapio" onClick={(e) => handleNavToSection(e, '#cardapio')}>Cardápio</a>
                <button type="button" className="nav-cta" onClick={handlePedidoClick}>
                  Pedido
                </button>
              </>
            )}
            {sessionActive && (
              <button type="button" className="nav-logout" onClick={handleLogout}>
                Sair
              </button>
            )}
          </nav>
          <div className="nav-social">
            <button className={`menu-toggle ${menuOpen ? 'is-open' : ''}`} aria-label="Abrir menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
              <span className="menu-bar" />
              <span className="menu-bar" />
              <span className="menu-bar" />
            </button>
          </div>
        </div>
      </div>

      <PedidoAccessModal
        open={pedidoModalOpen}
        initialStep={pedidoModalStep}
        onClose={() => setPedidoModalOpen(false)}
        onSuccess={() => {
          const intendedPath = location.state?.from?.pathname;
          if (intendedPath) {
            navigate(intendedPath);
          } else if (location.pathname !== '/pedido') {
            navigate('/pedido');
          }
        }}
      />
    </header>
  );
}

export default Header;
