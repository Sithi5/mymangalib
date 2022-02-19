import { AntDesign } from '@expo/vector-icons';
import {
    ButtonBorderColor,
    ButtonFullBackgroundColor,
    ButtonSignOut,
} from 'components/buttons';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AppStyles, {
    BLACK,
    DEFAULT_MARGIN,
    DEFAULT_RADIUS,
    GREY,
    ORANGE,
    WHITE,
} from 'globals/AppStyles';
import { RootBottomTabScreenProps } from 'navigations/NavigationsTypes';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from 'redux/Hooks';
import { signInUser, signUpUser } from 'redux/UserSlice';

const firestore = getFirestore();
const auth = getAuth();

export default function LoginScreen({
    navigation,
}: RootBottomTabScreenProps<'Login'>) {
    const [value, setValue] = useState({
        username: '',
        email: '',
        password: '',
        secure_password: true,
    });
    const user = useAppSelector((state) => state.user);

    const dispatch = useAppDispatch();

    async function _handleLogin() {
        if (value.email === '' || value.password === '') {
            Alert.alert('error:', 'email or password is missing.', [
                {
                    text: 'ok',
                },
            ]);
        } else {
            try {
                await dispatch(
                    signInUser({
                        email: value.email,
                        password: value.password,
                    })
                ).unwrap(); //Unwrap to raise error.
            } catch (error: any) {
                Alert.alert('error:', error.message, [
                    {
                        text: 'ok',
                    },
                ]);
            }
        }
    }

    async function _handleSignUp() {
        if (
            value.email === '' ||
            value.password === '' ||
            value.username === ''
        ) {
            Alert.alert('error:', 'all field are mandatory.', [
                {
                    text: 'ok',
                },
            ]);
        } else {
            try {
                await dispatch(
                    signUpUser({
                        email: value.email,
                        password: value.password,
                        username: value.username,
                    })
                ).unwrap(); //Unwrap to raise error.
            } catch (error: any) {
                Alert.alert('error:', error.message, [
                    {
                        text: 'ok',
                    },
                ]);
            }
        }
    }

    if (user.logged === true) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text>Welcome {user.username}</Text>
                <Text>email: {user.email}</Text>
                <Text>mangas_list: {user.mangas_list}</Text>
                <ButtonSignOut color={ORANGE}></ButtonSignOut>
            </View>
        );
    } else {
        return (
            <KeyboardAvoidingView
                style={AppStyles.main_container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.inputs_and_buttons_container}>
                    <View style={styles.text_input_container}>
                        <TextInput
                            style={styles.text_input}
                            placeholder={'Username'}
                            placeholderTextColor={GREY}
                            selectionColor={GREY}
                            value={value.username}
                            onChangeText={(text) =>
                                setValue({ ...value, username: text })
                            }
                            onSubmitEditing={() => {}}
                        />
                    </View>
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
