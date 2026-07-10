// app/hooks/usePokemonList.ts
import { usePokemonContext } from '@/context/PokemonContext';

export function usePokemonList() {
    const { pokemons, isLoading, error, fetchMore, updatePokemon, refresh } = usePokemonContext();

    return {
        pokemons,
        isLoading,
        error,
        fetchMore,
        updatePokemon,
        refresh
    };
}
