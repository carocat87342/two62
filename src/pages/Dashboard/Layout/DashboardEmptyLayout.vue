<template>
  <div class="wrapper" :class="[{ 'nav-open': $sidebar.showSidebar }, { rtl: $route.meta.rtlActive }]">
    <notifications></notifications>
    <side-bar>
      <!--<user-menu></user-menu>-->
      <mobile-menu></mobile-menu>
      <template slot="links">
        <!--<sidebar-item :link="{name: 'Me', icon: 'person_pin', path: '/me'}">
        </sidebar-item>-->

        <!--<sidebar-item :link="{name: 'My Company', icon: 'fingerprint', path: '/my-company'}">
          <sidebar-item :link="{name: 'Dashboard', icon: 'dashboard', path: '/my-company/dashboard'}"></sidebar-item>
          <sidebar-item :link="{name: 'Edit Company Profile', icon: 'dashboard', path: '/my-company/company-profile'}"></sidebar-item>
          <sidebar-item :link="{name: 'Approvals & Sign Off', icon: 'dashboard', path: '/my-company/approvals'}"></sidebar-item>
          <sidebar-item :link="{name: 'Billing', icon: 'dashboard', path: '/my-company/billing'}"></sidebar-item>
          <sidebar-item :link="{name: 'Settings', icon: 'settings', path: '/my-company/company-settings'}"></sidebar-item>
        </sidebar-item>-->

        <!--<sidebar-item :link="{name: 'Community', icon: 'people', path: '/community-new'}">
        </sidebar-item>-->
        <sidebar-item :link="{ name: 'Annual Planner', icon: 'key', path: '/planner' }"> </sidebar-item>

        <sidebar-item :link="{ name: 'Yearly Planner', icon: 'event', path: '/yearly-plan' }"> </sidebar-item>

        <sidebar-item :link="{ name: 'Our Events', icon: 'local_play', path: '/events' }"> </sidebar-item>

        <sidebar-item :link="{ name: 'My Vendors', icon: 'contacts', path: '/vendors' }"> </sidebar-item>

        <li class="menu-divider"></li>

        <sidebar-item :link="{ name: 'Team', icon: 'group_add', path: '/team' }"> </sidebar-item>

        <!--<li class="menu-divider"></li>

        <sidebar-item :link="{name: 'Proposals', icon: 'local_offer', path: '/proposals'}">
        </sidebar-item>

        <sidebar-item :link="{name: 'Notes', icon: 'speaker_notes', path: '/notes'}">
        </sidebar-item>-->

        <!--<sidebar-item v-if="$route.meta.rtlActive" :link="{name: 'لوحة القيادةة', icon: 'dashboard', path: '/dashboard'}">
        </sidebar-item>
        <sidebar-item v-else :link="{name: 'Dashboard', icon: 'dashboard', path: '/dashboard'}">
        </sidebar-item>
        <sidebar-item v-if="$route.meta.rtlActive" :link="{name: 'صفحات', icon: 'image'}">
          <sidebar-item :link="{name: 'التسعير', path: '/pricing'}"></sidebar-item>
          <sidebar-item :link="{name: 'دعم رتل', path: '/pages/rtl'}"></sidebar-item>
          <sidebar-item :link="{name: 'الجدول الزمني', path: '/pages/timeline'}"></sidebar-item>
          <sidebar-item :link="{name: 'صفحة تسجيل الدخول', path: '/login'}"></sidebar-item>
          <sidebar-item :link="{name: 'سجل الصفحة', path: '/register'}"></sidebar-item>
          <sidebar-item :link="{name: 'قفل صفحة الشاشة', path: '/lock'}"></sidebar-item>
          <sidebar-item :link="{name: 'ملف تعريفي للمستخدم', path: '/pages/user'}"></sidebar-item>
        </sidebar-item>
        <sidebar-item v-else :link="{name: 'Pages', icon: 'image'}">
          <sidebar-item :link="{name: 'Pricing', path: '/pricing'}"></sidebar-item>
          <sidebar-item :link="{name: 'RTL Support', path: '/pages/rtl'}"></sidebar-item>
          <sidebar-item :link="{name: 'Timeline', path: '/pages/timeline'}"></sidebar-item>
          <sidebar-item :link="{name: 'Login', path: '/login'}"></sidebar-item>
          <sidebar-item :link="{name: 'Register', path: '/register'}"></sidebar-item>
          <sidebar-item :link="{name: 'Lock Screen', path: '/lock'}"></sidebar-item>
          <sidebar-item :link="{name: 'User Profile', path: '/pages/user'}"></sidebar-item>
        </sidebar-item>
        <sidebar-item v-if="$route.meta.rtlActive" :link="{name: 'المكونات', icon: 'apps'}">
          <sidebar-item :link="{name: 'وصفتت', path: '/components/buttons'}"></sidebar-item>
          <sidebar-item :link="{name: 'نظام الشبكةو', path: '/components/grid-system'}"></sidebar-item>
          <sidebar-item :link="{name: 'لوحات', path: '/components/panels'}"></sidebar-item>
          <sidebar-item :link="{name: 'التنبيه الحلو', path: '/components/sweet-alert'}"></sidebar-item>
          <sidebar-item :link="{name: 'إخطارات', path: '/components/notifications'}"></sidebar-item>
          <sidebar-item :link="{name: 'الرموز', path: '/components/icons'}"></sidebar-item>
          <sidebar-item :link="{name: 'طباعة', path: '/components/typography'}"></sidebar-item>
        </sidebar-item>
        <sidebar-item v-else :link="{name: 'Components', icon: 'apps'}">
          <sidebar-item :link="{name: 'Buttons', path: '/components/buttons'}"></sidebar-item>
          <sidebar-item :link="{name: 'Grid System', path: '/components/grid-system'}"></sidebar-item>
          <sidebar-item :link="{name: 'Panels', path: '/components/panels'}"></sidebar-item>
          <sidebar-item :link="{name: 'Sweet Alert', path: '/components/sweet-alert'}"></sidebar-item>
          <sidebar-item :link="{name: 'Notifications', path: '/components/notifications'}"></sidebar-item>
          <sidebar-item :link="{name: 'Icons', path: '/components/icons'}"></sidebar-item>
          <sidebar-item :link="{name: 'Typography', path: '/components/typography'}"></sidebar-item>
        </sidebar-item>
        <sidebar-item v-if="$route.meta.rtlActive" :link="{name: 'إستمارات', icon: 'content_paste'}">
          <sidebar-item :link="{name: 'أشكال منتظمة', path: '/forms/regular'}"></sidebar-item>
          <sidebar-item :link="{name: 'أشكال موسعة', path: '/forms/extended'}"></sidebar-item>
          <sidebar-item :link="{name: 'نماذج التحقق', path: '/forms/validation'}"></sidebar-item>
          <sidebar-item :link="{name: 'ساحر', path: '/forms/wizard'}"></sidebar-item>
        </sidebar-item>
        <sidebar-item v-else :link="{name: 'Forms', icon: 'content_paste'}">
          <sidebar-item :link="{name: 'Regular Forms', path: '/forms/regular'}"></sidebar-item>
          <sidebar-item :link="{name: 'Extended Forms', path: '/forms/extended'}"></sidebar-item>
          <sidebar-item :link="{name: 'Validation Forms', path: '/forms/validation'}"></sidebar-item>
          <sidebar-item :link="{name: 'Wizard', path: '/forms/wizard'}"></sidebar-item>
        </sidebar-item>
        <sidebar-item v-if="$route.meta.rtlActive" :link="{name: 'الجداول', icon: 'grid_on'}">
          <sidebar-item :link="{name: 'الجداول العادية', path: '/table-list/regular'}"></sidebar-item>
          <sidebar-item :link="{name: 'الجداول الموسعة', path: '/table-list/extended'}"></sidebar-item>
          <sidebar-item :link="{name: 'جداول البيانات صافي', path: '/table-list/paginated'}"></sidebar-item>
        </sidebar-item>
        <sidebar-item v-else :link="{name: 'Tables', icon: 'grid_on'}">
          <sidebar-item :link="{name: 'Regular Tables', path: '/table-list/regular'}"></sidebar-item>
          <sidebar-item :link="{name: 'Extended Tables', path: '/table-list/extended'}"></sidebar-item>
          <sidebar-item :link="{name: 'Paginated Tables', path: '/table-list/paginated'}"></sidebar-item>
        </sidebar-item>
        <sidebar-item v-if="$route.meta.rtlActive" :link="{name: 'خرائط', icon: 'place'}">
          <sidebar-item :link="{name: 'خرائط جوجل', path: '/maps/google'}"></sidebar-item>
          <sidebar-item :link="{name: 'خريطة كاملة الشاشة', path: '/maps/full-screen'}"></sidebar-item>
          <sidebar-item :link="{name: 'سهم التوجيه، الخريطة', path: '/maps/vector-map'}"></sidebar-item>
        </sidebar-item>
        <sidebar-item v-else :link="{name: 'Maps', icon: 'place'}">
          <sidebar-item :link="{name: 'Google Maps', path: '/maps/google'}"></sidebar-item>
          <sidebar-item :link="{name: 'Full Screen Maps', path: '/maps/full-screen'}"></sidebar-item>
          <sidebar-item :link="{name: 'Vector Maps', path: '/maps/vector-map'}"></sidebar-item>
        </sidebar-item>
        <sidebar-item
          v-if="$route.meta.rtlActive"
          :link="{name: 'الحاجيات', icon: 'widgets', path: '/widgets'}"></sidebar-item>
        <sidebar-item
          v-else
          :link="{name: 'Widgets', icon: 'widgets', path: '/widgets'}"></sidebar-item>
        <sidebar-item
          v-if="$route.meta.rtlActive"
          :link="{name: 'الرسوم البيانية', icon: 'timeline', path: '/charts'}"></sidebar-item>
        <sidebar-item
          v-else
          :link="{name: 'Charts', icon: 'timeline', path: '/charts'}"></sidebar-item>
        <sidebar-item
          v-if="$route.meta.rtlActive"
          :link="{name: 'التقويم', icon: 'date_range', path: '/calendar'}"></sidebar-item>
        <sidebar-item
          v-else
          :link="{name: 'Calendar', icon: 'date_range', path: '/calendar'}"></sidebar-item>-->
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <div :class="{ content: !$route.meta.hideContent }" @click="toggleSidebar">
        <zoom-center-transition :duration="200" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </zoom-center-transition>
      </div>
      <!--<content-footer v-if="!$route.meta.hideFooter"></content-footer>-->
    </div>
  </div>
</template>
<script>
/* eslint-disable no-new */
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import MobileMenu from "./Extra/MobileMenu.vue";
import UserMenu from "./Extra/UserMenu.vue";
import { ZoomCenterTransition } from "vue2-transitions";

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}
// import auth from "src/auth";

export default {
  components: {
    TopNavbar,
    ContentFooter,
    MobileMenu,
    UserMenu,
    ZoomCenterTransition,
  },
  data() {
    return {
      auth: auth,
    };
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
  mounted() {
    this.$auth.currentUser(this, true, function () {
      let docClasses = document.body.classList;
      let isWindows = navigator.platform.startsWith("Win");
      if (isWindows) {
        // if we are on windows OS we activate the perfectScrollbar function
        initScrollbar("sidebar");
        initScrollbar("sidebar-wrapper");
        initScrollbar("main-panel");

        docClasses.add("perfect-scrollbar-on");
      } else {
        docClasses.add("perfect-scrollbar-off");
      }
    });
  },
};
</script>
<style lang="scss">
.menu-divider {
  height: 1px;
  margin-top: 10px;
  background-color: rgba(0, 0, 0, 0.12);
}
$scaleSize: 0.95;
@keyframes zoomIn95 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  to {
    opacity: 1;
  }
}
.main-panel .zoomIn {
  animation-name: zoomIn95;
}
@keyframes zoomOut95 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}
.main-panel .zoomOut {
  animation-name: zoomOut95;
}
</style>
