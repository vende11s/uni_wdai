import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { PokemonCard } from '@/components/pokemonCard';
import type { Pokemon } from '@/types/pokemon';

global.fetch = jest.fn();

const mockPokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  type: [],
  battleStats: { hp: 0, atk: 0, def: 0, spd: 0 },
};

describe('PokemonCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders basic pokemon info', () => {
    render(<PokemonCard pokemon={mockPokemon} onLoaded={jest.fn()} />);

    expect(screen.getByText('bulbasaur')).toBeTruthy();
    expect(screen.getByText('#001')).toBeTruthy();
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

    render(<PokemonCard pokemon={mockPokemon} onLoaded={mockOnLoaded} />);

    await waitFor(() => {
      expect(mockOnLoaded).toHaveBeenCalledWith(
        1,
        ['grass', 'poison'],
        { hp: 45, atk: 49, def: 49, spd: 45 }
      );
    });
  });

  it('displays types and stats if already loaded', () => {
    const loadedPokemon: Pokemon = {
      ...mockPokemon,
      type: ['grass', 'poison'],
      battleStats: { hp: 45, atk: 49, def: 49, spd: 45 },
    };

    render(<PokemonCard pokemon={loadedPokemon} onLoaded={jest.fn()} />);

    expect(screen.getByText('grass')).toBeTruthy();
    expect(screen.getByText('poison')).toBeTruthy();
    expect(screen.getByText('45')).toBeTruthy(); // HP
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
