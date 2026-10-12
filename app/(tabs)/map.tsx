import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useMapMarkers } from '@/hooks/useMapMarkers';
import { PokemonDetailSheet } from '@/components/pokemonDetailSheet';

export default function MapScreen() {
  const {
    markers,
    selectedPokemon,
    createMarker,
    selectMarker,
    deselectMarker,
    removeSelectedMarker,
  } = useMapMarkers();

  return (
    <View style={styles.container}>
      <MapView style={styles.map} onLongPress={createMarker}>
        {markers.map((marker, index) => (
          <Marker 
            key={index} 
            coordinate={marker.coordinate}
            onPress={() => selectMarker(index, marker.pokemon)}
          />
        ))}
      </MapView>
      <PokemonDetailSheet
        pokemon={selectedPokemon}
        onClose={deselectMarker}
        onUpdate={() => null}
        onRemove={removeSelectedMarker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
