import Model from './Model'
import CalendarYear from './CalendarYear'
import CalendarEventType from './CalendarEventType'
import CalendarCountry from './CalendarCountry'
import CalendarHoliday from './CalendarHoliday'

export default class CalendarMetadata extends Model {
  resource () {
    return 'metadata'
  }

  years () {
    return this.years
  }

  eventTypes () {
    return this.eventTypes
  }

  countries () {
    return this.countries
  }

  holidays () {
    return this.holidays
  }
}
