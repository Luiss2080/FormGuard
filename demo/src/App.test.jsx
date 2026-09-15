import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component', () => {
  it('renders the hero section correctly', () => {
    render(<App />);
    expect(screen.getByText('Form Validator Simple')).toBeInTheDocument();
  });

  it('shows error when submitting empty standard form', async () => {
    render(<App />);
    
    // Switch to demo tab if not already
    const demoTab = screen.getByText('App Interactiva');
    fireEvent.click(demoTab);
    
    // Find the submit button
    const submitBtn = screen.getByText('Registrarse Ahora');
    fireEvent.click(submitBtn);

    // Wait for the validation (async because of the hook and rule)
    await waitFor(() => {
      expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
      expect(screen.getByText('Revisa los errores en el formulario')).toBeInTheDocument(); // Toast
    });
  });

  it('switches to wizard tab and renders correctly', () => {
    render(<App />);
    
    // Find Wizard tab
    const wizardTab = screen.getByText('Flujo Avanzado (Wizard)');
    fireEvent.click(wizardTab);
    
    expect(screen.getByText('Flujo Multi-paso (Wizard)')).toBeInTheDocument();
  });
});
