import { useState } from 'react';
import { LatLng, LongPressEvent } from 'react-native-maps';
import { Pokemon } from '@/types/pokemon';
import { useFavPokemon } from '@/hooks/useFavPokemon';

export type MapMarker = {
  coordinate: LatLng;
  pokemon: Pokemon;
};

export function useMapMarkers() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const { favPokemon } = useFavPokemon();
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(null);

  const createMarker = (event: LongPressEvent) => {
    const coordinate = event.nativeEvent.coordinate;

    if (favPokemon) {
      setMarkers(prevMarkers => [...prevMarkers, { coordinate, pokemon: favPokemon }]);
    }
  };

  const removeSelectedMarker = () => {
    if (selectedMarkerIndex !== null) {
      setMarkers(prevMarkers => prevMarkers.filter((_, i) => i !== selectedMarkerIndex));
      setSelectedPokemon(null);
      setSelectedMarkerIndex(null);
    }
  };

  const selectMarker = (index: number, pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setSelectedMarkerIndex(index);
  };

  const deselectMarker = () => {
    setSelectedPokemon(null);
    setSelectedMarkerIndex(null);
  };

  return {
    markers,
    selectedPokemon,
    createMarker,
    selectMarker,
    deselectMarker,
    removeSelectedMarker,
  };
}
