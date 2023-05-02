import { ScrollView } from "react-native";
import IndividualScore from './IndividualScore';

export default function Scores(props) {
    return (
        <ScrollView style={{ margin: 10 }}>
          {props.scores.map((el, i) =>
            <IndividualScore key={i} message={el} iMax={props.scores.length} i={i}></IndividualScore>
          )}
        </ScrollView>
    )
}