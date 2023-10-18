import Model from './Model'

import CommunityAsk from './CommunityAsk'

export default class CommunityGroup extends Model {
  resource () {
    return 'communityGroups'
  }

  asks () {
    return this.hasMany(CommunityAsk)
  }
}
