import Model from './Model'
import CalendarEventInspiration from './CalendarEventInspiration'
import CalendarEventImage from './CalendarEventImage'
import EventTimelineItem from './EventTimelineItem'
import EventInteraction from './EventInteraction'

export default class CalendarEvent extends Model {
  resource () {
    return 'events'
  }

  components () {
    return this.components
  }
  eventImages () {
    return this.hasMany(CalendarEventImage)
  }

  inspirations () {
    return this.hasMany(CalendarEventInspiration)
  }

  timelineItems () {
    return this.hasMany(EventTimelineItem)
  }

  interactions () {
    return this.hasMany(EventInteraction)
  }

  fetch (ctx, force) {
    return new Promise((resolve, reject) => {
      const key = 'events.list'
      if (force) {
        ctx.$ls.remove(key)
      }
      let resource = ctx.$ls.get(key)
      if (!resource) {
        this.get().then(res => {
          ctx.$ls.set(key, res, Model.DEFAULT_EXPIRATION_MILLIS)
          resolve(res)
        }).catch(e=>{
        })
      } else {
        ctx.$ls.set(key, resource, Model.DEFAULT_EXPIRATION_MILLIS)
        resolve(resource)
      }
    })
  }
}
