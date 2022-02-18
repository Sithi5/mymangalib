import { DEFAULT_MARGIN, DEFAULT_RADIUS, WHITE } from 'globals/AppStyles';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth();

type Props = {
    color: string;
    text?: string;
};

export default function ButtonSignOut(props: Props) {
    const { color, text = 'sign out' } = props;

    return (
        <TouchableOpacity
            onPress={() => signOut(auth)}
            style={[styles.button, { backgroundColor: color }]}
        >
            <Text style={styles.button_text}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        padding: 15,
        borderRadius: DEFAULT_RADIUS,
        alignItems: 'center',
        margin: DEFAULT_MARGIN,
    },
    button_text: {
        color: WHITE,
        fontWeight: '700',
        fontSize: 16,
    },
});
