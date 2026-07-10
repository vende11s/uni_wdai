import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PokemonDetailButton } from '@/components/pokemonDetail/pokemonDetailButton';
import type { Pokemon } from '@/types/pokemon';

const mockPokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  type: ['grass'],
  battleStats: { hp: 45, atk: 49, def: 49, spd: 45 },
  isFav: false,
};

describe('PokemonDetailButton', () => {
  it('renders correctly when not a favorite', async () => {
    await render(<PokemonDetailButton currentPokemon={mockPokemon} onUpdate={jest.fn()} />);
    expect(screen.getByText('Add to Favorites')).toBeOnTheScreen();
  });

  it('renders correctly when is a favorite', async () => {
    await render(<PokemonDetailButton currentPokemon={{...mockPokemon, isFav: true}} onUpdate={jest.fn()} />);
    expect(screen.getByText('Remove from Favorites')).toBeOnTheScreen();
  });

  it('calls onUpdate with toggled isFav value when pressed', async () => {
    const onUpdateMock = jest.fn();
    await render(<PokemonDetailButton currentPokemon={mockPokemon} onUpdate={onUpdateMock} />);
    fireEvent.press(screen.getByText('Add to Favorites'));
    expect(onUpdateMock).toHaveBeenCalledWith(1, { isFav: true });
  });

  it('renders remove pin button and calls onRemove when provided', async () => {
    const onRemoveMock = jest.fn();
    await render(<PokemonDetailButton currentPokemon={mockPokemon} onUpdate={jest.fn()} onRemove={onRemoveMock} />);
    const removeBtn = screen.getByText('Remove Pin');
    expect(removeBtn).toBeOnTheScreen();
    fireEvent.press(removeBtn);
    expect(onRemoveMock).toHaveBeenCalled();
  });
});
