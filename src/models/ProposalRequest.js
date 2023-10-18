import Model from './Model'
import ProposalRequestComment from './ProposalRequestComment'
import ProposalRequestRequirement from './ProposalRequestRequirement'

export default class ProposalRequest extends Model {
  resource () {
    return 'proposal-requests'
  }

  comments () {
    return this.hasMany(ProposalRequestComment)
  }

  requirements () {
    return this.hasMany(ProposalRequestRequirement)
  }
}
