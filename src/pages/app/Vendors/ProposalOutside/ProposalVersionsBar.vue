<template>
  <div class="d-flex align-center" style="background-color: #ffedb7">
    <div class="d-flex align-center py-20 font-size-16 text-center cursor-pointer w-min-250 color-black-middle border-right"
         :class="{'selected': selected === -1}"
         @click="select(-1)">
        <img src="/static/icons/vendor/proposal.svg" width="20px" class="mr-10">
        Original
    </div>
    <div v-for="(version, idx) in versions"
         class="version d-flex align-center cursor-pointer text-center py-20 font-size-16 text-center w-min-250 color-black-middle border-right"
         :class="{'selected': selected === idx}"
         @click="select(idx)">
        <img src="/static/icons/vendor/proposal.svg" width="20px" class="mr-10">
        <template v-if="idx !== editIdx">
            {{version.name}}
            <md-button class="md-simple md-icon-button ml-10" @click="editName(idx)">
                <img :src="`${$iconURL}common/edit-dark.svg`" width="20px">
            </md-button>
        </template>
        <template v-else>
            <input class="name" v-model="versionName" @input="changeName" v-click-outside="closeEditing"/>
        </template>
        <md-button class="md-simple md-icon-button remove" @click="remove(idx)">
            <img :src="`${$iconURL}common/trash-dark.svg`" width="20px">
        </md-button>
    </div>
    <div class="d-flex font-size-16 py-20 pl-30 w-min-180 cursor-pointer" @click="saveVersion" style="color: #641856;">
        <md-icon class="mr-10" style="color: #641856">add</md-icon>
        Add New Version</div>
  </div>
</template>
<script>
import moment from 'moment';
import { PROPOSAL_VERSION_FIELDS } from "@/constants/proposal";

const components = {
    ClickOutside: () => import("vue-click-outside")
}

export default {
  name: "proposal-versions-bar",
  components,
  props: {
  },
  data() {
    return {
        versionFields: PROPOSAL_VERSION_FIELDS,
        editIdx: null,
        versionName: null,
    };
  },
  methods: {
    select(index){
      if (this.selected === index) return;
      this.$store.commit('proposalForNonMaryoku/selectVersion', index);
    },
    saveVersion(){
      let data = {};
      this.versionFields.map(key => {
          if ( key === 'bookedServices' ) {
              data[key] = [];
          } else {
              data[key] = this.$store.state.proposalForNonMaryoku.original[key];
          }
      });

      let version = {
          name: `Ver${this.versions.length + 1}-${moment().format("DD/MM/YYYY")}`,
          data,
      }
      this.$store.dispatch('proposalForNonMaryoku/saveVersion', version);
    },
    editName(idx) {
      this.editIdx = idx;
      this.versionName = this.versions[this.editIdx].name;
    },
    changeName(e){
      let versions = this.versions;
      this.$set(versions[this.editIdx], 'name', this.versionName);
      this.$store.commit('proposalForNonMaryoku/setVersions', versions);
    },
    closeEditing(){
      this.editIdx = null;
    },
    remove(idx) {
      this.$store.dispatch('proposalForNonMaryoku/removeVersion', idx);
    }
  },
  computed: {
    versions() {
      return this.$store.state.proposalForNonMaryoku.versions;
    },
    selected() {
      return this.$store.state.proposalForNonMaryoku.currentVersion;
    }
  },
  watch: {
    versions(newVal){console.log('versions', newVal)}
  },
};
</script>
<style lang="scss" scoped>
.border-right{
    border-right: 2px solid #707070;
}
.selected{
    background-color: #ffe79f;
}
input{
    background: transparent;
    max-width: 180px;
    border: none;
    padding: 0 15px;
    min-height: 25px;
}
.version {
    position: relative;

    .remove{
        position: absolute;
        right: 0;
        opacity: 0;
    }

    &:hover{
        .remove {
            opacity: 1;
        }
    }
}
</style>
