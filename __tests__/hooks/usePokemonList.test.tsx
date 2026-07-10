import { act, renderHook, waitFor } from '@testing-library/react-native';
import { usePokemonList } from '@/hooks/usePokemonList';
import { PokemonProvider } from '@/context/PokemonContext';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

const listResponse = (next: string | null) => ({
  json: async () => ({
    count: 1,
    next,
    results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
  }),
});

describe('usePokemonList', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('fetches the first page on mount', async () => {
    mockFetch.mockResolvedValueOnce(listResponse('https://pokeapi.co/api/v2/pokemon?offset=20&limit=20'));

    const { result } = await renderHook(() => usePokemonList(), {
      wrapper: PokemonProvider,
    });

    await waitFor(() => expect(result.current.pokemons).toHaveLength(1));
    expect(result.current.pokemons[0]).toEqual({
      id: 1,
      name: 'bulbasaur',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      type: [],
      battleStats: { hp: 0, atk: 0, def: 0, spd: 0 },
      isFav: false,
      description: 'No description available.',
      height: 0,
      weight: 0,
    });
    expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=20');
  });

  it('resets the list and re-fetches the first page when refresh is called', async () => {
    mockFetch.mockResolvedValueOnce(listResponse('https://pokeapi.co/api/v2/pokemon?offset=20&limit=20'));

    const { result } = await renderHook(() => usePokemonList(), {
      wrapper: PokemonProvider,
    });
    await waitFor(() => expect(result.current.pokemons).toHaveLength(1));

    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        count: 1,
        next: null,
        results: [{ name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' }],
      }),
    });

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.pokemons).toHaveLength(1);
    expect(result.current.pokemons[0].name).toBe('charmander');
    expect(result.current.pokemons[0].image).toBe('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png');
    expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=20');
  });

  it('updates a pokemon with fetched details', async () => {
    mockFetch.mockResolvedValueOnce(listResponse(null));

    const { result } = await renderHook(() => usePokemonList(), {
      wrapper: PokemonProvider,
    });
    await waitFor(() => expect(result.current.pokemons).toHaveLength(1));

    await act(async () => {
      result.current.updatePokemon(1, {
        type: ['grass', 'poison'],
        battleStats: { hp: 45, atk: 49, def: 49, spd: 45 },
      });
    });

    expect(result.current.pokemons[0].type).toEqual(['grass', 'poison']);
    expect(result.current.pokemons[0].battleStats).toEqual({ hp: 45, atk: 49, def: 49, spd: 45 });
  });

  it('does not fetch again once the last page is reached', async () => {
    mockFetch.mockResolvedValueOnce(listResponse(null));

    const { result } = await renderHook(() => usePokemonList(), {
      wrapper: PokemonProvider,
    });
    await waitFor(() => expect(result.current.pokemons).toHaveLength(1));

    await act(async () => {
      await result.current.fetchMore();
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
