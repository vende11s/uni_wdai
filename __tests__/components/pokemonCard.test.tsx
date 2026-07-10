import { render, screen, waitFor } from '@testing-library/react-native';
import { PokemonCard } from '@/components/pokemonCard';
import type { Pokemon } from '@/types/pokemon';

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

const mockPokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  type: [],
  battleStats: { hp: 0, atk: 0, def: 0, spd: 0 },
};

describe('PokemonCard', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('renders the pokemon name and zero-padded id', async () => {
    mockFetch.mockResolvedValue({
      json: async () => ({ types: [], stats: Array(6).fill({ base_stat: 0 }) }),
    });

    await render(<PokemonCard pokemon={mockPokemon} onLoaded={jest.fn()} />);

    expect(screen.getByText('bulbasaur')).toBeOnTheScreen();
    expect(screen.getByText('#001')).toBeOnTheScreen();
  });

  it('fetches details and reports them via onLoaded when types are empty', async () => {
    const onLoaded = jest.fn();
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
        stats: [
          { base_stat: 45 }, // hp
          { base_stat: 49 }, // atk
          { base_stat: 49 }, // def
          { base_stat: 65 }, // sp.atk
          { base_stat: 65 }, // sp.def
          { base_stat: 45 }, // spd
        ],
        height: 7,
        weight: 69,
      }),
    });

    await render(<PokemonCard pokemon={mockPokemon} onLoaded={onLoaded} />);

    await waitFor(() =>
      expect(onLoaded).toHaveBeenCalledWith(1, {
        type: ['grass', 'poison'],
        battleStats: {
          hp: 45,
          atk: 49,
          def: 49,
          spd: 45,
        },
        height: 0.7,
        weight: 6.9,
      }),
    );
    expect(mockFetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/1',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('displays types and HP without fetching when already loaded', async () => {
    const loadedPokemon: Pokemon = {
      ...mockPokemon,
      type: ['grass', 'poison'],
      battleStats: { hp: 45, atk: 49, def: 49, spd: 45 },
    };

    await render(<PokemonCard pokemon={loadedPokemon} onLoaded={jest.fn()} />);

    expect(screen.getByText('grass')).toBeOnTheScreen();
    expect(screen.getByText('poison')).toBeOnTheScreen();
    expect(screen.getByText('45')).toBeOnTheScreen();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('wywoluje onPress po kliknieciu na karte pokemona', async () => {
    const onPress = jest.fn();
    const loadedPokemon: Pokemon = {
      ...mockPokemon,
      type: ['grass'],
      battleStats: { hp: 45, atk: 49, def: 49, spd: 45 },
    };

    await render(
      <PokemonCard pokemon={loadedPokemon} onLoaded={jest.fn()} onPress={onPress} />
    );

    const nameText = screen.getByText('bulbasaur');
    const fireEvent = require('@testing-library/react-native').fireEvent;
    fireEvent.press(nameText);

    expect(onPress).toHaveBeenCalled();
  });
});

