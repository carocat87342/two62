<template>
  <div>
    <div class="">
      <div class="md-layout-item" style="padding-left: 0px; padding-right: 10px">
        <label>
          <md-icon style="font-size: 15px !important; padding-right: 1%">room</md-icon>
          {{ dressCode }} {{ where }} Where
        </label>
      </div>

      <div class="md-layout-item" style="padding-left: 0px; padding-right: 0px">
        <!-- <div class="md-layout md-gutter" style="justify-content: flex-end">
                    <div>
                        {{eventDate}} - {{endHourDateEvent}}
                    </div>
                </div> -->
        <div class="md-layout md-gutter" style="justify-content: flex-end">
          <div class="md-layout-item md-size-70" style="text-align: right; padding-right: 0">
            Attending
            <button class="attending-button"><span class="attending">Yes</span></button>
            <button class="attending-button"><span class="attending">No</span></button>
          </div>
        </div>
      </div>
    </div>

    <div class="md-layout" style="margin-top: 4%">
      <div class="md-layout-item md-size-100">
        <p>
          The main office @ 15 Sunset Blvd. Transportation will be provided from the office. If you're arriving solo,
          the venue is located @ street name. Parking is available in building garage.
        </p>
      </div>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-size-70" style="padding-left: 10px; margin-right: 1%">
        <md-icon style="font-size: 15px !important">face</md-icon>
        <label> Dress code </label>
      </div>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-size-100">
        <p>Casual</p>
      </div>
    </div>

    <div class="md-layout" style="margin-bottom: 8%; margin-top: 2%">
      <div class="md-layout-item md-size-70"></div>
      <div class="md-layout-item"></div>
      <div class="md-layout-item"></div>
    </div>

    <!-- <div class="md-layout">
            <div class="md-layout-item md-gutter ">
                <div style="width:100%;height:100%">
                    <img src="https://www.w3schools.com/w3css/img_lights.jpg" title="">

                </div>
            </div>
            <div class="md-layout-item " style="padding-left: 0px;">
                <div>
                    <img src="https://images.pexels.com/photos/237018/pexels-photo-237018.jpeg?cs=srgb&dl=asphalt-autumn-beauty-237018.jpg&fm=jpg" title="">
                </div>
            </div>
            <div class="md-layout-item " style="padding-left: 0px;">

                <div class="md-layout md-gutter md-alignment-center-center" style="background-color: #e1dfdf; width: 100%; height: 100%; margin:0 auto;">
                    <div class="md-layout-item" style="text-align:center;">
                        <div class="border-add-photo">
                            <div class="md-layout md-gutter md-alignment-center-center" style="background-color: #e1dfdf; width: 100%; height: 100%; text-align:center;margin:auto;">
                               <div class="md-layout-item" style="text-align:center;">
                                   <div style="text-align:center;">
                                     <md-icon class="add-photo-icon" style="color:#ffffff;">add</md-icon>
                               </div>

                               </div>
                            </div>
                        </div>
                            <div class="md-layout md-gutter md-alignment-center-center" style="margin-left: 0px;margin-right: 0px;">
                                 <div class="md-layout-item" style="padding-left: 0px;padding-right: 0px;">
                                   <div class="add-photo">add photo</div>
                                </div>
                            </div>
                    </div>

                </div>

            </div>
        </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      eventDate: "",
      endHourDateEvent: "",
    };
  },
  props: {
    where: {
      type: String,
    },
    when: {
      type: Number,
    },
    dressCode: {
      type: String,
    },
  },
  mounted() {
    let options = { day: "numeric", year: "numeric", month: "long", weekday: "long" };
    this.eventDate = new Date(this.when).toLocaleDateString("en-US", options);
    let hourOptions = { hour: "2-digit", minute: "2-digit" };
    this.endHourDateEvent = new Date(this.when).toLocaleTimeString("en-US", hourOptions);
  },
};
</script>

<style lang="scss">
.add-photo {
  width: 67px;
  height: 14px;
  font-family: Roboto;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  margin-left: 10px;
}

.add-photo-icon {
  font-size: 15px !important;
  margin: auto;
  padding-right: 20px;
}
.border-add-photo {
  border-style: dotted;
  border-width: 2px;
  border-color: #ffffff;
  text-align: center;
  margin: auto;
  width: 35px;
  height: 35px;
}

.comming-button {
  width: 94px;
  height: 26px;
  border-radius: 5px;
  background-color: #fb8f05;
}

.attending-button {
  width: 50px;
  height: 26px;
  border-radius: 5px;
  background-color: #fb8f05;
}
.notcomming-button {
  width: 94px;
  height: 26px;
  border-radius: 5px;
  background-color: #e1dfdf;
}

.attending {
  width: 48px;
  height: 15px;
  font-family: Roboto;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
}

.notcomming {
  width: 72px;
  height: 15px;
  font-family: Roboto;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
}
</style>
