<template>
    <div>
        <h5 class="info-text"> What are you doing?</h5>
        <div class="md-layout">
            <div class="md-layout-item">
                <div class="md-layout">
                    <div class="md-layout-item md-size-33 md-small-size-100">
                        <icon-radio v-model="role"
                                       icon="fas fa-pencil-alt"
                                    label="design"
                                    :value="selectedValue"
                                    :checked="radioButtons.design"
                                    @input="updateValue"
                                    title="Design">
                        </icon-radio>
                    </div>
                    <div class="md-layout-item md-size-33 md-small-size-100">
                        <icon-radio v-model="role"
                                    :value="selectedValue"
                                    label="code"
                                    :checked="radioButtons.code"
                                    icon="fas fa-terminal"
                                    @input="updateValue"
                                       title="Code">
                        </icon-radio>
                    </div>
                    <div class="md-layout-item md-size-33 md-small-size-100">
                        <icon-radio v-model="role"
                                    label="develop"
                                    :checked="radioButtons.develop"
                                    :value="selectedValue"
                                    @input="updateValue"
                                       icon="fas fa-laptop"
                                       title="Develop">
                        </icon-radio>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { IconCheckbox } from '@/components'
import IconRadio from '@/components/Inputs/IconRadio'
import teamVuexModule from '../../team.vuex'
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  components: {
    IconCheckbox,
    IconRadio
  },
  data () {
    return {
      selectedValue: 'Design',
      radioButtons: {
        design: false,
        develop: false,
        code: false
      }

    }
  },
  computed: {
    ...mapState('teamVuex', ['teamMemberData']),
    role: {
      get () {
        return this.teamMemberData.role
      },
      set (value) {
        this.setMemberProperty({key: 'role', actualValue: value})
      }
    }

  },
  created () {
    this.$store.registerModule('teamVuex', teamVuexModule)
  },
  methods: {
    ...mapMutations('teamVuex', [
      'setMemberProperty'
    ]),
    updateValue (dataObject) {
      for (var property in this.radioButtons) {
        console.log(this.radioButtons[property])

        if (this.radioButtons.hasOwnProperty(property)) {
          if (property === dataObject.label) {
            this.radioButtons[property] = true
          } else {
            this.radioButtons[property] = false
          }
        }false
      }
      this.setMemberProperty({key: 'role', actualValue: dataObject.label})
    },
    validate () {
      this.$emit('on-validated', true, this.model)
      return Promise.resolve(true)
    }
  }
}
</script>
<style>
</style>
