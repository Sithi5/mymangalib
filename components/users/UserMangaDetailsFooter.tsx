import { ButtonFullBackgroundColor } from 'components/buttons';
import { RED } from 'globals/AppStyles';
import React from 'react';
import { View } from 'react-native';

type Props = {
    removeMangaFromLibrary: () => void;
};

export default function UserMangaDetailsFooter(props: Props) {
    const { removeMangaFromLibrary } = props;

    return (
        <View style={{ flex: 1 }}>
            <ButtonFullBackgroundColor
                color={RED}
                onPressFunction={() => {
                    removeMangaFromLibrary();
                }}
                text={'Remove manga from library'}
            />
        </View>
    );
}