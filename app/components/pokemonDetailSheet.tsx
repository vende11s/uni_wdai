import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Pokemon } from '@/types/pokemon';
import { useBottomSheetAnimation } from '@/hooks/useBottomSheetAnimation';
import { PokemonDetailCard } from '@/components/pokemonDetail/pokemonDetailCard'
import { PokemonDetailStats } from '@/components/pokemonDetail/pokemonDetailStats'
import { PokemonDetailButton } from '@/components/pokemonDetail/pokemonDetailButton'

type Props = {
    pokemon: Pokemon | null;
    onClose: () => void;
    onUpdate: (id: number, updates: Partial<Omit<Pokemon, 'id'>>) => void;
    onRemove?: () => void;
};

export function PokemonDetailSheet({ pokemon, onClose, onUpdate, onRemove }: Props) {
    const insets = useSafeAreaInsets();
    const visible = !!pokemon;
    const { animatedBackdropStyle, animatedSheetStyle, panHandlers, closeSheet } = useBottomSheetAnimation(
        visible,
        onClose
    );

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={closeSheet}>
            <View style={styles.overlay}>
                {/* Backdrop overlay */}
                <Animated.View style={[styles.backdrop, animatedBackdropStyle]} />
                <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} />

                {/* Sliding Sheet */}
                <Animated.View
                    style={[
                        styles.sheet,
                        animatedSheetStyle,
                        {
                            paddingBottom: Math.max(insets.bottom, 24),
                        },
                    ]}
                    {...panHandlers}
                >
                    {/* Drag Handle */}
                    <View style={styles.dragHandleContainer}>
                        <View style={styles.dragHandle} />
                    </View>

                    {pokemon && (
                        <>
                            <PokemonDetailCard
                                pokemon={pokemon}
                                onUpdate={onUpdate}
                                style={[{ marginHorizontal: 16 }]}
                            />
                            <Text style={styles.descContainer}>{pokemon.description}</Text>
                            <PokemonDetailStats currentPokemon={pokemon} />

                            <View style={styles.buttonContainer}>
                                <PokemonDetailButton currentPokemon={pokemon} onUpdate={onUpdate} onRemove={onRemove} />
                            </View>
                        </>
                    )}

                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 15,
    },
    descContainer: {
        margin: 14,
        marginHorizontal: 18,
        color: '#4c4c4cff',
        fontFamily: 'Inter-400'
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: '#000000',
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 24,
        overflow: 'hidden',
    },
    dragHandleContainer: {
        width: '100%',
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    dragHandle: {
        width: 48,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E0E0E0',
    },
    header: {
        flexDirection: 'row',
        padding: 24,
        paddingTop: 12,
        alignItems: 'center',
        marginHorizontal: 16,
        borderRadius: 24,
    },
    image: {
        width: 110,
        height: 110,
        marginRight: 16,
    },
    headerTextContainer: {
        flex: 1,
    },
    pokemonId: {
        fontSize: 16,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.7)',
    },
    pokemonName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textTransform: 'capitalize',
        marginBottom: 8,
    },
    typesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    typeBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
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
    statsContainer: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 16,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    statLabel: {
        width: 80,
        fontSize: 15,
        fontWeight: '600',
        color: '#666666',
    },
    statValue: {
        width: 40,
        fontSize: 15,
        fontWeight: '700',
        color: '#333333',
        textAlign: 'right',
        marginRight: 16,
    },
    progressBarBg: {
        flex: 1,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EEEEEE',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
});
