import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { PokemonDetailStats } from '@/components/pokemonDetail/pokemonDetailStats';
import type { Pokemon } from '@/types/pokemon';

const mockPokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  type: ['electric'],
  battleStats: { hp: 35, atk: 55, def: 40, spd: 90 },
};

describe('PokemonDetailStats', () => {
  it('renders stats correctly', async () => {
    await render(<PokemonDetailStats currentPokemon={mockPokemon} />);
    expect(screen.getByText('BASE STATS')).toBeOnTheScreen();
    
    expect(screen.getByText('HP')).toBeOnTheScreen();
    expect(screen.getByText('35')).toBeOnTheScreen();

    expect(screen.getByText('ATK')).toBeOnTheScreen();
    expect(screen.getByText('55')).toBeOnTheScreen();

    expect(screen.getByText('DEF')).toBeOnTheScreen();
    expect(screen.getByText('40')).toBeOnTheScreen();

    expect(screen.getByText('SPD')).toBeOnTheScreen();
    expect(screen.getByText('90')).toBeOnTheScreen();
  });
});
