<template>
  <div>
    <div class="md-nav">
      <div class="inner">
        <md-nav>
          <md-nav-logo href="#!/navbar">
            <img src="https://static-maryoku.s3.amazonaws.com/storage/img/262Logo2.png" />
          </md-nav-logo>
          <md-nav-links class="links">
            <a href="/index.php/blog" class="blog">BLOG</a>
            <a href="/index.php/product" class="product">PRODUCT</a>'
            <a href="/index.php/our-story" class="our-story">OUR STORY</a>
            <a href="https://app.maryoku.com" class="book-a-demo">SIGN UP</a>
          </md-nav-links>
        </md-nav>
      </div>
    </div>
    <router-view></router-view>
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
        CreateWorkspace:
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
  beforeDestroy() {
    this.closeMenu();
    window.removeEventListener("resize", this.onResponsiveInverted);
  },
  beforeRouteUpdate(to, from, next) {
    // Close the mobile menu first then transition to next page
    if (this.showMenu) {
      this.closeMenu();
      setTimeout(() => {
        next();
      }, this.menuTransitionDuration);
    } else {
      next();
    }
  },
};
</script>
<style lang="scss" scoped>
.md-nav {
  background: #fff;
}

@media screen and (min-width: 990px) {
  .inner {
    margin-left: auto;
    margin-right: auto;
    width: 75%;
  }
}
.links {
  float: inline-end;
  margin: 12px;
  a {
    padding: 12px;
    color: #adadad;
    font-weight: 400;
    &:active {
      color: #393952;
    }
    &:hover {
      color: #525255 !important;
    }
  }
}
body {
  background-color: #ffffff !important;
}
</style>
