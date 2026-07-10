import { View, Text, Image, StyleSheet, Modal, Pressable, Animated } from 'react-native';

type Props = {
    title: string,
    subtitle: string,
};

export function TitleBar({ title, subtitle }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <Text style={styles.title}>{title}</Text>
        </View >
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontFamily: 'Nunito-900',
        marginBottom: 0,
    },
    subtitle: {
        fontSize: 12,
        fontFamily: 'Inter-700',
        color: '#6B6B80',
        marginBottom: -3,
        textTransform: 'uppercase',
        letterSpacing: 1.3,
    },
    container: {
        marginTop: 5,
        marginLeft: 20,
        marginBottom: 3,
    }
});