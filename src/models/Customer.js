import Model from './Model'
import CustomerStatistics from './CustomerStatistics'

export default class Customer extends Model {
  resource () {
    return 'customers'
  }

  statistics () {
    return this.hasMany(CustomerStatistics)
  }
}
