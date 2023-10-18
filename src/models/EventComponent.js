import Model from './Model'
import EventComponentProperty from './EventComponentProperty'
import EventComponentTodo from './EventComponentTodo'
import EventComponentValue from './EventComponentValue'
import EventComponentVendor from './EventComponentVendor'
import EventComment from './EventComment'
import EventCommentComponent from './EventCommentComponent'

export default class EventComponent extends Model {
  resource () {
    return 'components'
  }

  componentProperties () {
    return this.hasMany(EventComponentProperty)
  }

  todos () {
    return this.hasMany(EventComponentTodo)
  }

  values () {
    return this.hasMany(EventComponentValue)
  }

  vendors () {
    return this.hasMany(EventComponentVendor)
  }

  commentComponents() {
    return this.hasMany(EventCommentComponent)
  }

  fetch (ctx, force) {
    return new Promise((resolve, reject) => {
      const key = 'events.components'
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
