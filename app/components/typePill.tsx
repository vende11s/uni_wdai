import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Pokemon, TYPE_COLORS } from '@/types/pokemon';

type Props = {
    pokemon: Pokemon;
    size: number;
};

export function TypePill({ pokemon, size }: Props) {
    return (
        <View style={styles.typesRow}>
            {pokemon.type.map((type) => (
                <View key={type} style={[styles.pill, { backgroundColor: TYPE_COLORS[type.toLowerCase()] || '#6c757d' }]}>
                    <Text style={[styles.pillText, { fontSize: size }]}>{type}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    pill: {
        backgroundColor: '#6c757d',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    pillText: {
        color: 'white',
        fontFamily: 'Inter-900',
        textTransform: 'uppercase',
        letterSpacing: 1.05,
    },
    typesRow: {
        flexDirection: 'row',
        gap: 4,
    },
});