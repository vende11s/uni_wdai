import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import PokemonsScreen from '@/(tabs)/pokemons';
import { usePokemonList } from '@/hooks/usePokemonList';
import type { Pokemon } from '@/types/pokemon';

jest.mock('@/hooks/usePokemonList');

jest.mock('@/components/pokemonCard', () => {
  const { Pressable, Text } = require('react-native');
  return {
    PokemonCard: ({ pokemon, onPress }: { pokemon: Pokemon; onPress?: () => void }) => (
      <Pressable testID={`pokemon-card-${pokemon.id}`} onPress={onPress}>
        <Text>{pokemon.name}</Text>
      </Pressable>
    ),
  };
});

jest.mock('@/components/pokemonDetailSheet', () => {
  const { View, Text } = require('react-native');
  return {
    PokemonDetailSheet: ({ pokemon }: { pokemon: Pokemon | null }) => (
      <View testID="pokemon-detail-sheet">
        <Text>{pokemon ? `Active: ${pokemon.name}` : 'No Pokemon Selected'}</Text>
      </View>
    ),
  };
});

const mockUsePokemonList = usePokemonList as jest.MockedFunction<typeof usePokemonList>;

const makePokemon = (id: number, name: string): Pokemon => ({
  id,
  name,
  image: '',
  type: [],
  battleStats: { hp: 0, atk: 0, def: 0, spd: 0 },
});

describe('PokemonsScreen', () => {
  beforeEach(() => {
    mockUsePokemonList.mockReturnValue({
      pokemons: [makePokemon(1, 'bulbasaur'), makePokemon(2, 'ivysaur')],
      fetchMore: jest.fn(),
      updatePokemon: jest.fn(),
    });
  });

  it('renders a card for each pokemon from the hook', async () => {
    await render(<PokemonsScreen />);

    expect(screen.getByTestId('pokemon-card-1')).toBeOnTheScreen();
    expect(screen.getByText('bulbasaur')).toBeOnTheScreen();
    expect(screen.getByTestId('pokemon-card-2')).toBeOnTheScreen();
    expect(screen.getByText('ivysaur')).toBeOnTheScreen();
  });

  it('renders the bottom sheet and opens it with the clicked pokemon details', async () => {
    await render(<PokemonsScreen />);

    // Initially sheet should say "No Pokemon Selected"
    expect(screen.getByText('No Pokemon Selected')).toBeOnTheScreen();

    // Click on bulbasaur card
    fireEvent.press(screen.getByTestId('pokemon-card-1'));

    // Detail sheet should now display "Active: bulbasaur"
    await waitFor(() => {
      expect(screen.getByText('Active: bulbasaur')).toBeOnTheScreen();
    });
  });
});

