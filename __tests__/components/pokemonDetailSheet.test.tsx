import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { PokemonDetailSheet } from '@/components/pokemonDetailSheet';

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: {
      View: React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />),
    },
    useSharedValue: (initial: any) => ({ value: initial }),
    useAnimatedStyle: (fn: any) => fn(),
    withSpring: (val: any) => val,
    withTiming: (val: any) => val,
  };
});
import type { Pokemon } from '@/types/pokemon';

// Mock SafeAreaContext
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 20, left: 0, right: 0 }),
}));

// Mock custom animation hook
const mockCloseSheet = jest.fn();
jest.mock('@/hooks/useBottomSheetAnimation', () => {
  return {
    useBottomSheetAnimation: () => {
      return {
        animatedBackdropStyle: {},
        animatedSheetStyle: {},
        panHandlers: {},
        closeSheet: mockCloseSheet,
      };
    },
  };
});

const mockPokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  type: ['electric'],
  battleStats: {
    hp: 35,
    atk: 55,
    def: 40,
    spd: 90,
  },
};

describe('PokemonDetailSheet', () => {
  beforeEach(() => {
    mockCloseSheet.mockReset();
  });

  it('renders nothing when pokemon is null', async () => {
    const { toJSON } = await render(<PokemonDetailSheet pokemon={null} onClose={jest.fn()} />);
    expect(toJSON()).toBeNull();
  });

  it('renders pokemon details and battle stats', async () => {
    await render(<PokemonDetailSheet pokemon={mockPokemon} onClose={jest.fn()} />);

    // Check name and id
    expect(screen.getByText('pikachu')).toBeOnTheScreen();
    expect(screen.getByText('#025')).toBeOnTheScreen();

    // Check type badge
    expect(screen.getByText('electric')).toBeOnTheScreen();

    // Check section header
    expect(screen.getByText('BASE STATS')).toBeOnTheScreen();

    // Check stats label and value
    expect(screen.getByText('HP')).toBeOnTheScreen();
    expect(screen.getByText('35')).toBeOnTheScreen();

    expect(screen.getByText('ATK')).toBeOnTheScreen();
    expect(screen.getByText('55')).toBeOnTheScreen();

    expect(screen.getByText('DEF')).toBeOnTheScreen();
    expect(screen.getByText('40')).toBeOnTheScreen();

    expect(screen.getByText('SPD')).toBeOnTheScreen();
    expect(screen.getByText('90')).toBeOnTheScreen();
  });
});
