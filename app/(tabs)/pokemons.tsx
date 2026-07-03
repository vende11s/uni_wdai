import React from 'react';
import { FlatList } from 'react-native';
import { usePokemonList } from '@/hooks/usePokemonList';
import { PokemonCard } from '@/components/pokemonCard';

export default function PokemonsScreen() {
  const { pokemons, fetchMore, updatePokemon } = usePokemonList();

  return (
    <FlatList
      data={pokemons}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <PokemonCard
        pokemon={item}
        onLoaded={updatePokemon}
      />}
      onEndReached={fetchMore}
      onEndReachedThreshold={0.5}
    />
  );
}
