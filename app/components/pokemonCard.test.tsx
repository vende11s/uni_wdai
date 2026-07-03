import React from 'react';
import { create, act } from 'react-test-renderer';
import { Text } from 'react-native';
import { PokemonCard } from '@/components/pokemonCard';
import type { Pokemon } from '@/types/pokemon';

global.fetch = jest.fn();

const flushPromises = () => new Promise(setImmediate);

const mockPokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  type: [],
  battleStats: { hp: 0, atk: 0, def: 0, spd: 0 },
};

const hasText = (root: any, text: string | number) => {
  return root.findAll((node: any) => {
    if (node.type === 'Text' || node.type === Text) {
      const children = node.props.children;
      if (Array.isArray(children)) return children.join('') === String(text);
      return String(children) === String(text);
    }
    return false;
  }).length > 0;
};

describe('PokemonCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        types: [],
        stats: [
          { base_stat: 0 },
          { base_stat: 0 },
          { base_stat: 0 },
          { base_stat: 0 },
          { base_stat: 0 },
          { base_stat: 0 },
        ],
      }),
    });
  });

  it('renders basic pokemon info', () => {
    let root: any;
    act(() => {
      root = create(<PokemonCard pokemon={mockPokemon} onLoaded={jest.fn()} />);
    });

    expect(hasText(root.root, 'bulbasaur')).toBeTruthy();
    expect(hasText(root.root, '#001')).toBeTruthy();
  });

  it('fetches and calls onLoaded when types are empty', async () => {
    const mockOnLoaded = jest.fn();
    const mockDetailResponse = {
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      stats: [
        { base_stat: 45 }, // hp
        { base_stat: 49 }, // atk
        { base_stat: 49 }, // def
        { base_stat: 65 }, // sp.atk
        { base_stat: 65 }, // sp.def
        { base_stat: 45 }, // spd
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockDetailResponse),
    });

    await act(async () => {
      create(<PokemonCard pokemon={mockPokemon} onLoaded={mockOnLoaded} />);
      await flushPromises();
    });

    expect(mockOnLoaded).toHaveBeenCalledWith(
      1,
      ['grass', 'poison'],
      { hp: 45, atk: 49, def: 49, spd: 45 }
    );
  });

  it('displays types and stats if already loaded', () => {
    const loadedPokemon: Pokemon = {
      ...mockPokemon,
      type: ['grass', 'poison'],
      battleStats: { hp: 45, atk: 49, def: 49, spd: 45 },
    };

    let root: any;
    act(() => {
      root = create(<PokemonCard pokemon={loadedPokemon} onLoaded={jest.fn()} />);
    });

    expect(hasText(root.root, 'grass')).toBeTruthy();
    expect(hasText(root.root, 'poison')).toBeTruthy();
    expect(hasText(root.root, '45')).toBeTruthy(); // HP
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
