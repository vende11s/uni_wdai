import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import type { Pokemon, BattleStats } from '@/types/pokemon';
import { TYPE_COLORS, TYPE_COLORS_DESATURATED } from '@/types/pokemon';
import { TypePill } from '@/components/typePill'


type Props = {
    pokemon: Pokemon;
    onLoaded: (id: number, updates: Partial<Omit<Pokemon, 'id'>>) => void;
    onPress?: () => void;
};

type PokemonApiDetail = {
    types: { type: { name: string } }[];
    stats: { base_stat: number }[];
    height: number;
    weight: number;
};

export function PokemonCard({ pokemon, onLoaded, onPress }: Props) {
    useEffect(() => {
        if (pokemon.type.length > 0) return;

        const abortController = new AbortController();

        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`, { signal: abortController.signal })
            .then(res => res.json())
            .then((data: PokemonApiDetail) => {
                onLoaded(pokemon.id, {
                    type: data.types.map((t) => t.type.name),
                    battleStats: {
                        hp: data.stats[0].base_stat,
                        atk: data.stats[1].base_stat,
                        def: data.stats[2].base_stat,
                        spd: data.stats[5].base_stat,
                    },
                    height: data.height / 10,
                    weight: data.weight / 10,
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
    const primaryType = pokemon.type[0]?.toLowerCase();
    const primaryColor = (primaryType && TYPE_COLORS[primaryType] ? TYPE_COLORS[primaryType] : '#6c757d') + '64';

    return (
        <Pressable onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}>
            <View style={[styles.imageContainer, { backgroundColor: primaryColor }]}>
                <Image source={{ uri: pokemon.image }} style={[styles.image]} />
            </View>

            <View>
                <Text style={styles.num}>#{id_view}</Text>
                <Text style={styles.name}>{pokemon.name}</Text>
                <TypePill pokemon={pokemon} size={11}></TypePill>

            </View>


            {pokemon.isFav === true && (<Text>tego lubsz</Text>)}

            <View style={styles.hpContainer}>
                <Text style={styles.hpTextLabel}>HP</Text>
                <Text style={styles.hpText}>{pokemon.battleStats.hp}</Text>
            </View>
        </Pressable >
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        margin: 6,
        marginLeft: 16,
        marginRight: 16,
        backgroundColor: '#fbfbfbff',
        borderRadius: 18,
        flexDirection: 'row',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.20)',
    },
    cardPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.96 }],
    },
    imageContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 32,
    },
    name: {
        textTransform: 'capitalize',
        fontSize: 16,
        fontFamily: 'Nunito-900',
    },
    typesRow: {
        flexDirection: 'row',
        gap: 4,
        marginTop: 6,
    },
    pill: {
        backgroundColor: '#6c757d',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    pillText: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'Inter-700',
        textTransform: 'uppercase',
        letterSpacing: 1.05,
    },
    hpContainer: {
        marginLeft: 'auto',
    },
    hpText: {
        fontFamily: 'Inter-900',
        fontSize: 18,
    },
    hpTextLabel: {
        fontFamily: 'Inter-700',
        fontSize: 12,
        color: '#666666ff',
        marginLeft: 'auto',
    },
    num: {
        fontSize: 12,
        fontFamily: 'Inter-700',
        color: '#606060ff',
    },
});
