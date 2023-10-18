import Model from './Model'

export default class Currency extends Model {
  resource () {
    return 'currencies'
  }

  fetch (ctx, force) {
    return new Promise((resolve, reject) => {
      const key = 'calendar.currencies'
      if (force) {
        ctx.$ls.remove(key)
      }
      let resource = ctx.$ls.get(key)
      if (!resource) {
        this.get().then(res => {
          ctx.$ls.set(key, res, Model.DEFAULT_EXPIRATION_MILLIS)
          resolve(res)
        })
      } else {
        ctx.$ls.set(key, resource, Model.DEFAULT_EXPIRATION_MILLIS)
        resolve(resource)
      }
    })
  }
}
