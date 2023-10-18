import Model from './Model'
import ProposalRequestComment from './ProposalRequestComment'

export default class ProposalRequestRequirement extends Model {
  resource() {
    return 'requirements'
  }

  comments() {
    return this.hasMany(ProposalRequestComment)
  }
}
