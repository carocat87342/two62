<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100" style="text-align: center;">
      <img
        src="https://static-maryoku.s3.amazonaws.com/storage/img/262Logo2.png"
        class="text-center"
      />
      <h2 class="title text-center" slot="title" style="text-align: center;">Create your workspace</h2>
    </div>
    <div class="md-layout-item md-size-50 mx-auto">
      <md-card>
        <md-card-header></md-card-header>
        <md-card-content>
          <h2
            class="title text-center"
            style="text-align: center;"
          >Welcome, let's get you started ...</h2>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>
<script>
// import auth from '@/auth';
export default {
  components: {},
  methods: {},
  created() {
    const that = this;
  },
  data() {
    return {
      serverURL: process.env.SERVER_URL,
      auth: auth,
    };
  },
};
</script>
<style>
</style>
