import { Card } from 'react-native-paper';

export default function IndividualScore(props) {
  return (
    <Card style={{
      marginLeft: 10, marginRight: 10, marginTop: props.i === 0 ? 0 : 10, marginBottom: props.i === props.iMax ? 0 : 10
    }}>
      <Card.Title title={props.message} />
    </Card>
  )
}