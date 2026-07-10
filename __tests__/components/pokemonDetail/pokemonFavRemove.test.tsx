import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PokemonFavRemove } from '@/components/pokemonDetail/pokemonFavRemove';
import type { Pokemon } from '@/types/pokemon';

const mockPokemon: Pokemon = {
  id: 7,
  name: 'squirtle',
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
  type: ['water'],
  battleStats: { hp: 44, atk: 48, def: 65, spd: 43 },
  isFav: true,
};

describe('PokemonFavRemove', () => {
  it('renders the remove button', async () => {
    await render(<PokemonFavRemove currentPokemon={mockPokemon} onUpdate={jest.fn()} />);
    expect(screen.getByText('Remove')).toBeOnTheScreen();
  });

  it('calls onUpdate with toggled isFav when pressed', async () => {
    const onUpdateMock = jest.fn();
    await render(<PokemonFavRemove currentPokemon={mockPokemon} onUpdate={onUpdateMock} />);
    fireEvent.press(screen.getByText('Remove'));
    expect(onUpdateMock).toHaveBeenCalledWith(7, { isFav: false });
  });
});
