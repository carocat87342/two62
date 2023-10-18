import Vue from "vue";
import VueRouter from "vue-router";
import axios from "axios";
import VueAxios from "vue-axios";
import { Model } from "vue-api-query";

import VueElementLoading from "vue-element-loading";
import Chartist from "chartist";
import ChartistTooltipPlugin from "chartist-plugin-tooltip";
import vSelectMenu from "v-selectmenu";
import vueNumeralFilterInstaller from "vue-numeral-filter";
import VueGmaps from "vue-gmaps";
import VueLazyLoad from "vue-lazyload";
// import VuePhoneNumberInput from "vue-phone-number-input";
// import "vue-phone-number-input/dist/vue-phone-number-input.css";
import VTooltip from "v-tooltip";
import VueGtm from "vue-gtm";
import VueSlideoutPanel from "src/components/SlidePanel";
import Tawk from "vue-tawk";
import VueCookies from "vue-cookies";
import { VueStars } from "vue-stars";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import lsWatcher from "vue-storage-watcher";
import VueTour from "vue-tour";
import VueSwal from "vue-swal";
import VueTimeago from "vue-timeago";
import VueClipboard from "vue-clipboard2";
import VueTimepicker from "vue2-timepicker";
import vueSignature from "vue-signature";
import VueInputAutowidth from "vue-input-autowidth";

import money from "v-money";

import App from "./App.vue";
import DashboardPlugin from "./material-dashboard";
import auth from "./auth";
// router setup
import routes from "./router/routes";
// store setup
import store from "./store";

import { IconURL, SecondIconURL, StorageURL, ResourceURL, UploadURL } from "./globalVariables";

import authHeader from "@/services/auth-header";
import authService from "@/services/auth.service";

import "./assets/scss/main.scss";
import dateUtil from "./utils/date.util";
import stringUtil from "./utils/string.util"
import VueYoutube from "vue-youtube";

import helper from "@/utils/helperFunction";
import moment from "moment";
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

Vue.component('v-select', vSelect)
require("vue-tour/dist/vue-tour.css");

const VueScrollTo = require("vue-scrollto");
window.$ = window.jQuery = require("jquery");

// plugin setup
Vue.use(VueRouter);
Vue.use(DashboardPlugin);
Vue.use(VueTour);
Vue.use(VueSwal);
Vue.use(VueLazyLoad);
Vue.use(VueGmaps, {
  key: process.env.GOOGLE_API_KEY || "AIzaSyAelc-zmvKBlcW78yPFeW9xrbnrJaT-MfA",
  libraries: ["places"],
});
Vue.use(VueScrollTo);
Vue.use(VueYoutube);
VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

Vue.use(VueTimeago, {
  name: "Timeago", // Component name, `Timeago` by default
  locale: "en", // Default locale
  locales: {
    "zh-CN": require("date-fns/locale/zh_cn"),
    ja: require("date-fns/locale/ja"),
  },
});
Vue.use(VueTimepicker);
Vue.use(vueSignature);
Vue.use(money, { precision: 4 });
Vue.use(VueInputAutowidth);
// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: "nav-item active",
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (window.currentPanel) {
    window.currentPanel.hide();
    window.currentPanel = null;
  }

  if (!to.meta.requiresAuth) {
    axios.defaults.headers.common.Authorization = "";
  } else {
    axios.defaults.headers.common.Authorization = authHeader().Authorization;
  }
  const currentToken = localStorage.getItem("manage_id_token");

  // check home router
  if (to.path === "/" && currentToken) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.currentUserType === "vendor") {
      next("/vendor/profile/settings");
    } else if (user.currentUserType === 'guest') {
      next("/signedIn");
    } else {
      if (user.currentTenant && user.tenants.indexOf(user.currentTenant) >= 0) {
        next("/signedIn");
      } else if (user.tenants.length === 0) {
        next("/create-event-wizard");
      } else if (user.tenants.length > 0) {
        next("/choose-workspace");
      } else {
        next("/error");
      }
    }
  } else if (to.path === "/" && !currentToken) {
    next("/signin");
  } else if (to.path === "/vendor" && !currentToken) {
    next("/vendor/signin");
  }
  if (to.meta.requiresAuth && !currentToken) {
    if (to.meta.isVendor || to.path.startsWith("/vendor")) {
      next("/vendor/signin");
    } else {
      next("/signin");
    }
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  window.document.title = `${to.meta.title ? to.meta.title : to.name} @ maryoku`;
});

// global library setup
Object.defineProperty(Vue.prototype, "$Chartist", {
  get() {
    return this.$root.Chartist;
  },
});

// global library setup
Object.defineProperty(Vue.prototype, "$authService", {
  get() {
    return authService;
  },
});

/* axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response.status === 401 && router.currentRoute.path != "/signin") {
    return router.push({ path: '/signin' })
  }
  return Promise.reject(error);
}); */

Vue.use(VueAxios, axios);
Vue.use(require("vue-moment"));
Vue.use(VTooltip);
Vue.use(vSelectMenu, { language: "en" });
Vue.use(vueNumeralFilterInstaller, { locale: "en-gb" });

Vue.use(lsWatcher, { prefix: "two62_" });

Vue.component("vue-stars", VueStars);
Vue.component("vue-element-loading", VueElementLoading);
Vue.component("multiselect", Multiselect);

Vue.use(VueGtm, {
  id: "GTM-5FH68TF", // Your GTM ID
  enabled: process.env.NODE_ENV === "production", // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
  debug: process.env.NODE_ENV !== "production", // Whether or not display console logs debugs (optional)
  vueRouter: router, // Pass the router instance to automatically sync with router (optional)
  ignoredViews: [], // If router, you can exclude some routes name (case insensitive) (optional)
});

Vue.use(VueSlideoutPanel);

if (process.env.NODE_ENV === "production") {
  Vue.use(Tawk, {
    tawkSrc: "https://embed.tawk.to/5cd93e082846b90c57ae3644/default",
    enabled: true,
  });
}

Vue.use(VueCookies);

Vue.directive("focus", {
  inserted: function (el) {
    el.focus();
  },
});

Vue.directive("select-all", {
  inserted: function (el) {
    el.setSelectionRange(el.value.length, el.value.length);
  },
});

// Vue.directive('click-outside', {
//   bind () {
//       this.event = event => this.vm.$emit(this.expression, event)
//       this.el.addEventListener('click', this.stopProp)
//       document.body.addEventListener('click', this.event)
//   },
//   unbind() {
//     this.el.removeEventListener('click', this.stopProp)
//     document.body.removeEventListener('click', this.event)
//   },

//   stopProp(event) { event.stopPropagation() }
// })

Vue.filter("withComma", function (value, type = null) {
  if (typeof value == 'string') {
    value = Number(value)
  }
  return value ? type != Number ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) :
    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;

});
Vue.filter("formatQty", function (value) {
  if (!value) return ""
  if (typeof value == 'string') {
    value = Number(value)
  }
  return value ? value.toLocaleString() : 0;

});
Vue.filter('date', function (value, format) {
  if (!value) return ""

  return moment(value).format(format);
})

Vue.prototype.$resourceURL = ResourceURL;
Vue.prototype.$storageURL = StorageURL;
Vue.prototype.$iconURL = IconURL;
Vue.prototype.$secondIconURL = SecondIconURL;
Vue.prototype.$uploadURL = UploadURL;
Vue.prototype.$queryEventActions = { planner: "plannerEvent", guest: "guestEvent" };
axios.defaults.headers.common.Authorization = authHeader().Authorization;
axios.defaults.headers.common["gorm-tenantid"] = authService.resolveTenantId();
axios.defaults.headers.common.gorm_tenantid = authService.resolveTenantId();
Model.$http = axios;

axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  // console.log(response)
  return response;
}, function (error) {
  return Promise.reject(error);
});


Number.prototype.padStart = function (size, theChar) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

String.prototype.padStart = function (size, theChar) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = theChar + s;
  }
  return s;
};

Object.defineProperty(Vue.prototype, "$auth", {
  get() {
    return auth;
  },
});
Object.defineProperty(Vue.prototype, "$dateUtil", {
  get() {
    return dateUtil;
  },
});
Object.defineProperty(Vue.prototype, "$stringUtil", {
  get() {
    return stringUtil;
  }
});
Object.defineProperty(Vue.prototype, "$helper", {
  get() {
    return helper;
  },
});
Object.defineProperty(Vue.prototype, "$authHeader", {
  get() {
    return authHeader().Authorization;
  },
});

store.dispatch("common/fetchAllCategories");
Vue.mixin({
  data: () => ({
    windowWidth: 0,
    windowHeight: 0,
  }),
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    },
  },
});

new Vue({
  el: "#app",
  render: h => h(App),
  router,
  store,
  data: () => ({
    Chartist: Chartist,
  }),
});
