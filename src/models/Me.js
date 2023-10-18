import Model from './Model'
import TeamMember from './TeamMember'

export default class Me extends Model {
  resource () {
    return 'me'
  }

  customer () {
    return this['customer']
  }
}
