import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TypePill } from '@/components/typePill';
import type { Pokemon } from '@/types/pokemon';

const mockPokemon: Pokemon = {
  id: 4,
  name: 'charmander',
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
  type: ['fire'],
  battleStats: { hp: 39, atk: 52, def: 43, spd: 65 },
};

describe('TypePill', () => {
  it('renders the type pills for pokemon', async () => {
    await render(<TypePill pokemon={mockPokemon} size={14} />);
    expect(screen.getByText('fire')).toBeOnTheScreen();
  });

  it('applies default background color if type color is unknown', async () => {
    const unknownTypePokemon: Pokemon = {
        ...mockPokemon,
        type: ['unknown_type_abc'],
    };
    await render(<TypePill pokemon={unknownTypePokemon} size={14} />);
    expect(screen.getByText('unknown_type_abc')).toBeOnTheScreen();
  });
});
