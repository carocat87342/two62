import Model from './Model'
import CommunityAsks from './CommunityAsks'

export default class CommunityAnswers extends Model {
  resource () {
    return 'answers'
  }
}
