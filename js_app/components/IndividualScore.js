import { Card, Text } from 'react-native-paper';

export default function IndividualScore(props) {
  console.log(props.username);
  console.log(props.score);
  return (
    <Card style={{
      marginLeft: 10, marginRight: 10, marginTop: props.i === 0 ? 0 : 10, marginBottom: props.i === props.iMax ? 0 : 10
    }}>
      <Card.Title title={props.username} />
      <Card.Content>
        <Text variant="bodyMedium">{props.score}</Text>
      </Card.Content>
    </Card>
  )
}