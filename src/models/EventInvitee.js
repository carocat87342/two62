import Model from './Model'

export default class EventInvitee extends Model {
  resource () {
    return 'invitees'
  }

  static saveInvitees (ctx, event, resource) {
    const key = `event.${event.id}.invitees`
    // ctx.$ls.set(key,resource, Model.DEFAULT_EXPIRATION_MILLIS);
  }

  static fetch (ctx, calendar, event, force) {
    return new Promise((resolve, reject) => {
      const key = `event.${event.id}.invitees`
      if (force) {
        ctx.$ls.remove(key)
      }
      let resource = ctx.$ls.get(key)
      if (!resource) {
        new EventInvitee().for(calendar, event).get().then(res => {
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
