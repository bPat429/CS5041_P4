// Import safe area context component to ensure the UI is within safe area (mostly only applicable on mobile devices)
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput, ActivityIndicator, Text, HelperText } from "react-native-paper";

import { Pressable, View } from "react-native";
import { httpsCallable } from 'firebase/functions';
import { useState, React, useEffect } from "react";

// Import Expo Status Bar component
import { StatusBar } from 'expo-status-bar';

import styles from '../components/Styles';

import { signInWithCustomToken } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useList } from 'react-firebase-hooks/database';
import { getDatabase, ref, push, serverTimestamp, query, orderByChild, equalTo, limitToLast } from "firebase/database";

import { auth, functions, database, firebaseToken } from '../Firebase';


// Screen displaying the top scores for the game
export default function Game() {

    const [username, setUsername] = useState("");
    const [invalid_username, setValidUsername] = useState(true);
    const [score, setScore] = useState(3);

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

    useEffect(() => {
        if (username.length > 0) {
            setValidUsername(false);
        } else {
            setValidUsername(true);
        }
    }, [username]);

    // Post
    const handleOnPress = async () => {
        if (!invalid_username) {
            push(ref(database, "data"), {
                userId: user.uid,
                groupId: 20,
                timestamp: serverTimestamp(),
                type: "str",
                string: (username + ", Score: " + score)
            });
        }
    }

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
                    <Text>{score}</Text>
                    <TextInput
                        placeholder="Username"
                        value={username}
                        // Update state on text change
                        onChangeText={username => setUsername(username)}
                        style={styles.login_container}></TextInput>
                    <Button icon="send" disabled={invalid_username} mode="contained" style={{ margin: 10 }}
                        onPress={handleOnPress}
                    >Update Highscore</Button>
                </>}
            <StatusBar style="auto" />
        </View>
    )
}