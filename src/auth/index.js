/* const { SCHEME, HOSTNAME } =
  process.env.NODE_ENV === 'production'
    ? {SCHEME: 'https', HOSTNAME: 'api.maryoku.com'}
    : {SCHEME: 'http', HOSTNAME: process.env.SERVER_URL} */
import store from '../store'

const { HOSTNAME } = { HOSTNAME: process.env.SERVER_URL }

const API_URL = `${HOSTNAME}`
const REGISTRATION_URL = `${API_URL}/1/register`
const REGISTRATION_RSVP_URL = `${API_URL}/1/register-rsvp`
const SESSION_URL = `${API_URL}/api/login`
const FORGOT_PASSWORD_URL = `${API_URL}/1/forgot-password`
const CURRENT_USER_URL = `${API_URL}/1/me`
const CURRENT_TENANT_USER = `${API_URL}/1/userInfo`
const LOGOUT_USER_URL = `${API_URL}/1/logout`

const TOKEN_KEY = 'manage_id_token'

export default {
  user: {
    loading: false,
    authenticated: !!window.localStorage.getItem(TOKEN_KEY),
    me: {}
  },

  login(context, creds, successCallback, errorCallback) {
    context.$http.post(SESSION_URL, creds)
      .then((resp) => {
        this.setToken(resp.data.access_token)

        this.setHeaders(context)

        if (successCallback) {
          successCallback(resp.data)
        }
      }, (resp) => {
        if (errorCallback) {
          errorCallback(resp)
        }
      })
  },

  signupOrSignin(context, userData, successCallback, failedCallback) {
    context.$http.post(`${REGISTRATION_URL}`, userData, { 'ContentType': 'application/json' })
      .then((resp) => {
        successCallback(resp.data)
      }, (resp) => {
        failedCallback(resp)
      })
  },

  clientSignupOrSignin(context, email, password, department, callback) {
    context.$http.post(`${REGISTRATION_URL}`, { username: email, password: password, department: department, role: 'client' }, { 'ContentType': 'application/json' })
      .then((resp) => {
        if (callback) {
          callback(resp.data)
        }
      }, (resp) => {
        context.error = resp.body
      })
  },

  guestSignupOrSignin(context, details, callback) {
    context.$http.post(`${REGISTRATION_RSVP_URL}`, { username: details.email, password: details.password, role: details.role, eventId: details.eventId }, { 'ContentType': 'application/json' })
      .then((resp) => {
        if (callback) {
          callback(resp)
        }
      }, (resp) => {
        context.error = resp.body
        if (callback) {
          callback(resp)
        }
      })
  },

  forgotPassword(context, email, successCallback, errorCallback) {
    context.$http.post(`${FORGOT_PASSWORD_URL}`, { email }, { 'ContentType': 'application/json' }).then((resp) => {
      if (callback) {
        successCallback(resp.data)
      }
    }, (resp) => {
      errorCallback(resp)
    })
  },

  setToken(token) {
    window.localStorage.setItem(TOKEN_KEY, token)
  },

  setHeaders(context) {
    this.user.authenticated = true
    context.$http.defaults.headers.common.Authorization = this.getAuthHeader().Authorization
    // Model.$http.defaults.headers.common.Authorization = this.getAuthHeader().Authorization;
  },

  setTenantHeaders(context) {
    if (context.tenantId) {
      context.$http.defaults.headers.common['gorm-tenantid'] = context.tenantId
      context.$http.defaults.headers.common.gorm_tenantid = context.tenantId
    } else {
      context.$http.defaults.headers.common['gorm-tenantid'] = this.resolveTenantId()
      context.$http.defaults.headers.common.gorm_tenantid = this.resolveTenantId()
    }
    // Model.$http.defaults.headers.common['gorm-tenantid'] = this.resolveTenantId();
    // Model.$http.defaults.headers.common.gorm_tenantid = this.resolveTenantId();
  },

  unsetToken() {
    window.localStorage.removeItem(TOKEN_KEY)
    this.user = {
      authenticated: false
    }
  },
  currentTenantUser(context, required, cb) {
    this.user.loading = true
    this.setTenantHeaders(context)
    let user = context.$ls.get('tenantUser')
    if (user) {
      this.user = user
      this.user.loading = false
    } else {
      this.user.authenticated = false
      this.user.loading = false
    }
    if (!this.user.authenticated || this.user.id === undefined) {
      context.$http.get(CURRENT_TENANT_USER, { maxRedirects: 0, headers: this.getAuthHeader() })
        .then((resp) => {
          console.log(resp.data)
          // store.dispatch('user/getTenantUserFromApi', resp.data)
          // this.tenantUser.id = resp.data.id
          // this.tenantUser.username = resp.data.username
          // this.tenantUser.email = resp.data.email
          // this.tenantUser.name = resp.data.name
          // this.tenantUser.company = resp.data.company
          // this.tenantUser.tenants = resp.data.tenants
          // this.setHeaders(context)
          // context.$ls.set('tenantUser', this.user, 1000 * 60 * 10)
          if (cb !== undefined) {
            cb(resp.data)
          }
          // this.user.loading = false
        })
        .catch(
          (e) => {
            console.error(e)
            this.unsetToken()
            if (required) {
              context.$router.push({ path: '/signin' })
            }
            if (cb) {
              cb()
            }

            this.user.loading = false
          })
    } else {
      this.setHeaders(context)

      if (cb !== undefined) {
        cb()
      }
      this.user.loading = false
    }

  },
  currentUser(context, required, cb) {
    if (this.user.loading) {
      setTimeout(() => {
        this.currentUser(context, required, cb)
      }, 1000)
      return
    }
    this.user.loading = true
    this.setTenantHeaders(context)
    let user = context.$ls.get('user')
    if (user) {
      if (user.me && (user.me.pictureUrl === '' || user.me.pictureUrl === 'none')) {
        user.me.pictureUrl = 'https://static-maryoku.s3.amazonaws.com/storage/img/placeholder.jpg'
        user.avatar = user.me.pictureUrl
      }
      this.user = user
      this.user.loading = false
    } else {
      this.user.authenticated = false
      this.user.loading = false
    }
    if (!this.user.authenticated || this.user.id === undefined) {
      context.$http.get(CURRENT_USER_URL, { maxRedirects: 0, headers: this.getAuthHeader() })
        .then((resp) => {
          // context.user = { username: resp.data.username };
          store.dispatch('user/getUserFromApi', resp.data)
          this.user.id = resp.data.id
          this.user.username = resp.data.username
          this.user.email = resp.data.emailAddress
          this.user.avatar = resp.data.pictureUrl
          this.user.displayName = resp.data.displayName

          this.user.defaultGroupId = resp.data.defaultGroupId
          this.user.defaultCalendarId = resp.data.defaultCalendarId
          this.user.customer = resp.data.customer
          this.user.me = resp.data
          this.user.role = resp.data.role || 'guest'

          this.setHeaders(context)

          context.$ls.set('user', this.user, 1000 * 60 * 10)
          /* if(!resp.data.onboarded){

                      if(resp.data.onboardingPath==="OM"){

                        context.$router.push('/company-form')
                      }else{
                        context.$router.push('/employee-form')
                      }
                    }else{
                      context.$router.push('/company')
                    } */

          if (cb !== undefined) {
            cb()
          }

          this.user.loading = false
        })
        .catch(
          (e) => {
            console.error(e)
            this.unsetToken()
            if (required) {
              context.$router.push({ path: '/signin' })
            }
            if (cb) {
              cb()
            }

            this.user.loading = false
          })
    } else {
      this.setHeaders(context)

      if (cb !== undefined) {
        cb()
      }
      this.user.loading = false
    }
  },

  logout(context, options) {
    context.$http.get(LOGOUT_USER_URL, options)
      .then(data => {
        window.localStorage.removeItem(TOKEN_KEY)
        this.user = {
          authenticated: false
        }
        context.$http.defaults.headers.Authorization = null
        context.$router.push({ path: '/signin' })
      }, error => {
        window.localStorage.removeItem(TOKEN_KEY)
        this.user = {
          authenticated: false
        }
        context.$http.defaults.headers.Authorization = null
        context.$router.push({ path: '/signin' })
      })
  },

  checkAuth() {
    const jwt = window.localStorage.getItem(TOKEN_KEY)
    this.user.authenticated = !!jwt
  },

  getAuthHeader() {
    this.checkAuth()
    if (this.user.authenticated) {
      return {
        Authorization: `Bearer ${this.getToken()}`
      }
    }
    return {}
  },
  getToken() {
    return window.localStorage.getItem(TOKEN_KEY)
  },
  resolveTenantId() {
    let tenantId = document.location.hostname.replace('.dev.maryoku.com', '')
    tenantId = tenantId.replace('.local.maryoku.com', '')
    tenantId = tenantId.replace('.maryoku.com', '')
    if (document.location.hostname.startsWith('app') || document.location.hostname.startsWith('dev')) {
      tenantId = 'DEFAULT'
    }

    return tenantId
  }

}
