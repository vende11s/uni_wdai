// app/context/PokemonContext.tsx
import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Pokemon } from '@/types/pokemon';

type PokemonListItem = {
    name: string;
    url: string;
};
type PokemonListResponse = {
    count: number;
    next: string | null;
    results: PokemonListItem[];
};

type PokemonContextType = {
    pokemons: Pokemon[];
    favPokemon: Pokemon | null;
    isLoading: boolean;
    error: string | null;
    fetchMore: () => Promise<void>;
    setFavPokemon: React.Dispatch<React.SetStateAction<Pokemon | null>>;
    updatePokemon: (id: number, updates: Partial<Omit<Pokemon, 'id'>>) => Promise<void>;
    refresh: () => Promise<void>;
};

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider = ({ children }: { children: React.ReactNode }) => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [favPokemon, setFavPokemon] = useState<Pokemon | null>(null);

    const nextUrl = useRef<string | null>('https://pokeapi.co/api/v2/pokemon?limit=20');
    const isFetching = useRef(false);

    const fetchMore = useCallback(async () => {
        if (isFetching.current || nextUrl.current === null) return;
        isFetching.current = true;
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(nextUrl.current);
            const data: PokemonListResponse = await response.json();

            nextUrl.current = data.next;

            const newPokemons: Pokemon[] = await Promise.all(
                data.results.map(async (item) => {
                    const id = item.url.split('/').filter(Boolean).pop()!;

                    let description = 'No description available.';
                    try {
                        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
                        if (speciesRes.ok) {
                            const speciesData = await speciesRes.json();
                            const enEntry = speciesData.flavor_text_entries.find((entry: any) => entry.language.name === 'en');
                            if (enEntry) {
                                description = enEntry.flavor_text.replace(/[\n\f]/g, ' ');
                            }
                        }
                    } catch (err) {
                        console.warn(`Could not fetch species for id ${id}`);
                    }

                    return {
                        id: Number(id),
                        name: item.name,
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
                        type: [],
                        battleStats: { hp: 0, atk: 0, def: 0, spd: 0 },
                        isFav: false,
                        description,
                        height: 0,
                        weight: 0,
                    };
                })
            );

            setPokemons((prev) => [...prev, ...newPokemons]);
        } catch (err) {
            setError('Couldnt fetch pokemon data');
        } finally {
            setIsLoading(false);
            isFetching.current = false;
        }
    }, []);

    const refresh = useCallback(async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        setIsLoading(true);
        setError(null);
        nextUrl.current = 'https://pokeapi.co/api/v2/pokemon?limit=20';

        try {
            const response = await fetch(nextUrl.current);
            const data: PokemonListResponse = await response.json();

            nextUrl.current = data.next;

            const newPokemons: Pokemon[] = await Promise.all(
                data.results.map(async (item) => {
                    const id = item.url.split('/').filter(Boolean).pop()!;

                    let description = 'No description available.';
                    try {
                        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
                        if (speciesRes.ok) {
                            const speciesData = await speciesRes.json();
                            const enEntry = speciesData.flavor_text_entries.find((entry: any) => entry.language.name === 'en');
                            if (enEntry) {
                                description = enEntry.flavor_text.replace(/[\n\f]/g, ' ');
                            }
                        }
                    } catch (err) {
                        console.warn(`Could not fetch species for id ${id}`);
                    }

                    return {
                        id: Number(id),
                        name: item.name,
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
                        type: [],
                        battleStats: { hp: 0, atk: 0, def: 0, spd: 0 },
                        isFav: false,
                        description,
                        height: 0,
                        weight: 0,
                    };
                })
            );

            setPokemons(newPokemons);
        } catch (err) {
            setError('Couldnt fetch pokemon data');
        } finally {
            setIsLoading(false);
            isFetching.current = false;
        }
    }, []);

    const updatePokemon = useCallback(async (id: number, updates: Partial<Omit<Pokemon, 'id'>>) => {
        const currentPokemon = pokemons.find(p => p.id === id);
        const willBeFav = updates.isFav;

        setPokemons(prev => {
            let updated = [...prev];

            // If we are setting a new favorite, un-favorite the previous one in the list
            if (updates.isFav === true) {
                updated = updated.map(p => p.isFav ? { ...p, isFav: false } : p);
            }

            const index = updated.findIndex(p => p.id === id);
            if (index !== -1) {
                const current = updated[index];

                if (!current.isFav && updates.isFav === true) {
                    try {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => { });
                    } catch (e) {
                        console.warn('Haptics are not available in this build.', e);
                    }
                }

                updated[index] = { ...updated[index], ...updates };
            }
            return updated;
        });

        if (currentPokemon && willBeFav !== undefined) {
            try {
                if (willBeFav === true) {
                    const updatedFav = { ...currentPokemon, ...updates };
                    await AsyncStorage.setItem('fav_pokemon', JSON.stringify(updatedFav));
                    setFavPokemon(updatedFav);
                } else {
                    await AsyncStorage.removeItem('fav_pokemon');
                    setFavPokemon(null);
                }
            } catch (e) {
                console.error('Failed to update local storage', e);
            }
        }
    }, [pokemons]);

    // Pobierz pierwszą paczkę przy montowaniu providera
    useEffect(() => {
        fetchMore();
    }, [fetchMore]);

    return (
        <PokemonContext.Provider value={{
            pokemons, favPokemon, setFavPokemon,
            isLoading, error, fetchMore, updatePokemon, refresh
        }
        }>
            {children}
        </PokemonContext.Provider>
    );
};

export const usePokemonContext = () => {
    const context = useContext(PokemonContext);
    if (!context) {
        throw new Error('usePokemonContext must be used within PokemonProvider');
    }
    return context;
};
