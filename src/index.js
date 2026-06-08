import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Reveal on scroll: IntersectionObserver (robusto para SSR/SPA)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
);

function initReveal() {
  document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => observer.observe(el));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReveal);
} else {
  // Executa imediatamente após o primeiro paint
  requestAnimationFrame(initReveal);
}

// Fallback extra: checagem por scroll/resize (garante visibilidade caso o Observer falhe)
function checkRevealOnScroll() {
  const vh = window.innerHeight || document.documentElement.clientHeight;
  document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < vh * 0.9 && rect.bottom > 0) {
      el.classList.add('is-visible');
    }
  });
}

window.addEventListener('load', () => {
  checkRevealOnScroll();
});
window.addEventListener('scroll', checkRevealOnScroll, { passive: true });
window.addEventListener('resize', checkRevealOnScroll);
