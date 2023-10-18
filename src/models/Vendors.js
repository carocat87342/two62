import Model from './Model'
import VendorCategories from './VendorCategories'
import ProposalRequest from './ProposalRequest'

export default class Vendors extends Model {
  resource () {
    return 'vendors'
  }

  categories () {
    return this.hasMany(VendorCategories)
  }

  proposalRequests () {
    return this.hasMany(ProposalRequest)
  }
}
