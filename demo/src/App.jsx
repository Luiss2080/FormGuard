import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2, Sparkles, BookOpen, Layout, Moon, Sun, CreditCard, User, Bell } from 'lucide-react';
import { useFormValidator } from '@luiss2080/form-validator-simple/react';
import { required, isEmail, minLength, match, isUrl, isCreditCard, isDate, isNumeric } from '@luiss2080/form-validator-simple';

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast">
      {type === 'success' ? <CheckCircle2 color="var(--success)" size={20} /> : <XCircle color="var(--error)" size={20} />}
      <span>{message}</span>
    </div>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  let strength = 'weak';
  if (password.length > 5 && /[A-Z]/.test(password)) strength = 'medium';
  if (password.length > 7 && /[A-Z]/.test(password) && /[0-9]/.test(password)) strength = 'strong';
  
  return (
    <div className="strength-bar">
      <div className={`strength-fill strength-${strength}`}></div>
    </div>
  );
}

function WizardForm({ onComplete }) {
  const [step, setStep] = useState(1);
  const { values, errors, handleChange, validate } = useFormValidator(
    { name: '', dob: '', cc: '' },
    {
      name: v => required(v) || 'Requerido',
      dob: v => isDate(v) || 'Fecha inválida (YYYY-MM-DD)',
      cc: v => isCreditCard(v) || 'Tarjeta inválida (Luhn)'
    }
  );

  const nextStep = async () => {
    // Validate current step
    let isValid = false;
    if (step === 1) isValid = required(values.name) === true;
    if (step === 2) isValid = isDate(values.dob) === true;
    
    if (isValid) setStep(s => s + 1);
    else await validate(); // trigger errors visually
  };

  const submit = async () => {
    if (await validate()) onComplete();
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
      <h2>Flujo Multi-paso (Wizard)</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Valida porciones de un formulario antes de avanzar.</p>
      
      <div className="wizard-progress">
        <div className={`wizard-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>1</div>
        <div className={`wizard-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>2</div>
        <div className={`wizard-step ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>

      {step === 1 && (
        <div className="animate-fade-in">
          <div className="input-group">
            <label className="input-label">Nombre <User size={14} /></label>
            <input className="input-field" value={values.name} onChange={e => handleChange('name', e.target.value)} />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          <button className="btn btn-primary" onClick={nextStep}>Siguiente</button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <div className="input-group">
            <label className="input-label">Fecha de Nacimiento (YYYY-MM-DD)</label>
            <input className="input-field" value={values.dob} onChange={e => handleChange('dob', e.target.value)} placeholder="2000-01-25" />
            {errors.dob && <span className="error-text">{errors.dob}</span>}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ background: 'var(--bg-input)', color: 'var(--text-main)' }} onClick={() => setStep(1)}>Atrás</button>
            <button className="btn btn-primary" onClick={nextStep}>Siguiente</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <div className="input-group">
            <label className="input-label">Tarjeta de Crédito <CreditCard size={14} /></label>
            <input className="input-field" value={values.cc} onChange={e => handleChange('cc', e.target.value)} placeholder="4111111111111111" />
            {errors.cc && <span className="error-text">{errors.cc}</span>}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ background: 'var(--bg-input)', color: 'var(--text-main)' }} onClick={() => setStep(2)}>Atrás</button>
            <button className="btn btn-primary" onClick={submit}>Finalizar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('demo');
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
  };

  const isUsernameAvailable = async (v) => {
    if (!v) return true;
    await new Promise(r => setTimeout(r, 800)); // simulate api
    return v.toLowerCase() !== 'admin' || 'El nombre de usuario "admin" está en uso';
  };

  const { values, errors, handleChange, validate, isSubmitting } = useFormValidator(
    { name: '', email: '', username: '', password: '', confirm: '' },
    {
      name: v => required(v) || 'El nombre es obligatorio',
      email: v => isEmail(v) || 'Email inválido',
      username: async v => {
        if (!required(v)) return 'Requerido';
        if (!minLength(v, 4)) return 'Mínimo 4 caracteres';
        return await isUsernameAvailable(v);
      },
      password: v => minLength(v, 6) || 'La contraseña debe tener al menos 6 caracteres',
      confirm: v => (required(v) && match(v, values.password)) || 'Las contraseñas no coinciden'
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validate(true);
    if (isValid) {
      addToast('¡Registro Exitoso!', 'success');
    } else {
      addToast('Revisa los errores en el formulario', 'error');
    }
  };

  return (
    <div className="container">
      <button 
        onClick={toggleTheme} 
        style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
      >
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <header className="hero animate-fade-in">
        <h1>Form Validator Simple</h1>
        <p>Potencia tus formularios con validaciones ultrarrápidas, diseño interactivo y tipado estricto. Sin dependencias externas.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => setActiveTab('demo')}>
            Formulario Completo <Sparkles size={18} />
          </button>
          <button className="btn" style={{ background: 'var(--bg-input)', color: 'var(--text-main)' }} onClick={() => setActiveTab('wizard')}>
            Wizard (Multi-paso) <Layout size={18} />
          </button>
        </div>
      </header>

      <section className="animate-fade-in delay-1" style={{ paddingBottom: '4rem' }}>
        <div className="tabs-header">
          <button className={`tab-btn ${activeTab === 'demo' ? 'active' : ''}`} onClick={() => setActiveTab('demo')}>
            App Interactiva
          </button>
          <button className={`tab-btn ${activeTab === 'wizard' ? 'active' : ''}`} onClick={() => setActiveTab('wizard')}>
            Flujo Avanzado (Wizard)
          </button>
        </div>

        {activeTab === 'demo' && (
          <div className="grid-2 animate-fade-in">
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Registro Estándar</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label className="input-label">Nombre Completo</label>
                  <input className="input-field" value={values.name} onChange={e => handleChange('name', e.target.value)} />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                <div className="input-group">
                  <label className="input-label">Correo Electrónico</label>
                  <input className="input-field" value={values.email} onChange={e => handleChange('email', e.target.value)} />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                <div className="input-group">
                  <label className="input-label">Usuario (asíncrono: 'admin')</label>
                  <input className="input-field" value={values.username} onChange={e => handleChange('username', e.target.value)} />
                  {errors.username && <span className="error-text">{errors.username}</span>}
                </div>
                <div className="input-group">
                  <label className="input-label">Contraseña</label>
                  <input className="input-field" type="password" value={values.password} onChange={e => handleChange('password', e.target.value)} />
                  <PasswordStrength password={values.password} />
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Validando API...</> : 'Registrarse Ahora'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'wizard' && (
          <div className="grid-2">
            <WizardForm onComplete={() => addToast('Wizard completado con éxito', 'success')} />
          </div>
        )}

      </section>

      <div className="toast-container">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(ts => ts.filter(x => x.id !== t.id))} />
        ))}
      </div>
    </div>
  );
}

export default App;
