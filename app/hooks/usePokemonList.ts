import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Pokemon, BattleStats } from '@/types/pokemon';

type PokemonListItem = {
    name: string;
    url: string;
};
type PokemonListResponse = {
    count: number;
    next: string | null;
    results: PokemonListItem[];
};

export function usePokemonList() {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const nextUrl = useRef<string | null>('https://pokeapi.co/api/v2/pokemon?limit=20');
    const [isLoading, setIsLoading] = useState(false);
    const isFetching = useRef(false);
    const [error, setError] = useState<string | null>(null);


    const fetchMore = useCallback(async () => {
        if (isFetching.current || nextUrl.current === null) return;
        isFetching.current = true;
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(nextUrl.current);
            const data: PokemonListResponse = await response.json();

            nextUrl.current = data.next;

            const newPokemons: Pokemon[] = data.results.map((item) => {
                const id = item.url.split('/').filter(Boolean).pop()!;
                return {
                    id: Number(id),
                    name: item.name,
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                    type: [],
                    battleStats: { hp: 0, atk: 0, def: 0, spd: 0 },
                };
            });
            setPokemons((prev) => [...prev, ...newPokemons]);

        } catch (err) {
            setError('Couldnt fetch pokemon data');
        } finally {
            setIsLoading(false);
            isFetching.current = false;
        }
    }, []);

    const updatePokemon = useCallback((id: number, types: string[], stats: BattleStats) => {
        setPokemons(prev => {
            const index = prev.findIndex(p => p.id === id);
            if (index === -1) return prev;

            const updated = [...prev]
            updated[index] = {
                ...updated[index],
                type: types,
                battleStats: stats
            };
            return updated;
        })
    }, []);

    useEffect(() => { fetchMore(); }, []);
    return { pokemons, fetchMore, updatePokemon };
};


