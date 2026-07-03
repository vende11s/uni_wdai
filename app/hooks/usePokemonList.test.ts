import { renderHook, act } from '@testing-library/react-native';
import { usePokemonList } from '@/hooks/usePokemonList';

global.fetch = jest.fn();

describe('usePokemonList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty pokemon list', () => {
    const { result } = renderHook(() => usePokemonList());
    expect(result.current.pokemons).toEqual([]);
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

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      // wait for fetch to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.pokemons.length).toBe(1);
    expect(result.current.pokemons[0]).toEqual({
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

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.updatePokemon(
        1,
        ['grass', 'poison'],
        { hp: 45, atk: 49, def: 49, spd: 45 }
      );
    });

    expect(result.current.pokemons[0].type).toEqual(['grass', 'poison']);
    expect(result.current.pokemons[0].battleStats.hp).toBe(45);
  });
});
