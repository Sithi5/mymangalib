import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    firestoreAddMangaToUserMangasList,
    firestoreGetUserData,
    firestoreRemoveMangaFromUserMangasList,
    firestoreUpdateUserMangasList,
} from 'api/FirebaseApi';
import { FirestoreUser, FirestoreUserManga } from 'api/FirebaseTypes';
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { getMangasIdsListFromFirestoreUsersMangasList } from 'utils/firebase';

const auth = getAuth();
const firestore = getFirestore();

export const signInUser = createAsyncThunk(
    'user/signInUser',
    async (args: { email: string; password: string }) => {
        const { email, password } = args;
        const response = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const uid = response.user.uid;
        const snapshot = await firestoreGetUserData({ uid: uid });
        let user_data: FirestoreUser;
        if (snapshot.exists()) {
            user_data = snapshot.data() as FirestoreUser;
        } else {
            throw "User data doesn't exist.";
        }
        return { email, uid, user_data };
    }
);

export const signUpUser = createAsyncThunk(
    'user/signUpUser',
    async (args: { email: string; password: string; username: string }) => {
        const { email, password, username } = args;
        const response = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const uid = response.user.uid;
        const new_user_data: FirestoreUser = {
            email: email,
            username: username,
            user_mangas_list: [],
        };
        await setDoc(doc(collection(firestore, 'users'), uid), new_user_data);
        return { email, uid, username };
    }
);

export const signOutUser = createAsyncThunk('user/signOutUser', async () => {
    await signOut(auth);
});

export const addMangaToUserMangaList = createAsyncThunk(
    'user/addMangaToUserMangaList',
    async (args: { uid: string; user_manga: FirestoreUserManga }) => {
        const { user_manga, uid } = args;
        const response = await firestoreAddMangaToUserMangasList({
            user_manga: user_manga,
            uid: uid,
        });
        return { user_manga };
    }
);

export const removeMangaFromUserMangaList = createAsyncThunk(
    'user/removeMangaFromUserMangaList',
    async (args: { uid: string; user_manga: FirestoreUserManga }) => {
        const { user_manga, uid } = args;
        const response = await firestoreRemoveMangaFromUserMangasList({
            user_manga: user_manga,
            uid: uid,
        });
        return { user_manga };
    }
);

export const updateUserMangasList = createAsyncThunk(
    'user/updateUserMangasList',
    async (args: { uid: string; user_mangas_list: FirestoreUserManga[] }) => {
        const { user_mangas_list, uid } = args;
        const response = await firestoreUpdateUserMangasList({
            user_mangas_list: user_mangas_list,
            uid: uid,
        });
        return { user_mangas_list };
    }
);

export type UserState = FirestoreUser & {
    uid: string | undefined;
    logged: boolean;
    // kitsu_mangas_list: KitsuMangaAttributes[];
};

const initialState: UserState = {
    uid: undefined,
    logged: false,
    user_mangas_list: [], //Refer to user_mangas_list in firestore
    // kitsu_mangas_list: [], // Refer to corresponding mangas in Kitsu
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(signInUser.fulfilled, (state, action) => {
            // console.log('signInUser fullfilled');
            state.logged = true;
            state.uid = action.payload.uid;
            state.email = action.payload.email;
            state.username = action.payload.user_data['username'];
            state.user_mangas_list =
                action.payload.user_data['user_mangas_list'];
        });
        builder.addCase(signOutUser.fulfilled, (state) => {
            // console.log('signOutUser fullfilled');
            state.uid = undefined;
            state.logged = false;
        });
        builder.addCase(signUpUser.fulfilled, (state, action) => {
            // console.log('signUpUser fullfilled');
            state.logged = true;
            state.uid = action.payload.uid;
            state.username = action.payload.username;
            state.email = action.payload.email;
        });
        builder.addCase(addMangaToUserMangaList.fulfilled, (state, action) => {
            if (
                !getMangasIdsListFromFirestoreUsersMangasList({
                    user_mangas_list: state.user_mangas_list,
                }).includes(action.payload.user_manga.manga_id)
            ) {
                const new_user_manga = action.payload.user_manga;
                state.user_mangas_list.push(new_user_manga);
            }
        });
        builder.addCase(
            removeMangaFromUserMangaList.fulfilled,
            (state, action) => {
                const index = getMangasIdsListFromFirestoreUsersMangasList({
                    user_mangas_list: state.user_mangas_list,
                }).indexOf(action.payload.user_manga.manga_id);
                if (index > -1) {
                    state.user_mangas_list.splice(index, 1);
                }
            }
        );
        builder.addCase(updateUserMangasList.fulfilled, (state, action) => {
            state.user_mangas_list = action.payload.user_mangas_list;
        });
    },
});

// Action creators are generated for each case reducer function
export const {} = userSlice.actions;

export default userSlice.reducer;
