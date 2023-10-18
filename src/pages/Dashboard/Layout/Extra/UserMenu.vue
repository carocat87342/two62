<template>
  <div class="user">
    <div class="photo">
      <img :src="avatar" alt="avatar" />
    </div>
    <div class="user-info">
      <a
        data-toggle="collapse"
        :aria-expanded="!isClosed"
        @click.stop="toggleMenu"
        @click.capture="clicked"
      >
        <span v-if="$route.meta.rtlActive">
          {{rtlTitle}}
          <b class="caret"></b>
        </span>
        <span v-else>
          {{title}}
          <b class="caret"></b>
        </span>
      </a>

      <collapse-transition>
        <div v-show="!isClosed">
          <ul class="nav">
            <slot>
              <li>
                <a v-if="$route.meta.rtlActive" href="#vue">
                  <span class="sidebar-mini">مع</span>
                  <span class="sidebar-normal">ملف</span>
                </a>
                <a v-else @click="gotoMyProfile">
                  <span class="sidebar-mini">
                    <md-icon>assignment_ind</md-icon>
                  </span>
                  <span class="sidebar-normal">My Profile</span>
                </a>
              </li>
              <!--<li>
                    <a v-if="$route.meta.rtlActive" href="#vue">
                      <span class="sidebar-mini">هوع</span>
                      <span class="sidebar-normal">تعديل الملف الشخصي</span>
                    </a>
                    <a v-else href="#vue">
                      <span class="sidebar-mini">EP</span>
                      <span class="sidebar-normal">Edit Profile</span>
                    </a>
              </li>-->
              <li>
                <a v-if="$route.meta.rtlActive" href="#vue">
                  <span class="sidebar-mini">و</span>
                  <span class="sidebar-normal">إعدادات</span>
                </a>
                <a v-else @click="signout">
                  <span class="sidebar-mini">
                    <md-icon>exit_to_app</md-icon>
                  </span>
                  <span class="sidebar-normal">Sign Out</span>
                </a>
              </li>
            </slot>
          </ul>
        </div>
      </collapse-transition>
    </div>
  </div>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";
// import auth from 'src/auth';

export default {
  components: {
    CollapseTransition,
  },
  props: {
    title: {
      type: String,
      default: "Tania Andrew",
    },
    rtlTitle: {
      type: String,
      default: "تانيا أندرو",
    },
    avatar: {
      type: String,
      default:
        "https://static-maryoku.s3.amazonaws.com/storage/img/faces/avatar.jpg",
    },
  },
  data() {
    return {
      isClosed: true,
      auth,
    };
  },
  methods: {
    clicked: function (e) {
      e.preventDefault();
    },
    toggleMenu: function () {
      this.isClosed = !this.isClosed;
    },
    signout(e) {
      this.$auth.logout(this);
    },
    gotoMyProfile() {
      // this.$router.push('/pages/user');
      this.$router.push("/employee-form");
    },
  },
};
</script>
<style>
.collapsed {
  transition: opacity 1s;
}
</style>
