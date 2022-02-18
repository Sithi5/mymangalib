import { AntDesign } from '@expo/vector-icons';
import {
    ButtonBorderColor,
    ButtonFullBackgroundColor,
    ButtonSignOut,
} from 'components/buttons';
import AppStyles, {
    BLACK,
    DEFAULT_MARGIN,
    DEFAULT_RADIUS,
    GREY,
    ORANGE,
    WHITE,
} from 'globals/AppStyles';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { useAuthentication } from 'utils/hooks/useAuthentication';

const auth = getAuth();

export default function LoginScreen() {
    const [value, setValue] = useState({
        email: '',
        password: '',
        error: '',
        secure_password: true,
    });
    const user = useAuthentication();

    async function _handleLogin() {
        if (value.email === '' || value.password === '') {
            setValue({
                ...value,
                error: 'Email and password are mandatory.',
            });
        } else {
            try {
                await signInWithEmailAndPassword(
                    auth,
                    value.email,
                    value.password
                );
                setValue({ ...value, error: '' });
            } catch (error: any) {
                setValue({ ...value, error: error.message });
            }
        }
    }

    async function _handleSignUp() {
        if (value.email === '' || value.password === '') {
            setValue({
                ...value,
                error: 'Email and password are mandatory.',
            });
        } else {
            try {
                await createUserWithEmailAndPassword(
                    auth,
                    value.email,
                    value.password
                );
                setValue({ ...value, error: '' });
            } catch (error: any) {
                setValue({ ...value, error: error.message });
            }
        }
    }

    if (user) {
        return <ButtonSignOut color={ORANGE}></ButtonSignOut>;
    } else {
        return (
            <KeyboardAvoidingView
                style={AppStyles.main_container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {!!value.error && (
                    <View style={styles.error}>
                        <Text>{value.error}</Text>
                    </View>
                )}
                <View style={styles.inputs_and_buttons_container}>
                    <View style={styles.text_input_container}>
                        <TextInput
                            style={styles.text_input}
                            placeholder={'Email'}
                            placeholderTextColor={GREY}
                            selectionColor={GREY}
                            value={value.email}
                            onChangeText={(text) =>
                                setValue({ ...value, email: text })
                            }
                            onSubmitEditing={() => {}}
                        />
                    </View>
                    <View
                        style={[
                            styles.text_input_container,
                            styles.text_input_and_icon_container,
                        ]}
                    >
                        <TextInput
                            style={styles.text_input}
                            placeholder={'Password'}
                            placeholderTextColor={GREY}
                            selectionColor={GREY}
                            value={value.password}
                            onChangeText={(text) =>
                                setValue({ ...value, password: text })
                            }
                            onSubmitEditing={() => {}}
                            secureTextEntry={value.secure_password}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                setValue({
                                    ...value,
                                    secure_password: !value.secure_password,
                                });
                            }}
                        >
                            <AntDesign
                                style={styles.eye_icon}
                                name={value.secure_password ? 'eyeo' : 'eye'}
                                size={20}
                                color={GREY}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttons_container}>
                        <ButtonFullBackgroundColor
                            color={ORANGE}
                            text={'login'}
                            onPressFunction={_handleLogin}
                        />
                        <ButtonBorderColor
                            color={ORANGE}
                            text={'register'}
                            onPressFunction={_handleSignUp}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}
const styles = StyleSheet.create({
    inputs_and_buttons_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_input_container: {
        backgroundColor: WHITE,
        margin: DEFAULT_MARGIN,
        borderRadius: DEFAULT_RADIUS,
        height: 40,
        width: '80%',
    },
    buttons_container: {
        width: '60%',
    },
    text_input_and_icon_container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    eye_icon: {
        padding: 10,
    },
    text_input: {
        flex: 1,
        height: 30,
        borderColor: WHITE,
        borderWidth: 1,
        paddingLeft: DEFAULT_MARGIN,
        color: BLACK,
    },
    error: {
        marginTop: 10,
        padding: 10,
        color: 'red',
        backgroundColor: 'red',
    },
});
