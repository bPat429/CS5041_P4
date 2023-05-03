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
    const [score, setScore] = useState(0);
    const [highscore, setHighscore] = useState();
    const [scores, setScores] = useState([]);
    const [usernames, setUsernames] = useState([]);

    // Get hooks for auth state changes
    const [user, authLoading, authError] = useAuthState(auth);

    const string_pattern = /(,\sScore:\s)/;
    const val_pattern = /\d+$/;

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
    
    const [snapshots, dbLoading, dbError] = useList(user ? query(ref(database, 'data'), orderByChild('groupId'), equalTo(20)) : null);

    useEffect(() => {
        if (username.length > 0) {
            if (scores.length > 0 && usernames.length > 0) {
                console.log(scores);
                console.log(usernames);
                const user_scores = scores.map(function(val, index){console.log(usernames[index] === username); if (usernames[index] === username) return val;});
                if (user_scores.length > 0) {
                    setHighscore(user_scores.sort(function(a, b){return b - a})[0]);
                } else {
                    setHighscore("");
                }
            }
            setValidUsername(false);
        } else {
            setValidUsername(true);
        }
    }, [username]);

    useEffect(() => {
        if (snapshots && snapshots.length > 0) {
            const filtered_snapshots = snapshots.map(el => el?.val()?.string ?? '').filter(s => string_pattern.test(s));
            // Make a list of usernames corresponding to each highscore string
            setUsernames(filtered_snapshots.map(el => el.slice(0, el.search(string_pattern))));
            // Make a list of score values corresponding to each highscore string
            setScores(filtered_snapshots.map(el => parseInt(val_pattern.exec(el)[0])));
            console.log(filtered_snapshots);
            console.log(filtered_snapshots.map(el => parseInt(val_pattern.exec(el)[0])));
        }
    }, [snapshots]);

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
    console.log("Highscore = " + highscore);

    return (
        <View style={styles.home_container}>
            {/* Change view between loading and the messages screen based on whether messages have finished loading */}
            {authLoading || dbLoading || !scores ?
                <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large"></ActivityIndicator>
                    <Text style={{ margin: 10 }}>loading...</Text>
                </SafeAreaView> :
                <>
                    <Text>Current Score: {score}</Text>
                    <Text>High Score: {highscore}</Text>
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