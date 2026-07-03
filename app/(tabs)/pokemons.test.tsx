import React from 'react';
import { render, screen } from '@testing-library/react-native';
import PokemonsScreen from './pokemons';
import { usePokemonList } from '@/hooks/usePokemonList';

// Mock the custom hook
jest.mock('@/hooks/usePokemonList');

// Mock the child component to simplify testing
jest.mock('@/components/pokemonCard', () => {
  const { View, Text } = require('react-native');
  return {
    PokemonCard: function MockPokemonCard({ pokemon }: any) {
      return (
        <View testID={`pokemon-card-${pokemon.id}`}>
          <Text>{pokemon.name}</Text>
        </View>
      );
    }
  };
});

describe('PokemonsScreen', () => {
  it('renders a list of pokemons', () => {
    const mockPokemons = [
      { id: 1, name: 'bulbasaur', image: '', type: [], battleStats: { hp: 0, atk: 0, def: 0, spd: 0 } },
      { id: 2, name: 'ivysaur', image: '', type: [], battleStats: { hp: 0, atk: 0, def: 0, spd: 0 } },
    ];

    (usePokemonList as jest.Mock).mockReturnValue({
      pokemons: mockPokemons,
      fetchMore: jest.fn(),
      updatePokemon: jest.fn(),
    });

    render(<PokemonsScreen />);

    expect(screen.getByTestId('pokemon-card-1')).toBeTruthy();
    expect(screen.getByText('bulbasaur')).toBeTruthy();
    expect(screen.getByTestId('pokemon-card-2')).toBeTruthy();
    expect(screen.getByText('ivysaur')).toBeTruthy();
  });
});
