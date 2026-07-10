import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Pokemon } from '@/types/pokemon'
import { TypePill } from '@/components/typePill'

type Props = {
    pokemon: Pokemon;
};

export function DescriptionCard({ pokemon }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.name}>{pokemon.name}</Text>
            <View style={styles.pillContainer}>
                <TypePill pokemon={pokemon} size={12}></TypePill>
            </View>
            <Text style={styles.desc}>{pokemon.description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
    },
    name: {
        textTransform: 'capitalize',
        fontFamily: 'Nunito-900',
        fontSize: 25,
    },
    pillContainer: {
        marginVertical: 2,
        marginBottom: 20,
    },
    desc: {
        color: '#555454ff',
        marginBottom: 5,
    }
})