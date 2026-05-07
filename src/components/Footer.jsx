import React from 'react';
import logo from '../assets/images/logo.png';

function Footer() {
  return (
    <footer id="contato" className="site-footer">
      <div className="container footer-top">
        <div className="footer-left">
          <img src={logo} alt="Seo Baro" style={{ height: 64 }} />
        </div>
        <div className="footer-right">
          <span className="footer-social">
            <a className="social-link" href="https://www.instagram.com/seobaro?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 8.3a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4z" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" />
              </svg>
            </a>
            <a className="social-link" href="https://wa.me/5519984380002" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path fill="currentColor" d="M20.52 3.48A11.77 11.77 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.1 1.6 5.88L0 24l6.29-1.64A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22a9.93 9.93 0 01-5.06-1.38l-.36-.21-3.74.98 1-3.65-.24-.38A9.98 9.98 0 012 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.02-7.29c-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.13-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.13-1.12-.41-2.13-1.31-.79-.7-1.32-1.56-1.48-1.83-.16-.27-.02-.42.12-.55.13-.13.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.13-.61-1.47-.83-2.01-.22-.53-.44-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.65 1.12 2.83.14.18 1.93 2.94 4.68 4.12.65.28 1.16.45 1.55.57.65.21 1.25.18 1.72.11.53-.08 1.6-.65 1.83-1.27.23-.62.23-1.15.16-1.27-.07-.11-.25-.18-.52-.31z"/>
              </svg>
            </a>
          </span>
        </div>
      </div>
      <div className="footer-sep" aria-hidden="true" />
      <div className="container footer-links">
        <nav className="footer-nav">
          <a href="#inicio">Início</a>
          <a href="#historia">Sobre</a>
          <a href="#cardapio">Cardápio</a>
          <a href="#familia">Faça parte</a>
        </nav>
      </div>
      <div className="footer-sep" aria-hidden="true" />
      <div className="container footer-bottom">
        © 2025 <a className="footer-brand-link" href="https://solytcompany.com" target="_blank" rel="noopener noreferrer">Solyt Company</a>. Todos os direitos reservados.
      </div>
    </footer>
  );
}

export default Footer;


