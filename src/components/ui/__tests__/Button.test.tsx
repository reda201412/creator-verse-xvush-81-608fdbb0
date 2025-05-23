import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

describe('Button Component', () => {
  it('renders the button with correct text', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const buttonElement = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });

    expect(buttonElement).toBeDisabled();
  });

  it('applies default variant and size classes', () => {
    render(<Button>Default Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /default button/i });

    expect(buttonElement).toHaveClass('bg-primary');
    expect(buttonElement).toHaveClass('h-10');
    expect(buttonElement).toHaveClass('px-4');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Class</Button>);
    const buttonElement = screen.getByRole('button', { name: /custom class/i });

    expect(buttonElement).toHaveClass('custom-class');
  });
});
