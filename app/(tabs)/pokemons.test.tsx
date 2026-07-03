import React from 'react';
import { create, act } from 'react-test-renderer';
import { Text } from 'react-native';
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

const hasText = (root: any, text: string) => {
  return root.findAll((node: any) => {
    if (node.type === 'Text' || node.type === Text) {
      return String(node.props.children) === text;
    }
    return false;
  }).length > 0;
};

const hasTestId = (root: any, id: string) => {
  return root.findAll((node: any) => node.props.testID === id).length > 0;
};

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

    let root: any;
    act(() => {
      root = create(<PokemonsScreen />);
    });

    expect(hasTestId(root.root, 'pokemon-card-1')).toBeTruthy();
    expect(hasText(root.root, 'bulbasaur')).toBeTruthy();
    expect(hasTestId(root.root, 'pokemon-card-2')).toBeTruthy();
    expect(hasText(root.root, 'ivysaur')).toBeTruthy();
  });
});
