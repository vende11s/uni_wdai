import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import type { Pokemon, BattleStats } from '@/types/pokemon';

type Props = {
    pokemon: Pokemon;
    onLoaded: (id: number, types: string[], stats: BattleStats) => void;
    onPress?: () => void;
};

type PokemonApiDetail = {
    types: { type: { name: string } }[];
    stats: { base_stat: number }[];
};

export function PokemonCard({ pokemon, onLoaded, onPress }: Props) {
    useEffect(() => {
        if (pokemon.type.length > 0) return;

        const abortController = new AbortController();

        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`, { signal: abortController.signal })
            .then(res => res.json())
            .then((data: PokemonApiDetail) => {
                onLoaded(
                    pokemon.id,
                    data.types.map((t) => t.type.name),
                    {
                        hp: data.stats[0].base_stat,
                        atk: data.stats[1].base_stat,
                        def: data.stats[2].base_stat,
                        spd: data.stats[5].base_stat,
                    }
                )
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;
                console.error(err);
            });

        return () => abortController.abort();
    }, [pokemon.id, pokemon.type.length, onLoaded]);

    const id_view = String(pokemon.id).padStart(3, '0');

    return (
        <Pressable style={styles.card} onPress={onPress}>
            <Image source={{ uri: pokemon.image }} style={styles.image} />
            <View>
                <Text>#{id_view}</Text>
                <Text style={styles.name}>{pokemon.name}</Text>

                <View style={styles.typesRow}>
                    {pokemon.type.map((type) => (
                        <View key={type} style={styles.pill}>
                            <Text style={styles.pillText}>{type}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.hpContainer}>
                <Text>HP</Text>
                <Text style={styles.hpText}>{pokemon.battleStats.hp}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        margin: 6,
        backgroundColor: '#fbfbfbff',
        borderRadius: 32,
        flexDirection: 'row',
    },
    image: {
        width: 96,
        height: 96,
    },
    name: {
        marginTop: 4,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    typesRow: {
        flexDirection: 'row',
        gap: 4,
        marginTop: 6,
    },
    pill: {
        backgroundColor: '#6c757d',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    pillText: {
        color: 'white',
        fontSize: 15,
        textTransform: 'capitalize',
    },
    hpContainer: {
        marginLeft: 'auto',
    },
    hpText: {
        fontWeight: 'bold',
        fontSize: 20,
    }
});
