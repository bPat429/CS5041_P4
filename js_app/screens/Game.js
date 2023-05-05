import { A } from '@expo/html-elements';

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

    return (
        <View style={styles.background_container}>
            {/* Change view between loading and the messages screen based on whether messages have finished loading */}
            {authLoading || dbLoading || !scores ?
                <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large"></ActivityIndicator>
                    <Text style={{ margin: 10 }}>loading...</Text>
                </SafeAreaView> :
                <>
                    <Text style={{ marginTop: "10px", marginBottom: "10px", fontSize: "20px", alignSelf: "center" }}>Asteroid Tennis</Text>
                    <Text style={{ marginTop: "5px", fontSize: "15px", alignSelf: "center" }}>Asteroid Tennis requires reflecting black and grey asteroids back into space.</Text>
                    <Text style={{ marginTop: "5px", fontSize: "15px", alignSelf: "center" }}>Gain points by reflecting asteroids, and gain points when bonus asteroids appear.</Text>
                    <Text style={{ marginTop: "5px", fontSize: "15px", alignSelf: "center" }}>Bonus asteroids appear when a button on the IOT wall is pressed.</Text>
                    <Text style={{ marginTop: "5px", fontSize: "15px", alignSelf: "center" }}>When an asteroid passes your character the game ends, and you can upload your score.</Text>
                    <Text style={{ marginTop: "5px", fontSize: "15px", alignSelf: "center" }}>Your score is then displayed on the IOT text display, and stored in the database.</Text>
                    <Text style={{ marginTop: "5px", fontSize: "15px", alignSelf: "center" }}>See Highscores for the top 10 players' scores.</Text>
                    <Text style={{ marginTop: "5px", fontSize: "15px", alignSelf: "center" }}>Use the textbox below to check your own personal Highscore</Text>
                    <A href="http://127.0.0.1:5500/p5/index.html" style={{ marginTop: "10px", padding: "10px", fontSize: "40px", alignSelf: "center", backgroundColor: "white" }}>Play Now</A>
                    <TextInput
                        placeholder="Check your highscore"
                        value={username}
                        // Update state on text change
                        onChangeText={username => setUsername(username)}
                        style={{ marginTop: "10px", fontSize: "20px", alignSelf: "center" }}>    
                    </TextInput>
                    <Text style={{ marginLeft: "10px", padding: "20px", fontSize: "20px", alignSelf: "center" }}>Your Highscore: {highscore}</Text>
                </>}
            <StatusBar style="auto" />
        </View>
    )
}