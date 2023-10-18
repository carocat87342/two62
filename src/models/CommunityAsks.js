import Model from './Model'
import CommunityAnswers from './CommunityAnswers'

export default class CommunityAsks extends Model {
  resource () {
    return 'asks'
  }

  answers () {
    return this.hasMany(CommunityAnswers)
  }
}
