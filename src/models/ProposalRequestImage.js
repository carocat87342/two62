import Model from './Model'
import ProposalRequest from './ProposalRequest'

export default class ProposalRequestImage extends Model {
  resource () {
    return 'images'
  }

  event () {
    return this.belongsTo(ProposalRequest)
  }
}
