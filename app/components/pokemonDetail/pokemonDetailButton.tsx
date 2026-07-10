import { View, Text, Image, StyleSheet, Modal, Pressable, Animated } from 'react-native';
import { Pokemon } from '@/types/pokemon'

type Props = {
    currentPokemon: Pokemon
    onUpdate: (id: number, updates: Partial<Omit<Pokemon, 'id'>>) => void;
    onRemove?: () => void;
};

export function PokemonDetailButton({ currentPokemon, onUpdate, onRemove }: Props) {
    if (onRemove) {
        return (
            <Pressable style={styles.addToFav} onPress={onRemove}>
                <Text style={styles.addToFavText}>Remove Pin</Text>
            </Pressable>
        )
    }

    return (
        <Pressable style={styles.addToFav} onPress={() => onUpdate(currentPokemon.id, { isFav: !currentPokemon.isFav })}>
            <Text style={styles.addToFavText}>{currentPokemon.isFav ? 'Remove from Favorites' : 'Add to Favorites'}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    addToFav: {
        backgroundColor: '#CC0000',
        borderRadius: 18,
        marginHorizontal: 16,
        marginBottom: 20,
        paddingVertical: 16,
    },
    addToFavText: {
        color: '#ffffffff',
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
        fontSize: 18,
        fontFamily: 'Inter-900',
    },
});
