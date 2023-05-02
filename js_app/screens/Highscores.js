// Import safe area context component to ensure the UI is within safe area (mostly only applicable on mobile devices)
import { SafeAreaView } from "react-native-safe-area-context";

import { Pressable, View } from "react-native";
import { httpsCallable } from 'firebase/functions';

import { ScrollView } from "react-native";

// Import Expo Status Bar component
import { StatusBar } from 'expo-status-bar';

import styles from '../components/Styles';

import { ActivityIndicator, Text } from "react-native-paper";

import { useEffect } from 'react';
import { signInWithCustomToken } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useList } from 'react-firebase-hooks/database';
import { getDatabase, ref, push, serverTimestamp, query, orderByChild, equalTo, limitToLast } from "firebase/database";

import { auth, functions, database, firebaseToken } from '../Firebase';

import Scores from "../components/Scores";


// Screen displaying the top scores for the game
export default function Highscores() {

    // Get hooks for auth state changes
    const [user, authLoading, authError] = useAuthState(auth);

    useEffect(() => {
        (async () => {
          const getToken = httpsCallable(functions, "getToken");
          const token = await getToken({ token: firebaseToken });
          if (token?.data?.result === "ok" && token?.data?.token) {
            signInWithCustomToken(auth, token.data.token);
          } else {
            console.error(token?.data?.reason ?? "unknownError")
          }
        })();
    }, []);

    const [snapshots, dbLoading, dbError] = useList(user ? query(ref(database, 'data'), orderByChild('groupId'), equalTo(20), limitToLast(3)) : null);

    return (
        <View style={styles.home_container}>
            {/* Change view between loading and the messages screen based on whether messages have finished loading */}
            {authLoading || dbLoading || !snapshots ?
                <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large"></ActivityIndicator>
                    <Text style={{ margin: 10 }}>loading...</Text>
                </SafeAreaView> :
                <>
                    {/* Maps the nested list of message to a flat array and sort by created time */}
                    {snapshots ?
                        <Scores scores={snapshots.map(el => el?.val()?.string ?? '')}></Scores>
                    : null}
                </>}
            <StatusBar style="auto" />
        </View>

    )
}