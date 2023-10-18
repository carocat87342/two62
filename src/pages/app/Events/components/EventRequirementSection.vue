<template>
  <div class="requirement-section">
    <table class="requirement-section-table">
      <thead>
        <tr>
          <th class="width-30">
            <span class="section-title">
              <img :src="`${$iconURL}Requirements/Services.svg`" class="mr-20" style="width: 60px" />
              {{ category }}
            </span>
          </th>
          <th v-if="category !== 'Amenities'" class="width-10">
            <div class="text-center">Size</div>
          </th>
          <th :class="category === 'Amenities' ? 'width-20' : 'width-10'">
            <div :class="category !== 'Amenities' ? 'text-center mr-20' : 'text-left ml-40'">How Many?</div>
          </th>
          <th class="width-10"></th>
          <th class="width-30"></th>
        </tr>
      </thead>
      <tbody>
        <tr class="requirement-item" v-for="(service, index) in properties.filter((sv) => sv.isSelected)" :key="index">
          <td class="width-30">
            <div class="py-10 label-capitalize">
              {{ service.item }}
              <div class="mt-10" v-if="service.type === 'single-selection'">
                <category-selector
                  :value="service.value"
                  :categories="service.options"
                  :multiple="true"
                  track-by="name"
                  column="2"
                  :additional="true"
                  @change="handleChangeCategorySelector(service, ...arguments)"
                ></category-selector>
              </div>
              <!--              <requirement-item-comment-->
              <!--                v-if="service.notable"-->
              <!--                :property="service"-->
              <!--                @save="saveComment"-->
              <!--              ></requirement-item-comment>-->
              <span v-if="service.item === 'Table setup and preparations' && service.hint" class="ml-10">
                <img :src="`${$iconURL}Event%20Page/light.svg`" width="20" />
                <md-tooltip md-direction="bottom">{{ service.hint }}</md-tooltip>
              </span>
            </div>
          </td>
          <td v-if="category !== 'Amenities'">
            <template v-if="service.sizeEnabled">
              <input
                class="quantity-input"
                placeholder="Cm"
                type="number"
                v-model="service.defaultSize"
                @input="updateRequirement"
              />
            </template>
            <div v-else class="empty text-center">n/a</div>
          </td>
          <td :class="category !== 'Amenities' ? 'text-center' : 'text-left ml-30'">
            <template v-if="service.qtyEnabled">
              <input
                class="quantity-input"
                placeholder="QTY"
                type="number"
                v-model="service.defaultQty"
                @input="updateRequirement"
              />
              <span v-if="service.hint" style="position: absolute; margin-top: 10px">
                <img :src="`${$iconURL}Event%20Page/light.svg`" width="20" />
                <md-tooltip md-direction="bottom">{{ service.hint }}</md-tooltip>
              </span>
            </template>
            <div v-else class="empty" :class="category !== 'Amenities' ? 'text-center mr-30' : 'text-left ml-60'">
              n/a
            </div>
          </td>
          <td class="width-10">
            <div class="empty">
              <md-button class="md-icon-button md-simple requirement-action" v-if="service.qtyEnabled">
                <img :src="`${$iconURL}Requirements/edit-dark.svg`" width="20" />
              </md-button>
              <md-button class="md-icon-button md-simple requirement-action" @click="removeRequirement(service)">
                <img :src="`${$iconURL}Requirements/delete-dark.svg`" width="20" />
              </md-button>
            </div>
          </td>
          <td class="width-30">
            <div class="condition">
              <md-checkbox class="md-simple md-checkbox-circle md-red" v-model="service.mustHave" :value="true">
                Must Have
              </md-checkbox>
              <md-checkbox class="md-simple md-checkbox-circle md-red" v-model="service.mustHave" :value="false">
                Nice To Have
              </md-checkbox>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="additional-request mb-30">
      <div class="additional-request-description">
        <h4>Additional Requests</h4>
        <div v-if="category === 'Amenities'">Select all of the items you'd like to add.</div>
        <div v-else>Would you like to add one of those items?</div>
      </div>
      <div class="additional-tag-container">
        <div
          class="additional-request-tag"
          v-for="(service, index) in properties.filter((item) => !item.isSelected && item.visible)"
          :key="index"
          @click="addRequirement(service)"
        >
          {{ service.item }}
          <md-icon class="icon color-red">add_circle</md-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import RequirementItemComment from "./RequirementItemComment";
import Multiselect from "vue-multiselect";
import CategorySelector from "@/components/Inputs/CategorySelector";

export default {
  name: "event-requirement-section",
  components: {
    RequirementItemComment,
    Multiselect,
    CategorySelector,
  },
  props: {
    requirements: {
      type: Object,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    blockId: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      properties: [],
      value: [],
    };
  },
  methods: {
    getProperties() {
      this.properties = [];
      let requirements = this.requirements;
      let event = (this.event = this.$store.state.event.eventData);
      requirements[this.category].map((it) => {
        let value = null;
        let visible = true;

        if (it.type == "single-selection") {
          value = [];
          visible = this.blockId == "entertainment" && it.conditionScript ? eval(it.conditionScript) : true;

          it.options.map((op) => {
            if (op.selected) {
              value.push(op);
            }
          });
        }

        if (this.blockId == "foodandbeverage" && this.category == "Services") {
          visible = it.conditionScript ? eval(it.conditionScript) : true;
        }
        this.properties.push({ ...it, visible, value });
      });

      // console.log("getProperties", this.requirements)
    },
    updateRequirement() {
      this.requirements[this.category] = this.properties;
      this.$emit("change", this.requirements);
    },
    addRequirement(property) {
      const index = this.properties.findIndex((it) => it.item == property.item);
      this.requirements[this.category][index].isSelected = true;

      let requirements = this.requirements;
      if (this.blockId == "audiovisualstagingservices" && this.category == "Amenities" && property.item == "Rigging") {
        requirements["Staff"].map((rq) => {
          if (rq.item == "Rigging engineer") rq.isSelected = eval(rq.conditionScript);
        });
      }

      this.$emit("change", this.requirements);
    },
    removeRequirement(property) {
      const index = this.properties.findIndex((it) => it.item == property.item);
      property.isSelected = false;
      this.requirements[this.category][index].isSelected = false;

      this.requirements["multi-selection"][0].options.map((op) => {
        if (op.name.trim() == property.item.trim()) {
          op.selected = false;
        }
      });

      this.$emit("change", this.requirements);
    },

    handleChangeCategorySelector(property, value) {
      // console.log("handleChangeCategorySelector", property, value);

      let index = this.properties.findIndex((pt) => pt.item === property.item);

      this.requirements[this.category][index].options.map((op) => {
        if (value.findIndex((el) => el.name === op.name) > -1) {
          op.selected = true;
        } else {
          op.selected = false;
        }
      });
      // console.log("handleChangeCategorySelector", this.requirements[this.category][index]);
      this.$emit("change", this.requirements);
    },
    handleNoteChange() {
      this.$emit("change", { note: this.anythingElse });
    },
    saveComment(service, e) {
      let index = this.properties.findIndex((sv) => sv.item == service.item);
      this.requirements[this.category][index].defaultNote = e;

      this.$emit("change", this.requirements);
    },
  },
  watch: {
    requirements: {
      handler(newVal, oldVal) {
        this.getProperties();
      },
      deep: true,
    },
    multiSelection: {
      handler(newVal, oldVal) {
        this.getProperties();
      },
      deep: true,
    },
  },
  mounted() {
    this.getProperties();
  },
};
</script>
