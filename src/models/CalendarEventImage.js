import Model from './Model'
import CalendarEvent from './CalendarEvent'

export default class CalendarEventImage extends Model {
  resource () {
    return 'images'
  }

  event () {
    return this.belongsTo(CalendarEvent)
  }
}
