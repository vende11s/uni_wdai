import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useFavPokemon } from '@/hooks/useFavPokemon';
import { PokemonDetailCard } from '@/components/pokemonDetail/pokemonDetailCard';
import { PokemonFavRemove } from '@/components/pokemonDetail/pokemonFavRemove';
import { PokemonDetailStats } from '@/components/pokemonDetail/pokemonDetailStats';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePokemonContext } from '@/context/PokemonContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TitleBar } from '@/components/titleBar';
import { DescriptionCard } from '@/components/descriptionCard'


export default function FavouritesScreen() {
  const { favPokemon, reload } = useFavPokemon();
  const { updatePokemon } = usePokemonContext();

  useFocusEffect(
    React.useCallback(() => {
      reload();
    }, [reload])
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.headerRow}>
        <TitleBar title={"Favorites"} subtitle={"my collection"}></TitleBar>
        {favPokemon && (
          <PokemonFavRemove currentPokemon={favPokemon} onUpdate={updatePokemon}></PokemonFavRemove>
        )}
      </View>
      {favPokemon ? (
        <>
          <View style={{ marginHorizontal: 16 }}>
            <PokemonDetailCard
              pokemon={favPokemon}
              onUpdate={updatePokemon}
            />
          </View>
          <View style={styles.elementContainer}>
            <DescriptionCard pokemon={favPokemon} />
          </View>

          <View style={styles.elementContainer}>
            <PokemonDetailStats currentPokemon={favPokemon} />
          </View>

        </>

      ) : (
        <Text style={styles.emptyText}>chuja a nie ulubionego masz</Text>
      )
      }
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',

  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  },
  elementContainer: {
    backgroundColor: '#fff',
    marginTop: 15,
    borderRadius: 20,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.20)',
    marginHorizontal: 16,
  }
});
