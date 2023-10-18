import { Model as BaseModel } from 'vue-api-query'
import authHeader from '@/services/auth-header'

export default class Model extends BaseModel {
  Constructor () {
    Object.freeze({DEFAULT_EXPIRATION_MILLIS: 1000 * 60 * 10}) // 10 minutes
  }

  // define a base url for a REST API
  baseURL () {
    return `${process.env.SERVER_URL}/1`
  }

  // implement a default request method
  request (config) {
    return this.$http.request(config)
  }
}
