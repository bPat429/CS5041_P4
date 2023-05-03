import { ScrollView } from "react-native";
import IndividualScore from './IndividualScore';
import { useState, React, useEffect } from "react";

export default function Scores(props) {
    let scores_dict = {};
    const val_pattern = /\d+$/;
    const string_pattern = /(,\sScore:\s)/;

    const [sorted_names, setSortedNames] = useState([]);
    const [sorted_scores, setSortedScores] = useState([]);

    useEffect(() => {
      if (props.scores) {
        for (const score in props.scores) {
          let score_string = props.scores[score];
          const val = parseInt(val_pattern.exec(score_string)[0]);
          const name = score_string.slice(0, score_string.search(string_pattern));
          if (name in scores_dict) {
            scores_dict[name] = (scores_dict[name] < val) ? val : scores_dict[name];
          } else {
            scores_dict[name] = val;
          }
        }
        // Get top 10 scorers of the array
        const names = Object.keys(scores_dict).sort(function(a, b){return scores_dict[b] - scores_dict[a]}).slice(0,10);
        // Get a list of their corresponding scores
        let scores = [];
        names.forEach(function (i) {
          scores.push(scores_dict[i]);
        });
        setSortedScores(scores);
        setSortedNames(names);
      }
    }, [props])

    return (
        <ScrollView style={{ margin: 10 }}>
          {(sorted_names && sorted_scores) ? sorted_names.map((name, i) =>
            <IndividualScore key={i} score={sorted_scores[i]} username={name} iMax={sorted_names.length} i={i}></IndividualScore>
          ) : null}
        </ScrollView>
    )
}