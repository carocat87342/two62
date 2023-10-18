<template>
  <div class>
    <zoom-center-transition :duration="pageTransitionDuration" mode="out-in">
      <router-view></router-view>
    </zoom-center-transition>
  </div>
</template>
<script>
import { ZoomCenterTransition } from "vue2-transitions";

export default {
  components: {
    ZoomCenterTransition,
  },
  props: {
    backgroundColor: {
      type: String,
      default: "black",
    },
  },
  inject: {
    autoClose: {
      default: true,
    },
  },
  data() {
    return {
      responsive: false,
      showMenu: false,
      menuTransitionDuration: 250,
      pageTransitionDuration: 300,
      year: new Date().getFullYear(),
    };
  },
  computed: {
    setBgImage() {
      let images = {
        Pricing:
          "https://static-maryoku.s3.amazonaws.com/storage/img/bg-pricing.jpg",
        Login:
          "https://static-maryoku.s3.amazonaws.com/storage/img/shutterstock_495639391.png",
        Register:
          "https://static-maryoku.s3.amazonaws.com/storage/img/shutterstock_495639391.png",
        SignIn:
          "https://static-maryoku.s3.amazonaws.com/storage/img/shutterstock_732491308.png",
        SignOut:
          "https://static-maryoku.s3.amazonaws.com/storage/img/shutterstock_732491308.png",
        GetStarted:
          "https://static-maryoku.s3.amazonaws.com/storage/img/shutterstock_732491308.png",
        SignedIn:
          "https://static-maryoku.s3.amazonaws.com/storage/img/shutterstock_732491308.png",
        Lock: "https://static-maryoku.s3.amazonaws.com/storage/img/lock.jpg",
      };
      return {
        backgroundImage: `url(${images[this.$route.name]})`,
      };
    },
    setPageClass() {
      return `${this.$route.name}-page`.toLowerCase();
    },
  },
  methods: {
    toggleSidebarPage() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    linkClick() {
      if (
        this.autoClose &&
        this.$sidebar &&
        this.$sidebar.showSidebar === true
      ) {
        this.$sidebar.displaySidebar(false);
      }
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    toggleNavbar() {
      document.body.classList.toggle("nav-open");
      this.showMenu = !this.showMenu;
    },
    closeMenu() {
      document.body.classList.remove("nav-open");
      this.showMenu = false;
    },
    onResponsiveInverted() {
      if (window.innerWidth < 991) {
        this.responsive = true;
      } else {
        this.responsive = false;
      }
    },
  },
  mounted() {
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
  },
};
</script>
<style lang="scss" scoped>
$scaleSize: 0.1;
$zoomOutStart: 0.7;
$zoomOutEnd: 0.46;
@keyframes zoomIn8 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  100% {
    opacity: 1;
  }
}
.wrapper-full-page .zoomIn {
  animation-name: zoomIn8;
}
@keyframes zoomOut8 {
  from {
    opacity: 1;
    transform: scale3d($zoomOutStart, $zoomOutStart, $zoomOutStart);
  }
  to {
    opacity: 0;
    transform: scale3d($zoomOutEnd, $zoomOutEnd, $zoomOutEnd);
  }
}
.wrapper-full-page .zoomOut {
  animation-name: zoomOut8;
}
</style>
