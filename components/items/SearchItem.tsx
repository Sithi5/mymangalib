import { Ionicons } from '@expo/vector-icons';
import FadeIn from 'animations/FadeIn';
import { kitsuGetItemImage } from 'api/KitsuApi';
import { KitsuData, KitsuItemType } from 'api/KitsuTypes';
import AppStyles, {
    DEFAULT_MARGIN,
    DEFAULT_RADIUS,
    GREY,
    ORANGE,
    WHITE,
} from 'globals/AppStyles';
import { Id } from 'globals/GlobalTypes';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from 'redux/Hooks';
import { addMangaToUserMangaList } from 'redux/UserSliceAsyncThunk';
import {
    createNewFirestoreUserManga,
    getFirestoreUserMangaById,
} from 'utils/firebase';
import { getKitsuItemTitle } from 'utils/kitsu/';
import { removeMangaFromUser } from 'utils/users';

export const ITEM_HEIGHT = 190;

type Props = {
    item: KitsuData;
    item_type: KitsuItemType;
    _navigateToItemDetails: ({ id }: { id: Id }) => void;
};

export default React.memo(function SearchItem(props: Props) {
    const { item, item_type, _navigateToItemDetails } = props;
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    let item_title = getKitsuItemTitle({ item: item });

    const image_url = kitsuGetItemImage({
        id: item.id,
        item_type: item_type,
        format: 'small',
    });

    function _addOrRemoveMangaFromLibrary() {
        if (user.logged) {
            const manga_is_in_library = user.user_mangas_list.includes(
                getFirestoreUserMangaById({
                    user: user,
                    id: item.id,
                })
            );

            async function _addMangaToLibrary() {
                if (user.uid !== undefined) {
                    const manga_is_in_library = user.user_mangas_list.includes(
                        getFirestoreUserMangaById({
                            user: user,
                            id: item.id,
                        })
                    );
                    try {
                        await dispatch(
                            addMangaToUserMangaList({
                                uid: user.uid,
                                user_manga: createNewFirestoreUserManga({
                                    manga_name: item_title,
                                    manga_id: item.id,
                                    volumes_count: item.attributes.volumeCount,
                                }),
                            })
                        );
                    } catch (error: any) {
                        console.error(error.message);
                    }
                }
            }

            async function _removeUserManga() {
                await removeMangaFromUser({
                    user: user,
                    user_manga: getFirestoreUserMangaById({
                        user: user,
                        id: item.id,
                    }),
                    manga_id: item.id,
                    dispatch: dispatch,
                });
            }

            if (manga_is_in_library) {
                _removeUserManga();
            } else {
                _addMangaToLibrary();
            }
        }
    }

    function _displayAddToLibraryImage() {
        if (item_type === 'manga' && user.logged) {
            const manga_is_in_library = user.user_mangas_list.includes(
                getFirestoreUserMangaById({
                    user: user,
                    id: item.id,
                })
            );
            const color = manga_is_in_library ? ORANGE : GREY;
            return (
                <TouchableOpacity
                    onPress={async () => {
                        await _addOrRemoveMangaFromLibrary();
                    }}
                >
                    <Ionicons
                        style={styles.icon}
                        name="add-circle-outline"
                        size={20}
                        color={color}
                    />
                </TouchableOpacity>
            );
        }
    }

    return (
        <View style={AppStyles.main_container}>
            <FadeIn>
                <TouchableOpacity
                    style={styles.item_container}
                    onPress={() => _navigateToItemDetails({ id: item.id })}
                >
                    <Image
                        source={{ uri: image_url }}
                        style={styles.item_image}
                    />
                    <View style={styles.content_main_container}>
                        <View style={styles.content_top_container}>
                            <Text style={styles.title_text}>{item_title}</Text>
                            <Text style={styles.rating_text}>
                                {item.attributes.averageRating}
                            </Text>
                            {_displayAddToLibraryImage()}
                        </View>

                        <View style={styles.content_middle_container}>
                            <Text
                                style={styles.synopsis_text}
                                numberOfLines={6}
                            >
                                {item.attributes.synopsis}
                            </Text>
                        </View>
                        <View style={styles.content_bottom_container}>
                            <Text style={styles.start_date_text}>
                                {item.attributes.startDate}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </FadeIn>
        </View>
    );
});

const styles = StyleSheet.create({
    item_container: {
        flex: 1,
        height: ITEM_HEIGHT,
        backgroundColor: WHITE,
        flexDirection: 'row',
        borderRadius: DEFAULT_RADIUS,
    },
    item_image: {
        width: 120,
        marginRight: DEFAULT_MARGIN,
        backgroundColor: 'grey',
        borderTopLeftRadius: DEFAULT_RADIUS,
        borderBottomLeftRadius: DEFAULT_RADIUS,
    },
    content_main_container: {
        flexDirection: 'column',
        flex: 1,
        margin: DEFAULT_MARGIN,
    },
    content_top_container: {
        flexDirection: 'row',
        flex: 3,
    },

    content_middle_container: { flex: 7 },
    content_bottom_container: {
        flex: 1,
    },
    title_text: {
        textAlign: 'left',
        flex: 1,
        flexWrap: 'wrap',
        fontWeight: 'bold',
        fontSize: 20,
    },
    rating_text: {
        textAlign: 'right',
        fontWeight: 'bold',
        color: GREY,
        flex: 1,
        fontSize: 25,
    },
    icon: {
        padding: 10,
    },
    synopsis_text: { fontStyle: 'italic', color: GREY },
    start_date_text: { textAlign: 'right' },
});