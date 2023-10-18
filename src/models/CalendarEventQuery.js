import Model from './Model'

export default class CalendarEventQuery extends Model {
  resource () {
    return 'events?q='
  }
}
