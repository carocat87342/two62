<template>
  <div class="proposal-final-step">
    <div class="font-size-40 font-bold header">How does our bidding process work?</div>
    <div class="tabs d-flex">
      <div
        class="tab"
        v-for="(tab, index) in tabs"
        :class="{ active: selectedTab == index }"
        @click="selectTab(index)"
        :key="tab.title"
      >
        <img :src="`${$iconURL}Submit+Proposal/${tab.icon}`" />
        <div class="font-bold font-size-22">{{ tab.title }}</div>
      </div>
    </div>
    <div class="tab-content">
      <h2 class="font-bold-extra">{{ tabs[selectedTab].title }}</h2>
      <div v-if="selectedTab==0">
        <div>
            Now we review the suitability of your proposal with the requirements of the event and budget. We also weigh in how long it took you to answer, and how many times you were selected when you were one of the "three best & final", Maryoku's ranking system. We also look at how many recommenders you have and what their recommendations are. The three best bids will be presented to the planner as best & final. The planner can now choose one of them or ask for other alternatives. If she won't ask for another alternative instead of your offer, we will let you know. If she decides not to choose you, but someone else, we will let you know why. When the planner chooses you, we take care of all the prepayment. You will receive a down payment based on Maryoku's policy. Within 7 days of the event, if there are no appeals/ complaints, you will receive the rest of the payment to your account.
        </div>
        <br/>
        <div>
            Every offer you submit is kept with us, so we can better learn your price range.
        </div>
        <br/>
        <div>
            When you are chosen to do an event, you will get a link to the area where you can create a dialogue with the other vendors working the event, so you can work together and make sure everything is in sync. If you cancel, for any reason, you will have to return the down payment, in accordance with Maryoku's policy.
        </div>
        <br/>
        <div>
            If the event is canceled, you will receive compensation in accordance Maryoku's policy.Any change in the number of people, date, location, etc. will be reflected to you as soon as the planner defines a change. Some changes may require a new and updated proposal from you. In this case, you will receive a link to your original proposal, there you will be able to update it and save a new version.
        </div>
      </div>
      <template v-if="selectedTab ==1">
        Deciding between vendors, isn't an easy job but someone has to do it...
        to make our decision a little easier, we want to know how long  it took you to reply and what was the number of times you were chosen when your bid was one of the three finalists. we also look at the rating you got on our website, and go over all your  Recommendation.
        Remember- even if your offer didn't make it to the final 3, you still have a chance, if the event planner asks for more offers, you might make the list this time.
      </template>
      <template v-if="selectedTab ===2">
        <p>
          <h3 class="font-size-22 font-bold"> I got the job, what's next?</h3>
          <div>
            According to our policy, you'll now receive your down payment. If all goes well and there are no complaints or disputes filed, then you'll get fully paid within 7 days of the event.
            Next, you'll get a link connecting you with the other vendors who won, so you can work together and make sure everything is in sync.
          </div>
        </p>
        <p>
          <h3 class="font-size-22 font-bold"> What if the event gets cancelled?</h3>
          <div>
            According to our policy, if from any reason you decide to cancel, then you'll have to give back your down payment.
            If the client cancels, then you'll be Compensated according to our policy.
          </div>
        </p>  
        <p>
          <h3 class="font-size-22 font-bold"> Changes</h3>
          <div>
            If any changes were made in the number of guests, location, date etc. you'll be informed immediately. Some changes may require a new and updated proposal. In that case, you'll receive a link to the proposal and you will be able to update it and save it as a new version.
          </div>
        </p>  
      </template>
      <template v-if="selectedTab ==3">
        We save every offer you ever submitted, do we can learn all about your business and price range. next time we we'll already fill out most of the bid for you so you can take it easy . we will also compare between your offer and other offers in your filed of expertise, so that we can help you get the most out of yours.
      </template>
      <template v-if="selectedTab == 4">
        <p>
          <h3 class="font-size-22 font-bold"> Can I improve my chances?</h3>
          <div>
            Sure. Once we finish our thorough examination and it's down to you and one more vendor, then you can tweet our post and share it with as many friends as possible. By doing so, you'll improve your chances to win Significantly
          </div>
        </p>
        <div class="white-card sharing-form">
          <div class="upoad-photo">
            <img :src="imageData" v-if="imageData" class="uploaded-image"/>
            <md-button v-else class="md-simple maryoku-btn md-red" @click="openPhotoDialog"><md-icon>add</md-icon><br/><div>Add Photo</div></md-button>
            <input type="file" id="fileSelector" class="d-none" @change="onFileChange"/>
          </div>
          <p>
          <h3 class="font-size-22 font-bold"> POST TO SHARE</h3>
          <div>
            Sure. Once we finish our thorough examination and it's down to you and one more vendor, then you can tweet our post and share it with as many friends as possible. By doing so, you'll improve your chances to win Significantly
          </div>
          <hr/>
          <div>
            
          </div>
        </p>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { getBase64 } from "@/utils/file.util";
import S3Service from "@/services/s3.service";
export default {
  data() {
    return {
      selectedTab: 0,
      imageData: "",
      tabs: [
        { title: "NOW WHAT?", icon: "final-tab-1.png" },
        { title: "HOW DO WE PICK?", icon: "final-tab-2.png" },
        { title: "IF I WON?", icon: "final-tab-3.png" },
        { title: "WHAT ELSE?", icon: "final-tab-4.png" },
        { title: "UP YOUR CHANCES", icon: "final-tab-5.png" },
      ],
    };
  },
  methods: {
    selectTab(tabIndex) {
      this.selectedTab = tabIndex;
    },
    openPhotoDialog() {
      document.getElementById("fileSelector").click();
    },
    async onFileChange(event) {
      const file = event.target.files[0];
      this.imageData = await getBase64(file);
      const extension = file.type.split("/")[1];
      const logoName = `xxxxxx`;
      S3Service.fileUpload(file, logoName, "logos").then((res) => {
        this.$store.dispatch("sharing", { logoUrl: res });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.proposal-final-step {
  margin: 40px 64px;
  box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
  background-color: #f3f7fd;
  .header {
    padding: 40px 80px;
  }
  .tabs {
    border-top: solid 1px #c5c7cb;
    border-bottom: solid 1px #c5c7cb;
    .tab {
      flex-grow: 1;
      text-align: center;
      padding: 20px;
      border-right: solid 1px #c5c7cb;
      width: 20%;
      cursor: pointer;
      &:last-child {
        border-right: none;
      }
      &.active {
        border-bottom: solid 4px #f51355;
      }
    }
  }
  .tab-content {
    background-color: white;
    padding: 80px 20%;
    h2 {
      margin: 0;
      font-size: 40px;
    }
    p {
      margin-bottom: 40px;
    }
    .sharing-form {
      padding: 60px;
      .upoad-photo {
        height: 400px;
        border: dashed 1px #f51355;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        .uploaded-image {
          width: 100%;
        }
      }
    }
  }
}
</style>