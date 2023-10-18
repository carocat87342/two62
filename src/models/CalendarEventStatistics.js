import Model from './Model'
import CalendarEvent from './CalendarEvent'

export default class CalendarEventStatistics extends Model {
  resource () {
    return 'statistics'
  }

  event () {
    return this.belongsTo(CalendarEvent)
  }
}
