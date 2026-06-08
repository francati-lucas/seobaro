import React, { useState, useMemo, useEffect } from 'react';
import Modal from './Modal';
import { auth, db } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const WHATSAPP_NUMBER = '5519984380002';

function buildCadastroWhatsAppLink({ empresa, cnpj, responsavel, whatsapp, cidade, obs }) {
  const parts = [
    'Olá! Gostaria de me cadastrar para revender as tortas da Seo Baro.',
    '',
    `Empresa: ${empresa}`,
    `CNPJ: ${cnpj}`,
    `Responsável: ${responsavel}`,
    `WhatsApp: ${whatsapp}`,
    `Cidade/UF: ${cidade}`,
  ];
  if (obs?.trim()) parts.push(`Observações: ${obs.trim()}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(parts.join('\n'))}`;
}

function StepPill({ active, children }) {
  return <span className={`sb-pill ${active ? 'is-active' : ''}`}>{children}</span>;
}

export default function PedidoAccessModal({ open, initialStep = 'choose', onClose, onSuccess }) {
  const [step, setStep] = useState(initialStep);

  useEffect(() => {
    if (!open) return;
    setStep(initialStep);
  }, [initialStep, open]);

  // Login State
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Signup State
  const [empresa, setEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cidade, setCidade] = useState('');
  const [obs, setObs] = useState('');
  const [cadastroTouched, setCadastroTouched] = useState(false);

  const cadastroOk = useMemo(() => {
    return (
      empresa.trim().length > 1 &&
      cnpj.trim().length > 0 &&
      responsavel.trim().length > 1 &&
      whatsapp.trim().length > 7 &&
      cidade.trim().length > 1
    );
  }, [cidade, cnpj, empresa, responsavel, whatsapp]);

  function closeAndReset() {
    setLoginError('');
    setCadastroTouched(false);
    setEmail('');
    setPass('');
    setIsSubmitting(false);
    onClose?.();
  }

  async function doLogin(e) {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      onSuccess?.();
      closeAndReset();
    } catch (err) {
      console.error(err);
      setLoginError('E-mail ou senha inválidos.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Acesso ao Pedido"
      ariaLabel="Acesso ao Pedido"
      size="sm"
      onClose={closeAndReset}
    >
      <div className="sb-steps">
        <StepPill active={step === 'choose'}>Cliente?</StepPill>
        <StepPill active={step === 'login'}>Login</StepPill>
        <StepPill active={step === 'signup'}>Cadastro</StepPill>
      </div>

      {step === 'choose' && (
        <div className="sb-stack">
          <p className="sb-lead">Você já é cliente/revendedor?</p>
          <div className="sb-grid-2">
            <button type="button" className="sb-btn sb-btn--primary" onClick={() => setStep('login')}>
              SOU CLIENTE
            </button>
            <button type="button" className="sb-btn sb-btn--secondary" onClick={() => setStep('signup')}>
              NÃO SOU CLIENTE
            </button>
          </div>
          <p className="sb-muted">
            Se não for cliente, faça seu cadastro que a gente analisa e responde pelo WhatsApp.
          </p>
        </div>
      )}

      {step === 'login' && (
        <form className="sb-stack" onSubmit={doLogin}>
          <p className="sb-lead">Faça login para liberar o cardápio de pedidos.</p>
          <label className="sb-field">
            <span className="sb-field__label">E-mail</span>
            <input
              className="sb-field__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Digite seu e-mail"
              required
            />
          </label>
          <label className="sb-field">
            <span className="sb-field__label">Senha</span>
            <input
              className="sb-field__input"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
              placeholder="Digite sua senha"
              required
            />
          </label>
          {loginError && <div className="sb-alert sb-alert--error">{loginError}</div>}
          <div className="sb-actions">
            <button type="button" className="sb-btn sb-btn--ghost" onClick={() => setStep('choose')} disabled={isSubmitting}>
              Voltar
            </button>
            <button type="submit" className="sb-btn sb-btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      )}

      {step === 'signup' && (
        <div className="sb-stack">
          <p className="sb-lead">Faça seu cadastro para análise de revenda.</p>
          <div className="sb-form" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
            <label className={`sb-field ${cadastroTouched && empresa.trim().length < 2 ? 'has-error' : ''}`}>
              <span className="sb-field__label">Nome da empresa</span>
              <input
                className="sb-field__input"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Ex.: Padaria X"
                onBlur={() => setCadastroTouched(true)}
              />
            </label>

            <label className={`sb-field ${cadastroTouched && cnpj.trim().length === 0 ? 'has-error' : ''}`}>
              <span className="sb-field__label">CNPJ</span>
              <input
                className="sb-field__input"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
                onBlur={() => setCadastroTouched(true)}
              />
            </label>

            <label className={`sb-field ${cadastroTouched && responsavel.trim().length < 2 ? 'has-error' : ''}`}>
              <span className="sb-field__label">Responsável</span>
              <input
                className="sb-field__input"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                placeholder="Seu nome"
                onBlur={() => setCadastroTouched(true)}
              />
            </label>

            <label className={`sb-field ${cadastroTouched && whatsapp.trim().length < 8 ? 'has-error' : ''}`}>
              <span className="sb-field__label">WhatsApp</span>
              <input
                className="sb-field__input"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(DDD) 9xxxx-xxxx"
                onBlur={() => setCadastroTouched(true)}
              />
            </label>

            <label className={`sb-field ${cadastroTouched && cidade.trim().length < 2 ? 'has-error' : ''}`}>
              <span className="sb-field__label">Cidade/UF</span>
              <input
                className="sb-field__input"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex.: Campinas/SP"
                onBlur={() => setCadastroTouched(true)}
              />
            </label>
            
            <label className="sb-field sb-field--full">
              <span className="sb-field__label">Observações (opcional)</span>
              <textarea
                className="sb-field__textarea"
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                placeholder="Fale um pouco sobre sua loja, volume, bairro, etc."
                rows={3}
              />
            </label>
          </div>

          {cadastroTouched && !cadastroOk && (
            <div className="sb-alert sb-alert--error">Preencha os campos obrigatórios corretamente.</div>
          )}

          <div className="sb-actions">
            <button type="button" className="sb-btn sb-btn--ghost" onClick={() => setStep('choose')}>
              Voltar
            </button>
            <a
              className={`sb-btn sb-btn--primary ${!cadastroOk ? 'is-disabled' : ''}`}
              href={buildCadastroWhatsAppLink({
                empresa: empresa.trim(),
                cnpj: cnpj.trim(),
                responsavel: responsavel.trim(),
                whatsapp: whatsapp.trim(),
                cidade: cidade.trim(),
                obs,
              })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                setCadastroTouched(true);
                if (!cadastroOk) {
                  e.preventDefault();
                  return;
                }
                closeAndReset();
              }}
            >
              Enviar cadastro no WhatsApp
            </a>
          </div>
        </div>
      )}
    </Modal>
  );
}
