import type { KitsuData } from 'api/KitsuTypes';
import { WHITE } from 'globals/AppStyles';
import type { Id } from 'globals/GlobalTypes';
import type { LibraryScreenNavigationProp } from 'navigations/NavigationsTypes';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import type { FunctionSearchMangaArgs } from 'screens/SearchMangaScreen';
import MemoizedHorizontalMangaItem from './HorizontalMangaItem';

const SEPARATOR_WIDTH = 5;

type Props = {
    navigation: LibraryScreenNavigationProp;
    mangas_list: KitsuData[];
    last_page_reached?: boolean;
    _searchMangas?: ({}: FunctionSearchMangaArgs) => Promise<void>;
};

export default function LibraryMangasList(props: Props) {
    const {
        navigation,
        mangas_list,
        last_page_reached = true,
        _searchMangas,
    } = props;

    function _navigateToMangaDetails(id: Id) {
        navigation.navigate('ItemDetails', { id: id, item_type: 'manga' });
    }

    return (
        <View>
            <FlatList
                horizontal={true}
                data={mangas_list}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => (
                    <View style={styles.separator_container}></View>
                )}
                renderItem={({ item }) => (
                    <MemoizedHorizontalMangaItem
                        manga={item}
                        _navigateToMangaDetails={_navigateToMangaDetails}
                    />
                )}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    if (
                        last_page_reached === false &&
                        _searchMangas !== undefined
                    ) {
                        _searchMangas({});
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    separator_container: {
        width: SEPARATOR_WIDTH,
        backgroundColor: WHITE,
    },
});
