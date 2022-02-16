import FadeIn from 'animations/FadeIn';
import { getItemImageFromApi } from 'api/KitsuApi';
import { KitsuData, KitsuItemType } from 'api/KitsuTypes';
import AppStyles from 'globals/AppStyles';
import { Id } from 'globals/GlobalTypes';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import getMangaTitle from 'utils/GetKitsuItemTitle';

export const ITEM_HEIGHT = 190;

type Props = {
    item: KitsuData;
    item_type: KitsuItemType;
    _navigateToItemDetails: ({ id }: { id: Id }) => void;
};

export default React.memo(function SearchItem(props: Props) {
    const { item, item_type, _navigateToItemDetails } = props;

    let item_title = getMangaTitle({ item: item });

    const image_url = getItemImageFromApi({
        id: item.id,
        item_type: item_type,
        format: 'small',
    });

    return (
        <View style={AppStyles.main_container}>
            <FadeIn>
                <TouchableOpacity
                    style={styles.item_item_container}
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
    item_item_container: {
        height: ITEM_HEIGHT,
        backgroundColor: 'lightgrey',
        flexDirection: 'row',
    },
    item_image: {
        width: 120,
        height: 180,
        margin: 5,
        backgroundColor: 'grey',
    },
    content_main_container: {
        flexDirection: 'column',
        flex: 1,
        margin: 5,
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
        color: 'grey',
        flex: 1,
        fontSize: 25,
    },
    synopsis_text: { fontStyle: 'italic', color: 'grey' },
    start_date_text: { textAlign: 'right' },
});