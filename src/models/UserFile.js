import Model from './Model'

export default class UserFile extends Model {
  resource () {
    return 'me/files'
  }
}
