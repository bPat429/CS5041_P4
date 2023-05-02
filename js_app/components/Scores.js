import { ScrollView } from "react-native";
import IndividualScore from './IndividualScore';

export default function Scores(props) {
    let scores_dict = {};
    const val_pattern = /\d+$/;
    const string_pattern = /(,\sScore:\s)/;
    if (props.scores) {
      for (const score in props.scores) {
        let score_string = props.scores[score];
        const val = parseInt(val_pattern.exec(score_string)[0]);
        console.log(val);
        console.log(score_string);
        console.log(score_string.search(string_pattern));
        const name = score_string.slice(0, score_string.search(string_pattern));
        console.log(name);
        if (name in scores_dict) {
          scores_dict[name] = (scores_dict[name] < val) ? val : scores_dict[name];
        } else {
          scores_dict[name] = val;
        }
      }
      const sorted_names = Object.keys(scores_dict).sort(function(a, b){return scores_dict[b] - scores_dict[a]});
      // Get top 10 scorers of the array
      const high_scores = sorted_names.slice(0, 10);
      console.log(scores_dict);
      console.log(high_scores);
    }

    return (
        <ScrollView style={{ margin: 10 }}>
          {props.scores.map((el, i) =>
            <IndividualScore key={i} message={el} iMax={props.scores.length} i={i}></IndividualScore>
          )}
        </ScrollView>
    )
}