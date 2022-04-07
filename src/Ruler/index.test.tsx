import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Ruler from './index';

describe('Ruler', () => {
  it('render Ruler with dumi', () => {
    const msg = 'dumi';

    render(<Ruler width={600} height={20} direction="horizontal" />);
    expect(screen.getAllByRole('ruler')).toBeInTheDocument();
  });
});
