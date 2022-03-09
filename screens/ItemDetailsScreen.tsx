import { kitsuGetItemDetails, kitsuGetItemImage } from 'api/KitsuApi';
import {
    KitsuData,
    KitsuItemType,
    KitsuMangaAttributes,
    KitsuAnimeAttributes,
} from 'api/KitsuTypes';
import { ButtonBorderColor } from 'components/buttons';
import Loading from 'components/Loading';
import { ItemDetailsScreenNavigationHeader } from 'components/navigations_headers';
import StatusBar from 'components/StatusBar';
import AppStyles, {
    BLACK,
    DARK_GREY,
    DEFAULT_MARGIN,
    GREY,
    ORANGE,
    WHITE,
} from 'globals/AppStyles';
import { Id } from 'globals/GlobalTypes';
import { SearchStackScreenProps } from 'navigations/NavigationsTypes';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from 'redux/Hooks';
import { getFirestoreUserMangaById } from 'utils/firebase';
import getKitsuItemTitle from 'utils/kitsu/GetKitsuItemTitle';
import addItemToUser from 'utils/users/AddItemToUser';
import moment from 'moment';

const RATING_BUBBLE_CONTAINER_SIZE = 50;
const RATING_BUBBLE_CONTAINER_INSIDE_SIZE = RATING_BUBBLE_CONTAINER_SIZE - 10;

export default function ItemDetailsScreen({
    navigation,
    route,
}: SearchStackScreenProps<'ItemDetails'>) {
    const [is_loading, setLoading] = useState(true);
    const [item, setItem] = useState<KitsuData>();
    const [header_z_index, setHeaderZIndex] = useState(0);
    const scroll = useRef(new Animated.Value(0)).current;
    const item_id: Id = route.params.item_id;
    const item_type: KitsuItemType = route.params.item_type;
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    let image_url = useRef('');
    let item_title = item ? getKitsuItemTitle({ item: item }) : '';

    function updateHeaderZIndex(new_z_index: number) {
        setHeaderZIndex(new_z_index);
    }

    useEffect(() => {
        async function _getItemDetails() {
            try {
                const response = await kitsuGetItemDetails({
                    id: item_id,
                    item_type: item_type,
                });
                if (response) {
                    setItem(response.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                console.log;
                image_url.current = kitsuGetItemImage({
                    id: item_id,
                    item_type: item_type,
                    format: 'small',
                });
                setLoading(false);
            }
        }
        _getItemDetails();
    }, [item_id]);

    function _displayAddToLibrary() {
        async function _addMangaToLibrary() {
            if (user.uid !== undefined && item) {
                try {
                    addItemToUser({
                        item_type: item_type,
                        item: item,
                        dispatch: dispatch,
                        user: user,
                        item_title: item_title,
                    });
                } catch (error: any) {
                    console.error(error.message);
                }
            }
        }
        if (item && item_type === 'manga' && user.logged) {
            const manga_is_in_library = user.user_mangas_list.includes(
                getFirestoreUserMangaById({
                    user: user,
                    id: item.id,
                })
            );
            if (!manga_is_in_library) {
                return (
                    <ButtonBorderColor
                        color={ORANGE}
                        text={'Add to library'}
                        onPressFunction={() => {
                            _addMangaToLibrary();
                        }}
                    />
                );
            }
        }
    }

    function _top_container_item_details() {
        if (item != undefined) {
            const item_attribute = item.attributes;
            return (
                <View style={styles.content_top_container_item_details}>
                    <Text
                        style={styles.content_top_container_item_details_text}
                    >
                        Type: {item_attribute.subtype}
                    </Text>
                    <Text
                        style={styles.content_top_container_item_details_text}
                    >
                        Start date:{' '}
                        {moment(item_attribute.startDate).format(
                            'MMMM Do YYYY'
                        )}
                    </Text>
                    <Text
                        style={styles.content_top_container_item_details_text}
                    >
                        Status: {item_attribute.status}
                    </Text>
                    {item_attribute.status === 'finished' ? (
                        <Text
                            style={
                                styles.content_top_container_item_details_text
                            }
                        >
                            End date:{' '}
                            {item_attribute.endDate
                                ? moment(item_attribute.endDate).format(
                                      'MMMM Do YYYY'
                                  )
                                : 'unknow'}
                        </Text>
                    ) : null}
                    {item_type == 'manga' ? (
                        <View>
                            <Text
                                style={
                                    styles.content_top_container_item_details_text
                                }
                            >
                                Chapter count:{' '}
                                {
                                    (item_attribute as KitsuMangaAttributes)
                                        .chapterCount
                                }
                            </Text>
                            <Text
                                style={
                                    styles.content_top_container_item_details_text
                                }
                            >
                                Volume count:{' '}
                                {
                                    (item_attribute as KitsuMangaAttributes)
                                        .volumeCount
                                }
                            </Text>
                            <Text
                                style={
                                    styles.content_top_container_item_details_text
                                }
                            >
                                Serialization:{' '}
                                {
                                    (item_attribute as KitsuMangaAttributes)
                                        .serialization
                                }
                            </Text>
                        </View>
                    ) : (
                        <View>
                            <Text
                                style={
                                    styles.content_top_container_item_details_text
                                }
                            >
                                Episode count:{' '}
                                {
                                    (item_attribute as KitsuAnimeAttributes)
                                        .episodeCount
                                }
                            </Text>
                            <Text
                                style={
                                    styles.content_top_container_item_details_text
                                }
                            >
                                Episode Lenght:{' '}
                                {
                                    (item_attribute as KitsuAnimeAttributes)
                                        .episodeLength
                                }{' '}
                                mins
                            </Text>
                        </View>
                    )}
                </View>
            );
        }
    }

    function _ItemDetails() {
        if (item != undefined) {
            const item_rating_text = item.attributes.averageRating
                ? (parseInt(item.attributes.averageRating) / 10).toString()
                : '';

            return (
                <Animated.ScrollView
                    style={styles.scrollview_container}
                    stickyHeaderIndices={[0]}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scroll } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={1}
                >
                    <Animated.View
                        style={{
                            zIndex: header_z_index, // works on ios
                            elevation: header_z_index, // works on android
                        }}
                    >
                        <ItemDetailsScreenNavigationHeader
                            item_title={item_title}
                            image_url={image_url.current}
                            navigation={navigation}
                            scroll={scroll}
                            updateHeaderZIndex={updateHeaderZIndex}
                        ></ItemDetailsScreenNavigationHeader>
                    </Animated.View>

                    <View style={styles.rating_bubble_container}>
                        <View style={styles.rating_bubble_inside}>
                            <Text style={styles.rating_bubble_text}>
                                {item_rating_text}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.content_main_container}>
                        <View style={styles.content_top_container}>
                            <Image
                                source={
                                    image_url.current !== ''
                                        ? { uri: image_url.current }
                                        : require('images/default_image.png')
                                }
                                style={styles.content_top_container_item_image}
                            />
                            {_top_container_item_details()}
                        </View>
                        <View style={styles.content_body_container}>
                            <View style={styles.content_overview_container}>
                                <Text style={styles.overview_text}>
                                    {item.attributes.synopsis}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.content_bottom_container}></View>
                        {_displayAddToLibrary()}
                    </View>
                </Animated.ScrollView>
            );
        }
    }

    return (
        <View style={AppStyles.main_container}>
            <StatusBar />
            <Loading is_loading={is_loading} />
            {_ItemDetails()}
        </View>
    );
}

const styles = StyleSheet.create({
    scrollview_container: {
        flex: 1,
    },

    navigation_header_container: {
        flex: 1,
    },
    content_main_container: {
        flex: 1,
        marginTop: -(RATING_BUBBLE_CONTAINER_SIZE / 3),
    },
    content_top_container: {
        flex: 1,
        flexDirection: 'row',
    },
    content_top_container_item_image: {
        height: 150,
        width: 100,
        margin: DEFAULT_MARGIN,
        borderRadius: 10,
        backgroundColor: GREY,
    },
    content_top_container_item_details: {
        flexDirection: 'column',
        margin: 5,
        flex: 1,
    },
    content_top_container_item_details_text: {
        margin: 3,
        fontFamily: 'Rubik-Medium',
        color: BLACK,
    },
    content_body_container: {
        flex: 3,
        margin: 5,
    },

    content_overview_container: {
        flex: 1,
        margin: 5,
    },
    content_bottom_container: {
        flex: 1,
        margin: 5,
    },
    overview_text: {
        flexWrap: 'wrap',
        fontSize: 17,
        color: GREY,
        fontFamily: 'Rubik-LightItalic',
    },

    rating_bubble_container: {
        marginTop: -(RATING_BUBBLE_CONTAINER_SIZE / 2),
        alignSelf: 'flex-end',
        marginRight: '10%',
        width: RATING_BUBBLE_CONTAINER_SIZE,
        height: RATING_BUBBLE_CONTAINER_SIZE,
        borderRadius: RATING_BUBBLE_CONTAINER_SIZE / 2,
        backgroundColor: ORANGE,
        zIndex: 1, // works on ios
        elevation: 1, // works on android
        justifyContent: 'center',
        alignItems: 'center',
    },
    rating_bubble_inside: {
        width: RATING_BUBBLE_CONTAINER_INSIDE_SIZE,
        height: RATING_BUBBLE_CONTAINER_INSIDE_SIZE,
        borderRadius: RATING_BUBBLE_CONTAINER_INSIDE_SIZE / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: WHITE,
    },
    rating_bubble_text: {
        fontSize: 20,
        fontFamily: 'Rubik-Bold',
        color: ORANGE,
    },
    bottom_text: {
        flexWrap: 'wrap',
        fontSize: 17,
        fontFamily: 'Rubik-Bold',
        color: GREY,
    },
});
