import { render, screen } from '@testing-library/react-native';
import PokemonsScreen from '@/(tabs)/pokemons';
import { usePokemonList } from '@/hooks/usePokemonList';
import type { Pokemon } from '@/types/pokemon';

jest.mock('@/hooks/usePokemonList');

jest.mock('@/components/pokemonCard', () => {
  const { View, Text } = require('react-native');
  return {
    PokemonCard: ({ pokemon }: { pokemon: Pokemon }) => (
      <View testID={`pokemon-card-${pokemon.id}`}>
        <Text>{pokemon.name}</Text>
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
  it('renders a card for each pokemon from the hook', async () => {
    mockUsePokemonList.mockReturnValue({
      pokemons: [makePokemon(1, 'bulbasaur'), makePokemon(2, 'ivysaur')],
      fetchMore: jest.fn(),
      updatePokemon: jest.fn(),
    });

    await render(<PokemonsScreen />);

    expect(screen.getByTestId('pokemon-card-1')).toBeOnTheScreen();
    expect(screen.getByText('bulbasaur')).toBeOnTheScreen();
    expect(screen.getByTestId('pokemon-card-2')).toBeOnTheScreen();
    expect(screen.getByText('ivysaur')).toBeOnTheScreen();
  });
});
