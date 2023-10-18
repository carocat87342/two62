import Model from './Model'
import ProposalRequest from './ProposalRequest'

export default class ProposalRequestFile extends Model {
  resource () {
    return 'files'
  }

  event () {
    return this.belongsTo(ProposalRequest)
  }
}
