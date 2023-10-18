import Model from './Model'

export default class TenantUser extends Model {
  constructor(email = '', password = '', name = '', company = '', role = '', tenant = '') {
    super()
    this.email = email;
    this.password = password;
    this.name = name;
    this.company = company;
    this.role = role;
    this.tenant = tenant
  }
  resource() {
    return 'tokens'
  }
}
