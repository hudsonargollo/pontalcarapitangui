import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingFallback from '../LoadingFallback';

describe('LoadingFallback', () => {
  it('renders loading message in Portuguese', () => {
    render(<LoadingFallback />);
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    expect(screen.getByText('Preparando para você! 🥥')).toBeInTheDocument();
  });

  it('renders with purple theme styling', () => {
    const { container } = render(<LoadingFallback />);
    
    // Check that the component renders with the expected structure
    const loadingContainer = container.querySelector('.min-h-screen');
    expect(loadingContainer).toBeInTheDocument();
    
    // Check for spinner element
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('displays spinner animation', () => {
    const { container } = render(<LoadingFallback />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('border-primary');
    expect(spinner).toHaveClass('rounded-full');
  });
});
