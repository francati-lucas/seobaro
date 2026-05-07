import React from 'react';
import Modal from './Modal';

const AUTH_USER = 'Admin123';
const AUTH_PASS = 'Admin123';
const AUTH_STORAGE_KEY = 'seobaro_auth_v1';

/** Tempo máximo para continuar logado sem pedir usuário/senha de novo (24h). Ajuste se quiser mais ou menos. */
const AUTH_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

const WHATSAPP_NUMBER = '5519984380002';

function setAuthed() {
  const now = Date.now();
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      ok: true,
      at: now,
      expiresAt: now + AUTH_SESSION_TTL_MS,
    })
  );
}

export function isAuthed() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data?.ok) return false;

    const expiresAt =
      typeof data.expiresAt === 'number'
        ? data.expiresAt
        : typeof data.at === 'number'
          ? data.at + AUTH_SESSION_TTL_MS
          : 0;

    if (!expiresAt || Date.now() >= expiresAt) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

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
  const [step, setStep] = React.useState(initialStep);

  React.useEffect(() => {
    if (!open) return;
    setStep(initialStep);
  }, [initialStep, open]);

  const [user, setUser] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [loginError, setLoginError] = React.useState('');

  const [empresa, setEmpresa] = React.useState('');
  const [cnpj, setCnpj] = React.useState('');
  const [responsavel, setResponsavel] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [cidade, setCidade] = React.useState('');
  const [obs, setObs] = React.useState('');
  const [cadastroTouched, setCadastroTouched] = React.useState(false);

  const cadastroOk = React.useMemo(() => {
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
    onClose?.();
  }

  function doLogin(e) {
    e.preventDefault();
    setLoginError('');
    const u = user.trim();
    const p = pass;
    if (u === AUTH_USER && p === AUTH_PASS) {
      setAuthed();
      onSuccess?.();
      closeAndReset();
      return;
    }
    setLoginError('Usuário ou senha inválidos.');
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
              Sou cliente
            </button>
            <button type="button" className="sb-btn sb-btn--secondary" onClick={() => setStep('signup')}>
              Não sou cliente
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
            <span className="sb-field__label">Usuário</span>
            <input
              className="sb-field__input"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
              placeholder="Digite seu usuário"
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
            />
          </label>
          {loginError && <div className="sb-alert sb-alert--error">{loginError}</div>}
          <div className="sb-actions">
            <button type="button" className="sb-btn sb-btn--ghost" onClick={() => setStep('choose')}>
              Voltar
            </button>
            <button type="submit" className="sb-btn sb-btn--primary">
              Entrar
            </button>
          </div>
        </form>
      )}

      {step === 'signup' && (
        <div className="sb-stack">
          <p className="sb-lead">Faça seu cadastro para revenda.</p>
          <div className="sb-form">
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
            <div className="sb-alert sb-alert--error">Preencha os campos obrigatórios para enviar.</div>
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

