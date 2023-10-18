import Model from './Model'

export default class EventComponentProperty extends Model {
  resource () {
    return 'properties'
  }

  asMenuOption () {
    let menuOption = {
      id: this.id,
      title: this.title
    }

    return menuOption
  }
}
