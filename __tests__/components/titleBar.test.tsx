import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TitleBar } from '@/components/titleBar';

describe('TitleBar', () => {
  it('renders title and subtitle', async () => {
    await render(<TitleBar title="Pokédex" subtitle="Got them all" />);
    expect(screen.getByText('Pokédex')).toBeOnTheScreen();
    expect(screen.getByText('Got them all')).toBeOnTheScreen();
  });
});
