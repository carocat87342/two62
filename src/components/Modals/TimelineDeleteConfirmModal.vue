<template>
  <modal v-if="showEditDetailModal" class="delete-timeline-model">
    <template slot="header">
      <div class="delete-timeline-model__header">
        <h2>
          Are you sure you want to say 
          goodbye to your changes?
        </h2>
        <div class="header-description">
          <img :src="`${iconsURL}warning-circle-gray.svg`" width="20" /> Changing the time on your status might cause price changes
        </div>
      </div>
      <md-button
        class="md-simple md-just-icon md-round modal-default-button"
        @click="showEditDetailModal = false"
      >
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div class="md-layout">
        <div class="md-layout-item md-size-100">
          <div class="d-flex justify-content-between">
            <md-radio v-model="radio" :value="false">Day Time event</md-radio>
            <md-radio v-model="radio" value="my-radio">Eventing event</md-radio>
            <md-radio v-model="radio" :value="objA">A whole day or more</md-radio>
          </div>
        </div>
        <div class="md-layout-item md-size-100 text-left">
          <label class="">Event Type</label>
          <div class="form-group maryoku-field">
            <md-field class="mt-0 mb-2">
              <md-select v-model="eventType">
                <md-option
                  v-for="(type,index) in eventTypes"
                  :key="index"
                  :value="type.id"
                >
                  {{ type.name }}
                </md-option>
              </md-select>
            </md-field>
            <!-- <v-select v-model="event.type" :options="eventTypes"></v-select> -->
          </div>
        </div>
        <div class="md-layout-item md-size-100 text-left">
          <label>Date</label>
          <div class="form-group">
            <md-datepicker
              :class="[{'md-error': (event.date)}]"
              v-model="event.date"
              data-vv-name="date"
              ref="datePicker"
              required>
            </md-datepicker>
          </div>
        </div> 
        <div class="md-layout-item md-size-100 margin-bottom text-left">
          <label>Number Of Guests</label>
          <div class="form-group with-icon">
            <div class="input-icon">
              <img :src="`${iconsURL}budget-dark.svg`" width="20" />
            </div>
            <input type="number" class="form-control" v-model="event.numberOfParticipants" />
          </div>
        </div>
        <div class="md-layout-item md-size-100 margin-bottom text-left">
          <label>Location</label>
          <div class="form-group with-icon">
            <div class="input-icon">
              <img :src="`${iconsURL}budget-dark.svg`" width="20" />
            </div>
            <input type="text" class="form-control" v-model="event.location" />
          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <md-button class="md-default md-simple cancel-btn" @click="showEditDetailModal=false">Cancel</md-button>
      <md-button class="md-rose add-category-btn" @click="addBuildingBlock">Save</md-button>
    </template>
  </modal>
</template>
