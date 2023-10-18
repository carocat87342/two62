<template>
  <div class>
    <div class="header">
      <div class="navbar">
        <div class="logo-section"></div>
        <div class="navbar-menu">
          <ul>
            <li>For Vendors</li>
            <li>Blog</li>
            <li>Our Story</li>
            <li>Contact</li>
            <li class>Sign in</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
};
</script>
<style lang="scss">
.header {
  height: 700px;
  background: url(https://static-maryoku.s3.amazonaws.com/storage/img/homepage/header@2x.png)
    center top no-repeat;
  background-size: cover;

  .navbar {
    ul {
      padding: 0;
      margin: 0;
    }
  }
}
</style>
