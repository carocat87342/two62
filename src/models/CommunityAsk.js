import Model from './Model'
import CommunityAnswer from './CommunityAnswer'

export default class CommunityAsk extends Model {
  resource () {
    return 'asks'
  }

  answers () {
    return this.hasMany(CommunityAnswer)
  }
}
