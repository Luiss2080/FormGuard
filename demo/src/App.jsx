import React, { useState } from 'react';
import { CheckCircle2, XCircle, Loader2, Sparkles, BookOpen, Layout } from 'lucide-react';
import { useFormValidator } from '@luiss2080/form-validator-simple/react';
import { required, isEmail, minLength, match, isUrl } from '@luiss2080/form-validator-simple';

function Modal({ isOpen, onClose, title, message, success }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ marginBottom: '1rem', color: success ? 'var(--success)' : 'var(--error)' }}>
          {success ? <CheckCircle2 size={48} className="animate-fade-in" /> : <XCircle size={48} className="animate-fade-in" />}
        </div>
        <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{message}</p>
        <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
          Entendido
        </button>
      </div>
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

function App() {
  const [activeTab, setActiveTab] = useState('demo');
  const [modal, setModal] = useState({ open: false, title: '', message: '', success: false });

  // Async mock rule
  const isUsernameAvailable = async (v) => {
    if (!v) return true;
    await new Promise(r => setTimeout(r, 800)); // simulate api
    return v.toLowerCase() !== 'admin' || 'El nombre de usuario "admin" está en uso';
  };

  const { values, errors, handleChange, validate, isSubmitting } = useFormValidator(
    { name: '', email: '', username: '', password: '', confirm: '', website: '' },
    {
      name: v => required(v) || 'El nombre es obligatorio',
      email: v => isEmail(v) || 'Por favor ingresa un email válido',
      username: async v => {
        if (!required(v)) return 'El usuario es obligatorio';
        if (!minLength(v, 4)) return 'Mínimo 4 caracteres';
        return await isUsernameAvailable(v);
      },
      password: v => minLength(v, 6) || 'La contraseña debe tener al menos 6 caracteres',
      confirm: v => (required(v) && match(v, values.password)) || 'Las contraseñas no coinciden',
      website: v => !v || isUrl(v) || 'Debe ser una URL válida (ej. https://...)'
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validate(true);
    if (isValid) {
      setModal({ open: true, title: '¡Registro Exitoso!', message: 'Tus datos han sido validados correctamente. Excelente trabajo.', success: true });
    } else {
      setModal({ open: true, title: 'Revisa el formulario', message: 'Hay algunos errores que debes corregir antes de continuar.', success: false });
    }
  };

  const getInputStatus = (field) => {
    if (errors[field]) return 'is-invalid';
    if (values[field] && !errors[field]) return 'is-valid';
    return '';
  };

  return (
    <div className="container">
      <header className="hero animate-fade-in">
        <h1>Form Validator Simple</h1>
        <p>Potencia tus formularios con validaciones ultrarrápidas, diseño interactivo y tipado estricto. Sin dependencias externas.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => setActiveTab('demo')}>
            Demostración <Sparkles size={18} />
          </button>
          <button className="btn" style={{ background: 'var(--bg-input)', color: 'white' }} onClick={() => setActiveTab('docs')}>
            Documentación <BookOpen size={18} />
          </button>
        </div>
      </header>

      <section className="animate-fade-in delay-1" style={{ paddingBottom: '4rem' }}>
        <div className="tabs-header">
          <button className={`tab-btn ${activeTab === 'demo' ? 'active' : ''}`} onClick={() => setActiveTab('demo')}>
            <Layout size={18} style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '8px' }} />
            App Interactiva
          </button>
          <button className={`tab-btn ${activeTab === 'docs' ? 'active' : ''}`} onClick={() => setActiveTab('docs')}>
            <BookOpen size={18} style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '8px' }} />
            Manual de Uso
          </button>
        </div>

        {activeTab === 'demo' && (
          <div className="grid-2 animate-fade-in">
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Crea tu Cuenta</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label className="input-label">Nombre Completo</label>
                  <input 
                    className={`input-field ${getInputStatus('name')}`}
                    type="text" 
                    placeholder="Juan Pérez"
                    value={values.name}
                    onChange={e => handleChange('name', e.target.value)}
                  />
                  <div className="input-icon">
                    {errors.name && <XCircle size={18} color="var(--error)" />}
                    {values.name && !errors.name && <CheckCircle2 size={18} color="var(--success)" />}
                  </div>
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label">Correo Electrónico</label>
                  <input 
                    className={`input-field ${getInputStatus('email')}`}
                    type="email" 
                    placeholder="juan@ejemplo.com"
                    value={values.email}
                    onChange={e => handleChange('email', e.target.value)}
                  />
                  <div className="input-icon">
                    {errors.email && <XCircle size={18} color="var(--error)" />}
                    {values.email && !errors.email && <CheckCircle2 size={18} color="var(--success)" />}
                  </div>
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label">Usuario (Prueba poner "admin")</label>
                  <input 
                    className={`input-field ${getInputStatus('username')}`}
                    type="text" 
                    placeholder="juancito99"
                    value={values.username}
                    onChange={e => handleChange('username', e.target.value)}
                  />
                  <div className="input-icon">
                    {errors.username && <XCircle size={18} color="var(--error)" />}
                    {values.username && !errors.username && <CheckCircle2 size={18} color="var(--success)" />}
                  </div>
                  {errors.username && <span className="error-text">{errors.username}</span>}
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Contraseña</label>
                    <input 
                      className={`input-field ${getInputStatus('password')}`}
                      type="password" 
                      placeholder="••••••••"
                      value={values.password}
                      onChange={e => handleChange('password', e.target.value)}
                    />
                    <PasswordStrength password={values.password} />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                  </div>

                  <div className="input-group">
                    <label className="input-label">Confirmar Contraseña</label>
                    <input 
                      className={`input-field ${getInputStatus('confirm')}`}
                      type="password" 
                      placeholder="••••••••"
                      value={values.confirm}
                      onChange={e => handleChange('confirm', e.target.value)}
                    />
                    {errors.confirm && <span className="error-text">{errors.confirm}</span>}
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Sitio Web (Opcional)</label>
                  <input 
                    className={`input-field ${getInputStatus('website')}`}
                    type="text" 
                    placeholder="https://tupagina.com"
                    value={values.website}
                    onChange={e => handleChange('website', e.target.value)}
                  />
                  {errors.website && <span className="error-text">{errors.website}</span>}
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

        {activeTab === 'docs' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '3rem' }}>
            <h2>Manual de Uso</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Bienvenido a la documentación oficial de `@luiss2080/form-validator-simple`.</p>
            
            <h3 style={{ marginTop: '2rem' }}>Instalación</h3>
            <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', marginTop: '1rem', color: '#fff' }}>
              <code>npm install @luiss2080/form-validator-simple</code>
            </pre>

            <h3 style={{ marginTop: '2rem' }}>Reglas Disponibles</h3>
            <ul style={{ marginTop: '1rem', marginLeft: '1.5rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
              <li><strong style={{color: '#fff'}}>required(value)</strong>: Valida que el campo no esté vacío.</li>
              <li><strong style={{color: '#fff'}}>isEmail(value)</strong>: Verifica formato de correo electrónico.</li>
              <li><strong style={{color: '#fff'}}>minLength(value, min)</strong> / <strong style={{color: '#fff'}}>maxLength(value, max)</strong>: Validadores de longitud de texto.</li>
              <li><strong style={{color: '#fff'}}>isUrl(value)</strong>: Verifica un enlace web estándar.</li>
              <li><strong style={{color: '#fff'}}>isNumeric(value)</strong>: Verifica si la cadena es un número válido.</li>
              <li><strong style={{color: '#fff'}}>match(value, matchWith)</strong>: Comparación estricta para contraseñas.</li>
            </ul>

            <h3 style={{ marginTop: '2rem' }}>Validación Asíncrona</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Si necesitas verificar datos en una API, puedes retornar promesas en tus reglas de validación y usar <code>validateFormAsync</code> (o nuestro hook de React activando la flag asíncrona).</p>
          </div>
        )}

      </section>

      <Modal 
        isOpen={modal.open} 
        title={modal.title} 
        message={modal.message} 
        success={modal.success}
        onClose={() => setModal({ ...modal, open: false })} 
      />
    </div>
  );
}

export default App;
