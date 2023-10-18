<template>
    <div class="md-layout-item md-size-50 import-members-modal">
        <modal v-if="importModalOpen" @close="noticeModalHide" container-class="modal-container-wizard lg">
            <template slot="body">
                <md-card  >
                    <md-card-header class="md-card-header-text md-card-header-warning">
                        <!--<div class="card-text">
                            <h4 class="title" style="color: white;">
                                Upload members
                            </h4>
                        </div>-->
                        <md-button class="md-gray md-simple md-just-icon pull-right" style="margin-top: 32px; margin-right: 18px; margin-left: 12px;" @click="closeModal"><md-icon>close</md-icon></md-button>
                        <div class="md-group pull-right" style="margin-top: 38px;">
                            <md-button class="md-button md-success md-sm" @click="closeModal" v-if="currentStep === 3" :disabled="working || noActions">Finish</md-button>
                            <md-button class="md-button md-info md-sm" style="margin-left: 0.05rem;" v-if="currentStep === 2" @click="nextStep" :disabled="working || noActions">Next</md-button>
                        </div>
                    </md-card-header>
                    <md-card-content>
                        <div class="md-layout">
                            <div class="md-layout-item md-size-100">
                                <nav-tabs
                                    :tab-name="['Upload File', 'Assign Columns', 'View Results']"
                                    :tab-icon="['cloud_upload','table_chart','group_add']"
                                    color-button="info"
                                    flex-column
                                    nav-pills-icons
                                    plain
                                    :navigation-disalbed="true">

                                    <!-- here you can add your content for tab-content -->
                                    <template slot="tab-pane-1">
                                        <div class="md-layout">
                                            <div class="md-layout-item md-size-100">
                                                <vue-element-loading :active="csvUploading" spinner="ring" color="#FF547C"/>
                                                <h4 class="title" style="font-weight: 500;"> Start by uploading a CSV file containing your list of members</h4>
                                                <div class="md-alert md-alert-warning">
                                                    In the next step you will be able to easily assign column names.
                                                </div>
                                                <div class="divider" style="padding: 12px;"></div>
                                                <div class="main-upload-box">
                                                    <drop @drop="handleDrop">
                                                        <draggable>
                                                            <div class="upload-option">
                                                                <h6>Drag your file here</h6>
                                                                <span>or</span>
                                                            </div>
                                                            <div class="upload-box">
                                                                <div class="upload-box_btn form-group">
                                                                    <label for="csv_file" class="control-label col-sm-3 text-right">Browse</label>
                                                                    <div class="col-sm-9">
                                                                        <input type="file" id="csv_file" @change="(e) => sendCSVFile(e.target.files[0])" name="csv_file" class="csv_file form-control">
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </draggable>
                                                    </drop>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template slot="tab-pane-2" >
                                        <div class="md-layout">
                                            <div class="md-layout-item md-size-100">
                                                <vue-element-loading :active="csvUploading" spinner="ring" color="#FF547C"/>
                                                <h4 class="title" style="font-weight: 500;">Great, now you can assign columns names to the columns from your file</h4>
                                                <div class="md-alert md-alert-warning">
                                                    Each column header has a dropdown list of possible columns to assign, choose the one that reflects your data as much as possible.
                                                </div>
                                                <div class="divider" style="padding: 12px;"></div>
                                                <md-table class="border-table" v-if="parseCSV" style="width: 55vmin; overflow: auto;">
                                                    <!--<md-table-row class="md-danger" style="background-color: lightgray;">
                                                        <md-table-head class="text-rose text-center"
                                                                       v-if="column !== ''"
                                                                       v-for="(column, index) in parseCSV.columns"
                                                                       :key="index"
                                                                       @click="sortBy(index)"
                                                                       :class="{ active: sortKey === index }">
                                                            {{column}}
                                                        </md-table-head>
                                                    </md-table-row>-->
                                                    <md-table-row>
                                                        <md-table-head class="text-center"
                                                                       v-if="column !== ''"
                                                                       v-for="(column, index) in parseCSV.columns"
                                                                       :key="index"
                                                                       @click="sortBy(index)"
                                                                       :class="{ active: sortKey === index }">
                                                            <md-field>
                                                                <md-select id="remove-border" v-model="mappedColumns[index].value"  name="select">
                                                                    <md-option
                                                                        v-if="item !== ''"
                                                                        v-for="(item, index) in databaseMemberColumns"
                                                                        :value="item.name"
                                                                        :key="index">
                                                                        {{ item.displayName }}
                                                                    </md-option>
                                                                </md-select>
                                                            </md-field>
                                                        </md-table-head>
                                                    </md-table-row>
                                                    <md-table-row v-for="(row, rowIndex) in parseCSV.rows" :key="rowIndex">
                                                        <md-table-cell v-for="(column, columnIndex) in parseCSV.columns" :key="columnIndex">
                                                            {{ row[column] }}
                                                        </md-table-cell>
                                                    </md-table-row>
                                                </md-table>
                                            </div>
                                        </div>
                                    </template>
                                    <template slot="tab-pane-3">
                                        <div class="md-layout">
                                            <div class="md-layout-item md-size-100">
                                                <h3>Awesome, your new members were uploaded</h3>
                                                <h5>You can review the results of the process here.</h5>
                                                <p>Rows processed: {{ finalResult.processed }} </p>
                                                <p>Total: {{ finalResult.total }}</p>
                                                <p>Duplicates: {{ finalResult.duplicates }}</p>
                                            </div>
                                        </div>
                                    </template>
                                </nav-tabs>
                            </div>
                        </div>
                    </md-card-content>
                </md-card>
            </template>
        </modal>
    </div>

</template>
<script>

import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import teamsModule from '../Team/team.vuex'
import { NavTabs, Tabs, Modal} from '@/components'
import draggable from 'vuedraggable'
import { Drag, Drop } from 'vue-drag-drop'

import TeamMembersFile from '@/models/TeamMembersFile'

export default {
  name: 'import-members-panel',
  components: {
    Tabs,
    NavTabs,
    draggable,
    Drag,
    Drop,
    Modal
  },
  data () {
    return {
      importModalOpen: false,
      working: false,
      noActions: false,
      currentStep: 1,
      finalResult: {
        processed: 0,
        total: 0,
        duplicates: 0
      },
      csvUploading: false,
      parseCSV: [],
      mappedColumns: [],
      sortOrders: {},
      sortKey: '',
      rawCSVFile: null,
      databaseMemberColumns: [
        {
          displayName: 'First Name',
          name: 'firstName',
          value: 'firstName',
          mandatory: true

        },
        {
          displayName: 'Last Name',
          name: 'lastName',
          value: 'lastName',
          mandatory: true

        },
        {
          displayName: 'Email Address',
          name: 'emailAddress',
          value: 'emailAddress',
          mandatory: true

        },
        {
          displayName: 'Group',
          name: 'group',
          value: 'group',
          mandatory: false

        },
        {
          displayName: 'Role',
          name: 'role',
          value: 'role',
          mandatory: false

        },
        {
          displayName: 'Permissions',
          name: 'permissions',
          value: 'permissions',
          mandatory: false

        }
      ]
    }
  },
  created () {
    this.$store.registerModule('teamVuex', teamsModule)
  },
  methods: {
    ...mapMutations('teamVuex', ['setImportModal']),
    closeModal () {
      this.importModalOpen = false
    },
    noticeModalHide: function () {
      this.importModalOpen = false
    },
    toggleModal: function (show) {
      this.importModalOpen = show
    },
    handleDrop (data, event) {
      this.sendCSVFile(event.dataTransfer.files[0])
    },
    nextStep () {
      this.csvUploading = true
      this.updateColumns()
    },
    updateColumns () {
      this.updateVendorsFile().then(isUpdated => {
        if (isUpdated) {
          this.currentStep++
          this.$root.$emit('switch-panel', 2)
          this.csvUploading = false
        }
      })
    },
    closePanel () {
      this.$emit('closePanel')
    },
    async sendCSVFile (file) {
      this.csvUploading = true
      let reader = new FileReader()
      let _this = this

      reader.onload = e => {
        let membersFile = new TeamMembersFile({membersFile: e.target.result})
        membersFile.save().then(result => {
          _this.parseCSV = result
          _this.parseCSV.newColumns = []
          _this.parseCSV.columns.map((item, index) => {
            if (item !== '' && !item.toString().toLowerCase().startsWith('unknown')) {
              let mapping = {}
              _this.databaseMemberColumns[index].value = item
              _this.parseCSV.newColumns.push(mapping)
            }
            _this.mappedColumns.push({})
          })
          _this.csvUploading = false
          this.$notify({
            message: 'Members file is uploaded successfully',
            horizontalAlign: 'center',
            verticalAlign: 'top',
            type: 'success'
          })
          this.currentStep++
          this.$root.$emit('switch-panel', 1)
        }).catch((error) => {
          _this.csvUploading = false
          this.$notify({
            message: 'Members file is not uploaded, please try again',
            horizontalAlign: 'center',
            verticalAlign: 'top',
            type: 'warning'
          })

          console.log(error)
        })
      }
      reader.readAsDataURL(file)
    },
    updateVendorsFile: async function () {
      if (!this.parseCSV.id) {
        return true
      }
      let membersFile = await TeamMembersFile.find(this.parseCSV.id)
      let columnsMapping = []
      let mapping = {}
      this.parseCSV.columns.map((item, index) => {
        if (item !== '' && !item.toString().toLowerCase().startsWith('unknown')) {
          mapping[item] = this.mappedColumns[index].value
        }
      })
      membersFile.columnsMapping = mapping
      // validate column mapping
      if (!this.validateColumnsMapping(mapping)) {
        return false
      }
      this.finalResult = await membersFile.save()

      this.$root.$emit('refresh-members', true)

      return true
    },
    validateColumnsMapping (mapping) {
      let _this = this
      let memberColumns = this.databaseMemberColumns
      let isValid = true
      for (let i = 0; i < memberColumns.length; i++) {
        if (memberColumns[i].mandatory) {
          if (Object.values(mapping).indexOf(memberColumns[i].name) === -1) {
            this.$notify(
              {
                message: 'Field ' + memberColumns[i].displayName + ' is mandatory.',
                horizontalAlign: 'center',
                verticalAlign: 'top',
                type: 'warning'
              })
            isValid = false
            break
          }
        }
      }

      return isValid
    },
    sortBy: function (key) {
      let vm = this
      vm.sortKey = key
      vm.sortOrders[key] = vm.sortOrders[key] * -1
    },
    setCSV (event, id) {
    }
  }
}
</script>
<style lang="scss" scoped>

    .main-upload-box{
        padding: 10px;
        text-align: center;
        border: 2px dashed #f2f2f2 !important;
        .upload-option{
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .upload-box {
            & span{
                display: inline-block;
            }
            &_btn{
                padding: 5px 20px;
                background: linear-gradient(60deg, #ffa726, #fb8c00);
                width: 88px;
                cursor: pointer;
                height: 35px;
                border-radius: 2px;
                color: #fff;
                display: inline-block;
            }
        }
    }

    .import-members-modal .md-list-item-container {
        border-radius: 5px !important;
    }
</style>
