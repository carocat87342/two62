<template>
  <div class="vendor-editor">
    <vue-element-loading
      :active="isLoading"
      spinner="ring"
      color="#FF547C"
      is-full-screen
    >
      <img src="static/img/maryoku-loader.gif" />
    </vue-element-loading>
    <div class="md-layout">
      <div class="md-layout-item md-size-15 md-medium-size-20">
        <div class="pos-fixed">
          <md-field class="mt-42">
            <label>Vendor Category</label>
            <md-select
              v-model="vendor.vendorCategory"
              name="vendorCategory"
              id="vendorCategory"
              @md-selected="vendorCategoryChanged"
            >
              <md-option
                v-for="opt in categories"
                :key="opt.id"
                :id="opt.id"
                :value="opt.id"
                >{{ opt.value }}</md-option
              >
            </md-select>
          </md-field>
          <h6 class="title text-primary">Quick Access</h6>
          <div
            v-for="(section, sIndex) in vendorPropertiesSections"
            :key="sIndex"
          >
            <a
              class="md-button md-simple md-default"
              href="javascript:void(null);"
              @click="scrollToHash(section.title)"
              >{{ section.title }}</a
            >
          </div>
        </div>
      </div>
      <div class="md-layout-item md-size-75 md-medium-size-70">
        <vue-element-loading
          :active="categoryPropertiesLoading"
          spinner="ring"
          color="#FF547C"
        />
        <div
          class="md-layout"
          v-for="(section, sIndex) in vendorPropertiesSections"
          :key="sIndex"
        >
          <div class="md-layout-item md-size-100">
            <md-card>
              <md-card-header
                class="md-card-header-text md-card-header-warning"
              >
                <div class="card-text">
                  <h4 class="title text-white" :id="section.title">
                    {{ section.title }}
                  </h4>
                </div>
              </md-card-header>
              <md-card-content>
                <div v-for="(item, index) in section.items" :key="index">
                  <template v-if="item.title">
                    <h6 class="alert alert-info pd-8">{{ item.title }}</h6>
                    <div
                      v-for="(subItem, index) in item.items"
                      :key="index"
                      class="pl-18"
                    >
                      <vendor-property-field
                        :item.sync="subItem"
                        :vendor.sync="vendor"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <vendor-property-field
                      :item.sync="item"
                      :vendor.sync="vendor"
                    />
                  </template>
                </div>
              </md-card-content>
            </md-card>
          </div>
        </div>
      </div>
      <div class="md-layout-item md-size-10">
        <div class="pos-fixed w-92p mt-21">
          <md-button class="md-success text-right" @click="saveVendor"
            >Save</md-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import VueElementLoading from "vue-element-loading";
import VendorPropertyField from "./VendorPropertyField";
import Vendors from "@/models/Vendors";

// COMPONENTS
import Icon from "@/components/Icon/Icon.vue";
import LightBox from "vue-image-lightbox";
import { SlideYDownTransition } from "vue2-transitions";

export default {
  components: {
    VueElementLoading,
    VendorPropertyField,
  },
  props: {
    vendor: {
      type: Object,
      default: () => {
        return {
          vendorCategory: null,
          vendorPropertyValues: {},
        };
      },
    },
    creation_mode: false,
  },
  data() {
    return {
      isLoading: true,
      categoryPropertiesLoading: false,
      categories: [],
      vendorPropertiesSections: {},
      selectedField: null,
    };
  },
  created() {
    Vendors.find("categories").then(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.log(error);
      },
    );
  },
  mounted() {
    this.isLoading = false;
    this.$auth.currentUser(this, true, () => {
      if (!this.creation_mode && this.$route.params.id !== undefined) {
        this.getVendor(this.$route.params.id);
      } else {
        this.vendor.vendorCategory = "venue";
        this.vendorCategoryChanged(this.vendor.vendorCategory);
      }
    });
  },
  methods: {
    scrollToHash(hash) {
      setTimeout(() => {
        /* document.getElementById(hash).scrollIntoView({
              behavior: 'smooth' // smooth scroll
          });
          */

        const theElement = document.getElementById(hash);
        const y = theElement.getBoundingClientRect().top + window.pageYOffset;
        const yOffset = -50;
        window.scrollTo({
          top: y + yOffset,
          behavior: "smooth",
        });
      }, 1);
    },
    getVendor(vendorId) {
      Vendors.find(vendorId).then((vendor) => {
        this.vendor = vendor;
        // this.vendor.vendorPropertyValues = {}
        this.vendorCategoryChanged(this.vendor.vendorCategory);
        this.isLoading = false;
      });
    },
    vendorCategoryChanged(val) {
      this.categoryPropertiesLoading = true;
      this.vendorPropertiesSections = [];
      Vendors.params({
        category: val,
      })
        .find("properties")
        .then(
          (vendorProperties) => {
            this.vendorPropertiesSections = vendorProperties;
            this.categoryPropertiesLoading = false;
          },
          (error) => {
            console.log(error);
            this.categoryPropertiesLoading = false;
          },
        );
    },
    saveVendor() {
      console.log("*** Save vendor: ");
      console.log(JSON.stringify(this.vendor));
      this.isLoading = true;
      new Vendors(this.vendor).save().then((res) => {
        console.log("*** Save vendor - done: ");
        console.log(JSON.stringify(res));
        this.$router.push({ name: "EditVendor", params: { id: res.item.id } });
        document.location.reload();
        this.isLoading = false;
      });
    },
    addVendor() {
      this.$validator.validateAll().then((res) => {
        if (res) {
          let newVendor = new Vendors({});

          newVendor.attach(this.vendor).then((res) => {
            this.$emit("vendorCreated");
            this.$emit("selectVendor", res.data.item);
            this.$notify({
              message: "Vendor created successfully!",
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "success",
            });
          });
        } else {
          this.$emit("on-validated", res);
          return res;
        }
      });
    },
    updateVendor() {
      Vendors.find(this.vendor.id).then((newVendor) => {
        newVendor.vendorDisplayName = this.vendor.vendorDisplayName;
        newVendor.vendorAddressLine1 = this.vendor.vendorAddressLine1;
        newVendor.vendorCategory = this.vendor.vendorCategory;
        newVendor.rank = this.vendor.rank;
        newVendor.avgScore = this.vendor.avgScore;
        newVendor.vendorWebsite = this.vendor.vendorWebsite;
        newVendor.vendorMainEmail = this.vendor.vendorMainEmail;
        newVendor.vendorMainPhoneNumber = this.vendor.vendorMainPhoneNumber;
        newVendor.vendorTagging = this.vendor.vendorTagging;

        if (this.errors.items.length === 0) {
          newVendor.save();

          this.$notify({
            message: "Vendor Updated Successfully!",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "success",
          });
        } else {
          this.$notify({
            message: this.errors.items[0].msg,
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "danger",
          });
        }

        this.selectedField = null;
      });
    },
  },
  computed: {},
  filters: {},
  watch: {},
};
</script>

<style lang="scss" scoped>
.text-white {
  font-weight: 600 !important;
  color: white !important;
  margin-top: 0 !important;
}

.pos-fixed {
  position: fixed;
}
.w-92p {
  width: 92%;
}
.mt-21 {
  margin-top: 21px;
}
.mt-42 {
  margin-top: 42px;
}
h6.title {
  border-bottom: 1px solid lightgrey;
}
.pd-8 {
  padding: 8px;
}
.pl-18 {
  padding-left: 18px;
}
</style>
