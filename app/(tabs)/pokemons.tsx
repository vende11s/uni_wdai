import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { usePokemonList } from '@/hooks/usePokemonList';
import { PokemonCard } from '@/components/pokemonCard';
import { PokemonDetailSheet } from '@/components/pokemonDetailSheet';
import type { Pokemon } from '@/types/pokemon';

export default function PokemonsScreen() {
  const { pokemons, fetchMore, updatePokemon } = usePokemonList();
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  return (
    <>
      <FlatList
        data={pokemons}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onLoaded={updatePokemon}
            onPress={() => setSelectedPokemon(item)}
          />
        )}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.5}
      />
      <PokemonDetailSheet
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    </>
  );
}

