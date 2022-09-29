import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Ruler from './index';

describe('Ruler', () => {
  it('render horizontal ruler', () => {
    render(<Ruler width={600} height={20} direction="horizontal" />);
    expect(screen.getAllByRole('ruler')).toBeTruthy();
  });

  it('render vertical ruler', () => {
    render(<Ruler width={20} height={600} direction="vertical" />);
    expect(screen.getAllByRole('ruler')).toBeTruthy();
  });
});
