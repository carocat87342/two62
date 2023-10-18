import Model from './Model'
import TeamMember from './TeamMember'

export default class Team extends Model {
  resource () {
    return 'teams'
  }

  invite () {

  }

  members () {
    return this.hasMany(TeamMember)
  }

  static save (ctx, team) {
    return new Promise((resolve, reject) => {
      Team.fetch(ctx, false).then(teams => {
        new Team(team).save().then(res => {
          teams.push(res.item)
          // ctx.$ls.set("teams",teams, Model.DEFAULT_EXPIRATION_MILLIS);
          resolve(res.item)
        })
      })
    })
  }

  static fetch (ctx, force) {
    return new Promise((resolve, reject) => {
      const key = 'teams'
      if (force) {
        ctx.$ls.remove(key)
      }
      let resource = ctx.$ls.get(key)
      if (!resource) {
        new Team().get().then(res => {
          // ctx.$ls.set(key,res, Model.DEFAULT_EXPIRATION_MILLIS);
          resolve(res)
        })
      } else {
        // ctx.$ls.set("teams",resource, Model.DEFAULT_EXPIRATION_MILLIS);
        resolve(resource)
      }
    })
  }
}
