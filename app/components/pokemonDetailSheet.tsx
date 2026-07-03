import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Pokemon } from '@/types/pokemon';
import { useBottomSheetAnimation } from '@/hooks/useBottomSheetAnimation';

const TYPE_COLORS: Record<string, string> = {
    grass: '#48D0B0',
    fire: '#FB6C6C',
    water: '#76BDFE',
    bug: '#A8B820',
    normal: '#A8A878',
    poison: '#A040A0',
    electric: '#FFD86F',
    ground: '#E0C068',
    fairy: '#EE99AC',
    fighting: '#C03028',
    psychic: '#F85888',
    rock: '#B8A038',
    ghost: '#705898',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    flying: '#A890F0',
};

type Props = {
    pokemon: Pokemon | null;
    onClose: () => void;
};

export function PokemonDetailSheet({ pokemon, onClose }: Props) {
    const insets = useSafeAreaInsets();
    const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);

    // Keep displaying the last selected Pokemon while animating out
    useEffect(() => {
        if (pokemon) {
            setCurrentPokemon(pokemon);
        }
    }, [pokemon]);

    const visible = !!pokemon;
    const { translateY, backdropOpacity, panHandlers, closeSheet } = useBottomSheetAnimation(
        visible,
        onClose
    );

    if (!currentPokemon) return null;

    const primaryType = currentPokemon.type[0] || 'normal';
    const primaryColor = TYPE_COLORS[primaryType.toLowerCase()] || '#a2a2a2';

    const renderStatRow = (label: string, value: number, barColor: string) => {
        // Stats are capped at 150 for percentage representation
        const percentage = Math.min((value / 150) * 100, 100);
        return (
            <View style={styles.statRow}>
                <Text style={styles.statLabel}>{label}</Text>
                <Text style={styles.statValue}>{value}</Text>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: barColor }]} />
                </View>
            </View>
        );
    };

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={closeSheet}>
            <View style={styles.overlay}>
                {/* Backdrop overlay */}
                <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
                <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} />

                {/* Sliding Sheet */}
                <Animated.View
                    style={[
                        styles.sheet,
                        {
                            transform: [{ translateY }],
                            paddingBottom: Math.max(insets.bottom, 24),
                        },
                    ]}
                    {...panHandlers}
                >
                    {/* Drag Handle */}
                    <View style={styles.dragHandleContainer}>
                        <View style={styles.dragHandle} />
                    </View>

                    {/* Header Card */}
                    <View style={[styles.header, { backgroundColor: primaryColor }]}>
                        <Image source={{ uri: currentPokemon.image }} style={styles.image} />
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.pokemonId}>#{String(currentPokemon.id).padStart(3, '0')}</Text>
                            <Text style={styles.pokemonName}>{currentPokemon.name}</Text>
                            <View style={styles.typesRow}>
                                {currentPokemon.type.map((t) => (
                                    <View key={t} style={styles.typeBadge}>
                                        <Text style={styles.typeText}>{t}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Stats List */}
                    <View style={styles.statsContainer}>
                        <Text style={styles.sectionTitle}>Base Stats</Text>
                        {renderStatRow('HP', currentPokemon.battleStats.hp, '#4CAF50')}
                        {renderStatRow('Attack', currentPokemon.battleStats.atk, '#FF5722')}
                        {renderStatRow('Defense', currentPokemon.battleStats.def, '#2196F3')}
                        {renderStatRow('Speed', currentPokemon.battleStats.spd, '#FFC107')}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
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
