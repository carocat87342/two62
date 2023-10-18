import Model from './Model'
import CommunityAnswers from './CommunityAnswer'

export default class CommunityAnswer extends Model {
  resource () {
    return 'answers'
  }
}
