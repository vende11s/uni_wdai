import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, Pressable, Animated, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Pokemon } from '@/types/pokemon';
import { useBottomSheetAnimation } from '@/hooks/useBottomSheetAnimation';
import { TYPE_COLORS, } from '@/types/pokemon';
import { LinearGradient } from 'expo-linear-gradient';
import { TypePill } from '@/components/typePill'



type Props = {
    pokemon: Pokemon | null;
    onUpdate: (id: number, updates: Partial<Omit<Pokemon, 'id'>>) => void;
    style?: StyleProp<ViewStyle>;
};

export function PokemonDetailCard({ pokemon, onUpdate, style }: Props) {
    const currentPokemon = pokemon
    if (!currentPokemon) return null;

    const primaryType = currentPokemon.type[0]?.toLowerCase() || 'normal';
    const primaryColor = (TYPE_COLORS[primaryType] || '#a2a2a2') + '64';
    const primaryColorGradientStart = (TYPE_COLORS[primaryType] || '#a2a2a2') + '32';

    return (
        <View style={style}>
            {/* Header Card */}
            <LinearGradient
                colors={[primaryColorGradientStart, primaryColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.header]}
            >

                <Image source={{ uri: currentPokemon.image }} style={styles.image} />
                <View style={styles.headerTextContainer}>
                    <Text style={styles.pokemonId}>#{String(currentPokemon.id).padStart(3, '0')}</Text>
                    <Text style={styles.pokemonName}>{currentPokemon.name}</Text>
                    <TypePill pokemon={currentPokemon} size={12}></TypePill>
                    <View style={[styles.typesRow, { marginTop: 10, }]}>
                        <View style={{ marginRight: 4 }}>
                            <Text style={styles.ghtLabel}>WEIGHT</Text>
                            <Text style={styles.ghtValue}>{currentPokemon.weight}kg</Text>
                        </View>
                        <View>
                            <Text style={styles.ghtLabel}>HEIGHT</Text>
                            <Text style={styles.ghtValue}>{currentPokemon.height}m</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}



const styles = StyleSheet.create({
    ghtLabel: {
        fontFamily: 'Inter-700',
        fontSize: 11,
        color: '#4b4b4bff',
    },
    ghtValue: {
        fontFamily: 'Inter-900',
        fontSize: 14,
        color: '#000000ff',
    },
    header: {
        flexDirection: 'row',
        padding: 18,
        paddingTop: 18,
        alignItems: 'center',
        borderRadius: 24,
    },
    image: {
        width: 128,
        height: 128,
        marginRight: 16,
    },
    headerTextContainer: {
        flex: 1,
    },
    pokemonId: {
        fontSize: 12,
        fontFamily: 'Inter-900',
        color: 'rgba(63, 63, 63, 0.85)',
    },
    pokemonName: {
        fontSize: 24,
        fontFamily: 'Nunito-900',
        color: '#000000ff',
        textTransform: 'capitalize',
        marginBottom: 3,
    },
    typesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    typeBadge: {
        backgroundColor: 'rgba(103, 103, 103, 0.25)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    typeText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
});
