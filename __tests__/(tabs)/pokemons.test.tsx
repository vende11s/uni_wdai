import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import PokemonsScreen from '@/(tabs)/pokemons';
import { usePokemonList } from '@/hooks/usePokemonList';
import type { Pokemon } from '@/types/pokemon';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@/hooks/usePokemonList');

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, FlatList } = require('react-native');
  const AnimatedFlatList = React.forwardRef((props: any, ref: any) => <FlatList ref={ref} {...props} />);
  return {
    __esModule: true,
    default: {
      View: React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />),
      FlatList: AnimatedFlatList,
    },
    useSharedValue: (initial: any) => ({ value: initial }),
    useAnimatedStyle: (fn: any) => fn(),
    withSpring: (val: any) => val,
    withTiming: (val: any) => val,
    useAnimatedScrollHandler: () => () => {},
    runOnJS: (fn: any) => fn,
    interpolate: (val: any) => val,
    Extrapolation: { CLAMP: 'clamp' },
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    GestureDetector: ({ children }: any) => <View>{children}</View>,
    Gesture: {
      Pan: () => ({
        onChange: () => ({ onEnd: () => ({}) }),
      }),
      Native: () => ({}),
      Simultaneous: () => ({}),
    },
  };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(true),
  NotificationFeedbackType: {},
  ImpactFeedbackStyle: { Medium: 'medium' },
}));

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
const mockRefresh = jest.fn();

const makePokemon = (id: number, name: string): Pokemon => ({
  id,
  name,
  image: '',
  type: [],
  battleStats: { hp: 0, atk: 0, def: 0, spd: 0 },
});

describe('PokemonsScreen', () => {
  beforeEach(() => {
    mockRefresh.mockReset();
    mockUsePokemonList.mockReturnValue({
      pokemons: [makePokemon(1, 'bulbasaur'), makePokemon(2, 'ivysaur')],
      fetchMore: jest.fn(),
      updatePokemon: jest.fn(),
      refresh: mockRefresh,
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

  it('renders the pull-to-refresh pill and triggers refresh when pressed', async () => {
    await render(<PokemonsScreen />);

    // Check if the pill is present
    const pill = screen.getByTestId('pull-to-refresh-pill');
    expect(pill).toBeOnTheScreen();
    expect(screen.getByText(/Pull to refresh/i)).toBeOnTheScreen();

    // Tap on the pill
    fireEvent.press(pill);

    // Verify it triggers refresh
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});

