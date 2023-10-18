import Model from './Model'
import CalendarEvent from './CalendarEvent'

export default class CompanyLogoImage extends Model {
  resource () {
    return 'customerFiles'
  }

//   event() {
//     return this.belongsTo(CalendarEvent)
//   }
}
