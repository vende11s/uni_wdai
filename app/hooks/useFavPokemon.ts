import { useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePokemonContext } from '@/context/PokemonContext';

export function useFavPokemon() {
    const { favPokemon, setFavPokemon } = usePokemonContext();
    const loadFav = useCallback(async () => {
        try {
            const stored = await AsyncStorage.getItem('fav_pokemon');
            if (stored) {
                setFavPokemon(JSON.parse(stored));
            } else {
                setFavPokemon(null);
            }
        } catch (e) {
            console.error('Failed to load fav pokemon from storage', e);
        }
    }, [setFavPokemon]);

    useEffect(() => {
        loadFav();
    }, [loadFav]);

    return { favPokemon, reload: loadFav, setFavPokemon };
}