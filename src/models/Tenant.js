import Model from './Model'

export default class Tenant extends Model {
  resource () {
    return 'tenants'
  }
}
