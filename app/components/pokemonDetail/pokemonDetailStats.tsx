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
});
