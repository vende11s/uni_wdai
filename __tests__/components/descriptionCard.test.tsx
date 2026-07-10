import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { DescriptionCard } from '@/components/descriptionCard';
import type { Pokemon } from '@/types/pokemon';

const mockPokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  type: ['grass', 'poison'],
  battleStats: { hp: 45, atk: 49, def: 49, spd: 45 },
  description: 'A strange seed was planted on its back at birth.',
};

describe('DescriptionCard', () => {
  it('renders pokemon name and description correctly', async () => {
    await render(<DescriptionCard pokemon={mockPokemon} />);
    expect(screen.getByText('bulbasaur')).toBeOnTheScreen();
    expect(screen.getByText('A strange seed was planted on its back at birth.')).toBeOnTheScreen();
  });

  it('renders type pill with types', async () => {
    await render(<DescriptionCard pokemon={mockPokemon} />);
    expect(screen.getByText('grass')).toBeOnTheScreen();
    expect(screen.getByText('poison')).toBeOnTheScreen();
  });
});
