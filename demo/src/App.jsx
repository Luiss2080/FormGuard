import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, Loader2, Sparkles, BookOpen, Layout, Moon, Sun, CreditCard, User, Info, UploadCloud, FileText, Copy } from 'lucide-react';
import { useFormValidator } from '@luiss2080/form-validator-simple/react';
import { required, isEmail, minLength, match, isUrl, isCreditCard, isDate, isNumeric, maxFileSize, allowedFileTypes, isStrongPassword } from '@luiss2080/form-validator-simple';

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
  if (isStrongPassword(password)) strength = 'strong';
  
  return (
    <div className="strength-bar">
      <div className={`strength-fill strength-${strength}`}></div>
    </div>
  );
}

function Tooltip({ text }) {
  return (
    <span className="tooltip-container">
      <Info size={14} style={{ color: 'var(--accent)', marginLeft: '4px' }} />
      <span className="tooltip-text">{text}</span>
    </span>
  );
}

function PayloadModal({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert("¡Copiado al portapapeles!");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: '0.5rem' }}>Registro Completado 🎉</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Tu payload está validado y listo para el backend:</p>
        <pre className="json-viewer">
          {JSON.stringify(data, null, 2)}
        </pre>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" style={{ background: 'var(--bg-input)', color: 'var(--text-main)', flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem' }} onClick={copyToClipboard}>
            <Copy size={16} /> Copiar
          </button>
          <button className="btn btn-primary" onClick={onClose} style={{ flex: 1 }}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

function WizardForm({ onComplete }) {
  const [step, setStep] = useState(1);
  const [shakeFields, setShakeFields] = useState({});
  const fileInputRef = useRef(null);

  // Intentar cargar progreso de localstorage
  const initialValues = JSON.parse(localStorage.getItem('wizard_draft')) || { name: '', dob: '', cc: '', document: null };

  const { values, errors, handleChange, validate } = useFormValidator(
    initialValues,
    {
      name: v => required(v) || 'Requerido',
      dob: v => isDate(v) || 'Fecha inválida (YYYY-MM-DD)',
      cc: v => isCreditCard(v) || 'Tarjeta inválida (Luhn)',
      document: [
        v => required(v) || 'Debes subir un archivo',
        v => maxFileSize(v, 2) || 'El archivo excede los 2MB',
        v => allowedFileTypes(v, ['image/jpeg', 'image/png', 'application/pdf']) || 'Solo JPG, PNG o PDF'
      ]
    }
  );

  // Autoguardado
  useEffect(() => {
    const draft = { ...values, document: null }; // No podemos guardar el archivo real en JSON
    localStorage.setItem('wizard_draft', JSON.stringify(draft));
  }, [values]);

  const triggerShake = (field) => {
    setShakeFields(prev => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setShakeFields(prev => ({ ...prev, [field]: false }));
    }, 300);
  };

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = required(values.name) === true;
      if (!isValid) triggerShake('name');
    }
    if (step === 2) {
      isValid = isDate(values.dob) === true;
      if (!isValid) triggerShake('dob');
    }
    if (step === 3) {
      isValid = required(values.document) === true;
      if (!isValid) triggerShake('document');
    }
    
    if (isValid) setStep(s => s + 1);
    else await validate(); 
  };

  const submit = async () => {
    if (await validate()) {
      localStorage.removeItem('wizard_draft'); // Limpiamos progreso al finalizar
      onComplete(values); // Enviamos payload
    } else {
      triggerShake('cc');
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleChange('document', e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleChange('document', e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
      <h2>Flujo Multi-paso (Wizard)</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Se guarda automáticamente tu progreso (Draft).</p>
      
      <div className="wizard-progress">
        <div className={`wizard-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>1</div>
        <div className={`wizard-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>2</div>
        <div className={`wizard-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>3</div>
        <div className={`wizard-step ${step >= 4 ? 'active' : ''}`}>4</div>
      </div>

      {step === 1 && (
        <div className="animate-fade-in">
          <div className="input-group">
            <label className="input-label">Nombre <User size={14} /></label>
            <input className={`input-field ${shakeFields.name ? 'error-shake' : ''}`} value={values.name} onChange={e => handleChange('name', e.target.value)} />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          <button className="btn btn-primary" onClick={nextStep}>Siguiente</button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <div className="input-group">
            <label className="input-label">Fecha de Nacimiento (YYYY-MM-DD)</label>
            <input className={`input-field ${shakeFields.dob ? 'error-shake' : ''}`} value={values.dob} onChange={e => handleChange('dob', e.target.value)} placeholder="2000-01-25" />
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
            <label className="input-label">Identificación (Máx 2MB) <Tooltip text="Sube tu DNI o pasaporte en formato PDF, JPG o PNG." /></label>
            <div 
              className={`dropzone ${errors.document ? 'has-error' : (values.document && !errors.document ? 'has-success' : '')} ${shakeFields.document ? 'error-shake' : ''}`}
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} accept=".pdf,.jpg,.jpeg,.png" />
              {values.document ? (
                <>
                  <FileText size={48} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
                  <p>{values.document.name}</p>
                </>
              ) : (
                <>
                  <UploadCloud size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                  <p>Arrastra tu archivo aquí o haz clic para subir</p>
                </>
              )}
            </div>
            {errors.document && <span className="error-text">{errors.document}</span>}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ background: 'var(--bg-input)', color: 'var(--text-main)' }} onClick={() => setStep(2)}>Atrás</button>
            <button className="btn btn-primary" onClick={nextStep}>Siguiente</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="animate-fade-in">
          <div className="input-group">
            <label className="input-label">Tarjeta de Crédito <CreditCard size={14} /> <Tooltip text="Validamos usando el algoritmo matemático de Luhn." /></label>
            <input className={`input-field ${shakeFields.cc ? 'error-shake' : ''}`} value={values.cc} onChange={e => handleChange('cc', e.target.value)} placeholder="4111111111111111" />
            {errors.cc && <span className="error-text">{errors.cc}</span>}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ background: 'var(--bg-input)', color: 'var(--text-main)' }} onClick={() => setStep(3)}>Atrás</button>
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
  const [shakeFields, setShakeFields] = useState({});
  const [payloadModal, setPayloadModal] = useState({ open: false, data: null });

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
      password: v => isStrongPassword(v) || 'Debe incluir minúsculas, mayúsculas, números y símbolos (mín 8 chars)',
      confirm: v => (required(v) && match(v, values.password)) || 'Las contraseñas no coinciden'
    }
  );

  const triggerShake = (field) => {
    setShakeFields(prev => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setShakeFields(prev => ({ ...prev, [field]: false }));
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validate(true);
    if (isValid) {
      setPayloadModal({ open: true, data: values });
    } else {
      addToast('Revisa los errores en el formulario', 'error');
      // Hacer temblar el primer campo con error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) triggerShake(firstErrorField);
    }
  };

  const getInputStatus = (field) => {
    if (errors[field]) return 'is-invalid';
    if (values[field] && !errors[field]) return 'is-valid';
    return '';
  };

  const getShakeClass = (field) => {
    return shakeFields[field] ? 'error-shake' : '';
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
                  <label className="input-label">Nombre Completo <Tooltip text="Tu nombre real que aparecerá en tu perfil público." /></label>
                  <input className={`input-field ${getInputStatus('name')} ${getShakeClass('name')}`} value={values.name} onChange={e => handleChange('name', e.target.value)} />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                <div className="input-group">
                  <label className="input-label">Correo Electrónico</label>
                  <input className={`input-field ${getInputStatus('email')} ${getShakeClass('email')}`} value={values.email} onChange={e => handleChange('email', e.target.value)} />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                <div className="input-group">
                  <label className="input-label">Usuario (asíncrono: 'admin') <Tooltip text="Validamos en tiempo real contra nuestra 'API' para asegurar disponibilidad." /></label>
                  <input className={`input-field ${getInputStatus('username')} ${getShakeClass('username')}`} value={values.username} onChange={e => handleChange('username', e.target.value)} />
                  {errors.username && <span className="error-text">{errors.username}</span>}
                </div>
                <div className="input-group">
                  <label className="input-label">Contraseña <Tooltip text="Regla isStrongPassword: requiere minúsculas, mayúsculas, números y símbolos" /></label>
                  <input className={`input-field ${getInputStatus('password')} ${getShakeClass('password')}`} type="password" value={values.password} onChange={e => handleChange('password', e.target.value)} />
                  <PasswordStrength password={values.password} />
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Validando API...</> : 'Registrarse Ahora'}
                </button>
              </form>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Magia bajo el capó 🧙‍♂️</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Observa lo simple que es implementar reglas complejas con nuestra librería:</p>
              <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '8px', overflowX: 'auto', flex: 1, fontSize: '0.9rem' }}>
                <code style={{ color: '#a78bfa' }}>
{`import { useFormValidator } from '@luiss2080/form-validator-simple/react';

const { values, errors, validate } = useFormValidator(
  { email: '', username: '' },
  {
    email: v => isEmail(v) || 'Email inválido',
    username: async v => {
      // Regla asíncrona!
      const exists = await checkDB(v);
      return !exists || 'Usuario en uso';
    }
  }
);`}
                </code>
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'wizard' && (
          <div className="grid-2">
            <WizardForm onComplete={(payload) => {
              addToast('Wizard completado', 'success');
              setPayloadModal({ open: true, data: { ...payload, document: payload.document ? payload.document.name : null } });
            }} />
          </div>
        )}

      </section>

      <div className="toast-container">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(ts => ts.filter(x => x.id !== t.id))} />
        ))}
      </div>

      <PayloadModal 
        isOpen={payloadModal.open} 
        data={payloadModal.data} 
        onClose={() => setPayloadModal({ open: false, data: null })} 
      />
    </div>
  );
}

export default App;
