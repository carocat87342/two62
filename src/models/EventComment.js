import Model from './Model'
import EventComponentProperty from './EventComponentProperty'
import EventComponentTodo from './EventComponentTodo'
import EventComponentValue from './EventComponentValue'
import EventComponentVendor from './EventComponentVendor'

export default class EventComment extends Model {
  resource () {
    return 'comments'
  }
}