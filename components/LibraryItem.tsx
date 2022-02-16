import FadeIn from 'animations/FadeIn';
import { getItemImageFromApi } from 'api/KitsuApi';
import { KitsuData } from 'api/KitsuTypes';
import { Id } from 'globals/GlobalTypes';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import getMangaTitle from 'utils/GetKitsuItemTitle';

type Props = {
    manga: KitsuData;
    _navigateToMangaDetails: (manga_id: Id) => void;
};

export default React.memo(function LibraryItem(props: Props) {
    const { manga, _navigateToMangaDetails } = props;

    let manga_title = getMangaTitle({ item: manga });

    const image_url = getItemImageFromApi({
        id: manga.id,
        item_type: 'manga',
        format: 'small',
    });

    return (
        <FadeIn>
            <TouchableOpacity
                style={styles.manga_item_container}
                onPress={() => _navigateToMangaDetails(manga.id)}
            >
                <Text>{manga_title}</Text>
                <Image source={{ uri: image_url }} style={styles.manga_image} />
            </TouchableOpacity>
        </FadeIn>
    );
});

const styles = StyleSheet.create({
    manga_item_container: {
        flex: 1,
        backgroundColor: 'lightgrey',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    manga_image: {
        width: 200,
        height: 200,
    },
});