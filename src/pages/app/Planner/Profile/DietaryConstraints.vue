<template>
  <div>
    <md-card>
      <md-card-header class="md-card-header-icon md-card-header-green">
        <div class="card-icon" style="padding: 12px;">
          <md-icon>fastfood</md-icon>
        </div>
        <h4 class="title profile-title">Dietary Preferences</h4>
      </md-card-header>

      <md-card-content style="padding: 0; margin: 0; padding-bottom: 12px;">
        <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" />
        <div class="md-layout" style="margin-top:5%">
          <div
            class="md-layout-item md-size-33"
            v-for="(item,index) in dietaryIconsList"
            :key="item.id"
          >
            <img
              :src="`https://static-maryoku.s3.amazonaws.com/storage/img/dietary/${item.on}.png`"
              @click="toggleFlagFirstList(index)"
              v-if="item.flagOn"
            />
            <img
              :src="`https://static-maryoku.s3.amazonaws.com/storage/img/dietary/${item.off}.png`"
              @click="toggleFlagFirstList(index)"
              v-if="!item.flagOn"
            />
          </div>
        </div>

        <!--<div class="md-layout"   style="margin-top:5%">
          <div class="md-layout-item" v-for="(item,index) in dietaryIconOnSecondList" :key="item.id">
            <img :src="`https://static-maryoku.s3.amazonaws.com/storage/img/dietary/${item.on}.png`" @click="toggleFlagSecondList(index)" v-if="item.flagOn">
            <img :src="`https://static-maryoku.s3.amazonaws.com/storage/img/dietary/${item.off}.png`" @click="toggleFlagSecondList(index)" v-if="!item.flagOn">
          </div>

        </div>-->
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
// import auth from '@/auth';
import Me from "@/models/Me";
import { Collapse } from "@/components";
import _ from "underscore";

export default {
  components: {
    Collapse,
    VueElementLoading,
  },
  props: {
    userInfo: Object,
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // auth: auth,
      showOnIcoff: true,
      showOffIcoff: false,
      dietaryIconsList: [
        {
          id: "sugar_free",
          off: "sugar_free_off",
          on: "sugar_free_on",
          flagOn: false,
        },
        {
          id: "egg_free",
          off: "egg_free_off",
          on: "egg_free_on",
          flagOn: false,
        },
        {
          id: "gluten_free",
          off: "gluten_free_off",
          on: "gluten_free_on",
          flagOn: false,
        },
        {
          id: "gmo_free",
          off: "gmo_free_off",
          on: "gmo_free_on",
          flagOn: false,
        },
        {
          id: "peanut_free",
          off: "peanut_free_off",
          on: "peanut_free_on",
          flagOn: false,
        },
        {
          id: "lactose_free",
          off: "lactose_free_off",
          on: "lactose_free_on",
          flagOn: false,
        },
      ],
    };
  },

  methods: {
    toggleFlagFirstList(index) {
      this.dietaryIconsList[index].flagOn = !this.dietaryIconsList[index]
        .flagOn;
      this.updateUser();
    },
    updateUser() {
      let dietaryConstraints = [];
      for (let i = 0; i < this.dietaryIconsList.length; i++) {
        if (this.dietaryIconsList[i].flagOn) {
          dietaryConstraints.push(this.dietaryIconsList[i].id);
        }
      }

      this.isLoading = true;

      new Me({ id: this.userInfo.id, dietaryConstraints: dietaryConstraints })
        .save()
        .then((res) => {
          this.userInfo.dietaryConstraints = dietaryConstraints;
          this.isLoading = false;
          this.$notify({
            message: "Profile saved successfully",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "success",
          });
        });
    },
  },
  watch: {
    userInfo(newVal, oldVal) {
      let dietaryConstraints = newVal.dietaryConstraints;
      if (dietaryConstraints) {
        for (let i = 0; i < dietaryConstraints.length; i++) {
          let item = _.findWhere(this.dietaryIconsList, {
            id: dietaryConstraints[i],
          });
          item.flagOn = true;
        }
      }
    },
  },
};
</script>
<style lang="scss" >
.add-date {
  width: 66px;
  height: 12px;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: left;
  color: #999999;
}
.header-icon-dietary {
  width: 63px;
  height: 64px;
  border-radius: 3px;
  box-shadow: 0px 4px 20px 0 rgba(0, 0, 0, 0.14);
  background-image: linear-gradient(to right, #65ba69, #43a047 100%);
}

.dierty-constraints-main {
  width: 349px;
  height: 212px;
  border-radius: 6px;
  box-shadow: 0px 1px 4px 0 rgba(0, 0, 0, 0.14);
  background-color: #ffffff;
}
</style>
