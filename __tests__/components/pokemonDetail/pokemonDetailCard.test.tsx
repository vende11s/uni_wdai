import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { PokemonDetailCard } from '@/components/pokemonDetail/pokemonDetailCard';
import type { Pokemon } from '@/types/pokemon';

const mockPokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  type: ['electric'],
  battleStats: { hp: 35, atk: 55, def: 40, spd: 90 },
  weight: 60,
  height: 4,
};

describe('PokemonDetailCard', () => {
  it('renders nothing when pokemon is null', async () => {
    const { toJSON } = await render(<PokemonDetailCard pokemon={null} onUpdate={jest.fn()} />);
    expect(toJSON()).toBeNull();
  });

  it('renders pokemon information correctly', async () => {
    await render(<PokemonDetailCard pokemon={mockPokemon} onUpdate={jest.fn()} />);
    expect(screen.getByText('pikachu')).toBeOnTheScreen();
    expect(screen.getByText('#025')).toBeOnTheScreen();
    expect(screen.getByText('electric')).toBeOnTheScreen();
    expect(screen.getByText('60kg')).toBeOnTheScreen();
    expect(screen.getByText('4m')).toBeOnTheScreen();
  });
});
