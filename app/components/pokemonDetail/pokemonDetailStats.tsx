import { View, Text, Image, StyleSheet, Modal, Pressable, Animated } from 'react-native';
import { Pokemon } from '@/types/pokemon'

type Props = {
    currentPokemon: Pokemon
};

export function PokemonDetailStats({ currentPokemon }: Props) {
    const renderStatRow = (label: string, value: number, barColor: string) => {
        // Stats are capped at 150 for percentage representation
        const percentage = Math.min((value / 150) * 100, 100);
        return (
            <View style={styles.statRow}>
                <Text style={styles.statLabel}>{label}</Text>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: barColor }]} />
                </View>
                <Text style={styles.statValue}>{value}</Text>
            </View>
        );
    };

    return (
        <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>BASE STATS</Text>
            {renderStatRow('HP', currentPokemon.battleStats.hp, '#FF5959')}
            {renderStatRow('ATK', currentPokemon.battleStats.atk, '#F5AC78')}
            {renderStatRow('DEF', currentPokemon.battleStats.def, '#FAE078')}
            {renderStatRow('SPD', currentPokemon.battleStats.spd, '#85D4A7')}
        </View>

    )
}



const styles = StyleSheet.create({
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
        width: 128,
        height: 128,
        marginRight: 16,
    },
    headerTextContainer: {
        flex: 1,
    },
    pokemonId: {
        fontSize: 16,
        fontWeight: '700',
        color: 'rgba(67, 67, 67, 0.7)',
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
        backgroundColor: 'rgba(143, 143, 143, 0.25)',
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
        padding: 5,
    },
    sectionTitle: {
        fontSize: 15,
        color: '#000000ff',
        margin: 10,
        fontFamily: 'Inter-900',
        letterSpacing: 0.5,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    statLabel: {
        marginLeft: 10,
        width: 56,
        fontSize: 12,
        fontWeight: '900',
        color: '#7c7c7cff',
    },
    statValue: {
        width: 40,
        fontSize: 14,
        fontWeight: '700',
        color: '#333333',
        textAlign: 'right',
        marginRight: 10,
    },
    progressBarBg: {
        flex: 1,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#EEEEEE',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    addToFav: {
        width: 300,
        height: 50,
        backgroundColor: '#BB271A',
        borderRadius: 18,
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: 20,
    },
    addToFavText: {
        color: '#f4f4f4ff',
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
