import Model from './Model'
import CalendarEvent from './CalendarEvent'

export default class CalendarEventInspiration extends Model {
  resource () {
    return 'inspirations'
  }

  event () {
    return this.belongsTo(CalendarEvent)
  }
}
