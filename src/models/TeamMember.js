import Model from './Model'

export default class TeamMember extends Model {
  resource () {
    return 'members'
  }

  static fetch (ctx, force) {
    return new Promise((resolve, reject) => {
      const key = 'teams.allMembers'
      if (force) {
        ctx.$ls.remove(key)
      }
      let resource = ctx.$ls.get(key)
      if (!resource) {
        new TeamMember().get().then(res => {
          // ctx.$ls.set(key,res, Model.DEFAULT_EXPIRATION_MILLIS);
          resolve(res)
        })
      } else {
        // ctx.$ls.set(key,resource, Model.DEFAULT_EXPIRATION_MILLIS);
        resolve(resource)
      }
    })
  }
}
