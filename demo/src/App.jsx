import React, { useState } from 'react';
import { CheckCircle2, XCircle, Loader2, Sparkles } from 'lucide-react';
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
          Cerrar
        </button>
      </div>
    </div>
  );
}

function App() {
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
    const isValid = await validate(true); // run async validation
    if (isValid) {
      setModal({ open: true, title: '¡Registro Exitoso!', message: 'Tus datos han sido validados correctamente usando la librería.', success: true });
    } else {
      // Opcional: mostrar modal de error general, o simplemente dejar los errores en los inputs
      setModal({ open: true, title: 'Error en el formulario', message: 'Por favor, revisa los campos en rojo e intenta de nuevo.', success: false });
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
        <p>Una librería ultra-ligera, ahora con diseño interactivo, animaciones fluidas y el máximo nivel de control para tus formularios.</p>
        <button className="btn btn-primary" onClick={() => document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' })}>
          Ver Demostración <Sparkles size={18} />
        </button>
      </header>

      <section id="demo-section" className="grid-2 animate-fade-in delay-1" style={{ paddingBottom: '4rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Interactive Demo
          </h2>
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
              <label className="input-label">Usuario (asíncrono, prueba "admin")</label>
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
              {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Validando...</> : 'Validar y Enviar'}
            </button>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Código en Vivo</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Este formulario está potenciado por el hook nativo exportado por nuestra librería:</p>
          <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '8px', overflowX: 'auto', flex: 1, fontSize: '0.85rem' }}>
            <code style={{ color: '#a78bfa' }}>
{`const { values, errors, validate } = useFormValidator(
  { email: '', username: '' },
  {
    email: v => isEmail(v) || 'Inválido',
    username: async v => {
      const exists = await checkDB(v);
      return !exists || 'Usuario en uso';
    }
  }
);

const onSubmit = async () => {
  if (await validate(true)) {
    // Formulario válido!
  }
};`}
            </code>
          </pre>
        </div>

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
