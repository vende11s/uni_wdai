import React from 'react';
import { create, act } from 'react-test-renderer';
import { usePokemonList } from '@/hooks/usePokemonList';

global.fetch = jest.fn();

const flushPromises = () => new Promise(setImmediate);

describe('usePokemonList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty pokemon list', async () => {
    let result: any;
    function TestComponent() {
      result = usePokemonList();
      return null;
    }
    await act(async () => {
      create(<TestComponent />);
    });
    
    expect(result.pokemons).toEqual([]);
  });

  it('fetches pokemons on mount', async () => {
    const mockResponse = {
      next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    let result: any;
    function TestComponent() {
      result = usePokemonList();
      return null;
    }

    await act(async () => {
      create(<TestComponent />);
      await flushPromises();
    });

    expect(result.pokemons.length).toBe(1);
    expect(result.pokemons[0]).toEqual({
      id: 1,
      name: 'bulbasaur',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      type: [],
      battleStats: { hp: 0, atk: 0, def: 0, spd: 0 },
    });
  });

  it('updates pokemon details', async () => {
    const mockResponse = {
      next: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    let result: ReturnType<typeof usePokemonList>;
    function TestComponent() {
      result = usePokemonList();
      return null;
    }

    await act(async () => {
      create(<TestComponent />);
      await flushPromises();
    });

    act(() => {
      result.updatePokemon(
        1,
        ['grass', 'poison'],
        { hp: 45, atk: 49, def: 49, spd: 45 }
      );
    });

    expect(result!.pokemons[0].type).toEqual(['grass', 'poison']);
    expect(result!.pokemons[0].battleStats.hp).toBe(45);
  });
});
