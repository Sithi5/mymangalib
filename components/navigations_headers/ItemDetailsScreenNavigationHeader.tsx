import {
    BACKGROUND_DARK_OPACITY,
    BACKGROUND_WHITE_OPACITY,
    BLACK,
    DARK_GREY,
    DEFAULT_MARGIN,
    GREY,
    ORANGE,
    WHITE,
} from 'globals/AppStyles';
import { SearchStackNavigationProps } from 'navigations/NavigationsTypes';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

type Props = {
    navigation: SearchStackNavigationProps<'ItemDetails'>;
    item_title: string;
    image_url: string;
    scroll: Animated.Value;
    updateHeaderZIndex: any;
};

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 50;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const FADE_DURATION = 750;

export default function ItemDetailsScreenNavigationHeader(props: Props) {
    const { navigation, item_title, image_url, scroll, updateHeaderZIndex } =
        props;

    const [header_height, setHeaderHeight] = useState(HEADER_MAX_HEIGHT);

    const fade_out_anim = useRef(new Animated.Value(0)).current;
    const had_fade_in = useRef(false);

    const header_diff_clamp = Animated.diffClamp(
        scroll,
        0,
        HEADER_SCROLL_DISTANCE
    );

    const fade_out_background_image = fade_out_anim.interpolate({
        inputRange: [0, 1],
        outputRange: [BACKGROUND_DARK_OPACITY, BACKGROUND_WHITE_OPACITY],
    });

    const item_title_text_left_pos = header_diff_clamp.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 20],
    });

    const header_text_color = fade_out_anim.interpolate({
        inputRange: [0, 1],
        outputRange: [WHITE, ORANGE],
    });

    const back_icon_color = fade_out_anim.interpolate({
        inputRange: [0, 1],
        outputRange: [WHITE, GREY],
    });

    const translate_header = Animated.multiply(header_diff_clamp, -1);

    useEffect(() => {
        scroll.addListener(({ value }) => {
            if (value > HEADER_SCROLL_DISTANCE && !had_fade_in.current) {
                Animated.timing(fade_out_anim, {
                    toValue: 1,
                    duration: FADE_DURATION,
                    useNativeDriver: false,
                }).start();
                had_fade_in.current = true;
                setHeaderHeight(HEADER_MIN_HEIGHT);
                updateHeaderZIndex(2);
            }
            if (value < HEADER_SCROLL_DISTANCE && had_fade_in.current) {
                Animated.timing(fade_out_anim, {
                    toValue: 0,
                    duration: FADE_DURATION,
                    useNativeDriver: false,
                }).start();
                had_fade_in.current = false;
                setHeaderHeight(HEADER_MAX_HEIGHT);
                updateHeaderZIndex(0);
            }
        });
        return () => {
            scroll.removeAllListeners();
        };
    }, []);

    //Render Two different header if header size is MAX or MIN
    if (header_height === HEADER_MAX_HEIGHT) {
        return (
            <View
                style={[
                    styles.header_main_container,
                    {
                        height: HEADER_MAX_HEIGHT,
                    },
                ]}
            >
                <Animated.View
                    style={{
                        flex: 1,
                        transform: [
                            {
                                translateY: translate_header,
                            },
                        ],
                    }}
                >
                    <ImageBackground
                        source={
                            image_url !== ''
                                ? { uri: image_url }
                                : require('images/default_image.png')
                        }
                        style={styles.image_background}
                    >
                        <Animated.View
                            style={{
                                flex: 1,
                                backgroundColor: fade_out_background_image,
                            }}
                        >
                            <Animated.View
                                style={[
                                    styles.top_elems_container,
                                    {
                                        top:
                                            header_height === HEADER_MAX_HEIGHT
                                                ? header_diff_clamp
                                                : 0,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.goBack();
                                    }}
                                >
                                    <Animated.Image
                                        style={[
                                            styles.back_button_icon,

                                            {
                                                width: 35,
                                                height: 35,
                                                tintColor: back_icon_color,
                                            },
                                        ]}
                                        source={require('images/icon_back.png')}
                                    />
                                </TouchableOpacity>
                            </Animated.View>

                            <View style={styles.bottom_elems_container}>
                                <Animated.Text
                                    numberOfLines={1}
                                    style={[
                                        styles.item_title_text,
                                        {
                                            color: header_text_color,
                                            left: item_title_text_left_pos,
                                        },
                                    ]}
                                >
                                    {item_title.length < 30
                                        ? item_title
                                        : item_title.substring(0, 27) + '...'}
                                </Animated.Text>
                            </View>
                        </Animated.View>
                    </ImageBackground>
                </Animated.View>
            </View>
        );
    } else {
        return (
            <View
                style={{
                    marginBottom: HEADER_SCROLL_DISTANCE,
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        height: HEADER_MAX_HEIGHT,
                        width: '100%',
                        marginTop: -(HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT),
                        zIndex: 0,
                        transform: [],
                    }}
                >
                    <ImageBackground
                        source={
                            image_url !== ''
                                ? { uri: image_url }
                                : require('images/default_image.png')
                        }
                        style={styles.image_background}
                    >
                        <Animated.View
                            style={{
                                flex: 1,
                                backgroundColor: fade_out_background_image,
                            }}
                        ></Animated.View>
                    </ImageBackground>
                </View>
                <View
                    style={[
                        styles.header_main_container,
                        {
                            height: HEADER_MIN_HEIGHT,
                            zIndex: 1,
                            backgroundColor: 'transparent',
                        },
                    ]}
                >
                    <Animated.View style={styles.min_header_elem_container}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack();
                            }}
                        >
                            <Animated.Image
                                style={[
                                    {
                                        width: 35,
                                        height: 35,
                                        tintColor: back_icon_color,
                                    },
                                ]}
                                source={require('images/icon_back.png')}
                            />
                        </TouchableOpacity>
                        <Animated.Text
                            numberOfLines={1}
                            style={[
                                styles.item_title_text,
                                {
                                    left: 10,
                                    color: header_text_color,
                                },
                            ]}
                        >
                            {item_title.length < 30
                                ? item_title
                                : item_title.substring(0, 27) + '...'}
                        </Animated.Text>
                    </Animated.View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header_main_container: {
        flex: 1,
    },
    image_background: {
        flex: 1,
    },
    item_title_text: {
        fontSize: 20,
        color: DARK_GREY,
        fontFamily: 'Rubik-SemiBold',
    },
    top_elems_container: {
        flex: 1,
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    min_header_elem_container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    back_button_icon: {
        padding: 10,
        top: 8,
    },
    option_button_icon: {
        padding: 10,
    },
    bottom_elems_container: {
        position: 'absolute',
        bottom: 10,
        left: 20,
        margin: DEFAULT_MARGIN,
    },
});
