<template>
  <div class="vendor-signup-step5-wrapper">
    <div class="inside-container">
      <div class="left-side">
        <img :src="`${$iconURL}Vendor+Signup/step-5.svg`" />
        <h2>
          ADD <br />
          RECOMMENDATIONS
        </h2>
        <p>
          Take it from us - recommendations go a long way! Want to display a recommendation from a previous customer of
          yours on your vendor page? Enter the details of the customer that you’d like to get a recommendation from, and
          we’ll reach out to them to get their review and post it on your page.
        </p>
        <h2>4/4</h2>
      </div>
      <div class="right-side">
        <div class="mb-50 card">
          <div class="title-cont mb-50">
            <div class="top">
              <div class="font-size-22 font-bold">
                <img :src="`${$iconURL}common/user-dark.svg`" class="page-icon" /> Customer details
              </div>
            </div>
            <div class="bottom">
              <p>From which you would like to request a recommendation</p>
            </div>
          </div>
          <div
            class="recommendations"
            v-for="(recommendation, rIndex) in recommendations"
            :key="recommendation.contactPersonName"
          >
            <span>{{ recommendation.companyName }}</span>
            <span>{{ recommendation.contactPersonName }}</span>
            <span>{{ recommendation.email }}</span>
            <div>
              <md-button @click="deleteRecommendation(rIndex)" class="md-simple edit-btn md-red">Delete</md-button>
            </div>
          </div>
          <div class="mt-30">
            <div class="mb-50">
              <label class="font-bold">Company Name</label>
              <maryoku-input
                class="form-input mt-10"
                inputStyle="company"
                v-model="companyName"
                placeholder="Type name of company here..."
              ></maryoku-input>
            </div>
            <div class="mb-50">
              <label class="font-bold">Contact Person's Name</label>
              <maryoku-input
                class="form-input mt-10"
                inputStyle="username"
                v-model="contactPersonName"
                placeholder="Type your name here..."
              ></maryoku-input>
            </div>
            <div class="mb-50">
              <label class="font-bold">Email</label>
              <maryoku-input
                class="form-input mt-10"
                data-vv-name="email"
                v-model="email"
                inputStyle="email"
                placeholder="Type email address here..."
              ></maryoku-input>
            </div>
          </div>
          <div>
            <md-button class="edit-btn md-simple md-vendor" @click="addAnotherRecommendation">
              <md-icon class="color-purple font-size-24">add_circle_outline</md-icon>
              Add Another Recommendation
            </md-button>
          </div>
        </div>
        <div class="card">
          <div class="d-flex align-center">
            <img :src="`${$iconURL}Vendor+Signup/preview-recommendation-purple.png`" class="mr-20" />
            <div class="flex-1">
              <div class="color-purple font-size-22 font-bold">
                PREVIEW THE EMAIL WE'RE ABOUT TO SEND TO YOUR CUSTOMER
              </div>
              <div class="color-purple font-size-16 mt-10">This is what your recommender will get in our email</div>
            </div>
            <a @click="open">
              <md-icon class="color-purple font-size-40">
                {{ opened ? "keyboard_arrow_down" : "keyboard_arrow_right" }}
              </md-icon>
            </a>
          </div>
          <div v-if="opened" class="card-content">
            <h2 class="person-name">
              Hey <span>{{ contactPersonName }}</span>
            </h2>
            <h5 class="pt-20 font-size-18">How are you?</h5>
            <h5 class="font-size-18">I hope this email finds you well & happy!</h5>
            <p class="pt-20 font-size-18">
              I'm writing to let you know I recently started working with maryoku –an awesome web platform for
              non-professional event planners, helping them plan events like pros. These days, I’m looking for people
              who can speak positively about my services and help me gain credibility as a business.
            </p>
            <p class="font-size-18">Hope you can spare some time.</p>
            <md-button class="my-30 md-vendor-review md-simple md-outlined">Write A Review</md-button>
            <h5 class="font-size-18">Many thanks</h5>
            <h5 class="font-size-18">{{ vendor.companyName }}</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.vendor-signup-step5-wrapper {
  font-family: Manrope-Regular, sans-serif;
  .recommendations {
    padding: 15px 0;
    display: grid;
    grid-template-columns: repeat(4, 25%);
    width: 80%;
  }
  .inside-container {
    display: flex;
    color: #050505;

    .left-side {
      flex: 1;
      margin-right: 122px;

      img {
        width: 92.5px;
      }
      h4 {
        margin: 36px 0 11px 0;
        font: 800 20px Manrope-Regular, sans-serif;
      }
      p {
        margin: 0;
        padding: 0;
        font: normal 16px Manrope-Regular, sans-serif;
      }
      h2 {
        margin: 30px 0;
        font: 800 40px Manrope-Regular, sans-serif;
      }
      h3 {
        margin: 0;
        color: #f51355;
        font: bold 20px Manrope-Regular, sans-serif;
      }
    }
    .right-side {
      flex: 3;

      .card {
        padding: 40px 60px 40px 60px;
        background-color: #ffffff;
        box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);

        .card-content {
          padding: 40px 50px;
          margin-top: 30px;
          border: solid 1px #707070;
          background-color: #f7f7f7;

          h2.person-name {
            font-family: Georgia, "Times New Roman", Times, serif;
            font-size: 30px;
            font-weight: 600;
            margin: 0;
            line-height: 1.23;
            color: #707070;

            span {
              font-style: italic;
              font-size: 22px;
            }
          }

          h5 {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
            color: #707070;
            font-family: Georgia, "Times New Roman", Times, serif;
          }

          p {
            font-size: 14px;
            margin: 0;
            color: #707070;
            font-family: Georgia, "Times New Roman", Times, serif;
          }
        }
      }
    }
  }
}
</style>
<script>
import { SignupCard, MaryokuInput } from "@/components";

export default {
  components: {
    MaryokuInput,
  },

  data() {
    return {
      companyName: "",
      contactPersonName: "",
      email: "",
      eventDate: "",
      opened: false,
    };
  },
  methods: {
    clear() {
      this.companyName = "";
      this.contactPersonName = "";
      this.email = "";
    },
    formValid() {
      return this.companyName && this.contactPersonName && this.email;
    },
    addAnotherRecommendation() {
      let recommendations = this.$store.state.vendorService.vendor.recommendations;
      if (!recommendations) recommendations = [];
      if (!this.formValid()) return;
      recommendations.push({
        companyName: this.companyName,
        contactPersonName: this.contactPersonName,
        email: this.email,
      });
      this.clear();
      const newRecomendations = Object.assign(recommendations, []);
      this.$store.commit("vendorService/setField", { field: "recommendations", value: newRecomendations });
    },
    deleteRecommendation(index) {
      this.recommendations.splice(index, 1);
      const newRecommendations = Object.assign(this.recommendations, []);
      this.$store.commit("vendorService/setField", { field: "recommendations", value: newRecommendations });
    },
    open() {
      console.log("open");
      this.opened = !this.opened;
    },
  },
  computed: {
    recommendations() {
      return this.$store.state.vendorService.vendor.recommendations;
    },
  },
  watch: {
    vendor() {
      return this.$store.state.vendorService.vendor;
    },
  },
};
</script>
