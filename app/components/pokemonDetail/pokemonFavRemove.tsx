import { View, Text, Image, StyleSheet, Modal, Pressable, Animated } from 'react-native';
import { Pokemon } from '@/types/pokemon'
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
    currentPokemon: Pokemon
    onUpdate: (id: number, updates: Partial<Omit<Pokemon, 'id'>>) => void;
};

export function PokemonFavRemove({ currentPokemon, onUpdate }: Props) {

    return (
        <Pressable style={styles.addToFav} onPress={() => onUpdate(currentPokemon.id, { isFav: !currentPokemon.isFav })}>
            <Ionicons name="close-outline" size={20} color="#cc0000" />
            <Text style={styles.addToFavText}>{'Remove'}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    addToFav: {
        backgroundColor: '#cc000012',
        borderRadius: 9999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        alignSelf: 'center',
    },
    addToFavText: {
        color: '#cc0000',
        fontSize: 14,
        fontFamily: 'Inter-700',
    },
});
