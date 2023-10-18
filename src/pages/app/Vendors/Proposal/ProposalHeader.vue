<template>
  <section class="proposal-header">
    <div class="background-image">
      <div class="d-flex concept-image-wrapper" v-if="event.concept">
        <div
          v-for="(color, index) in event.concept.colors"
          :key="`header-image-${index}-1`"
          class="concept-color"
          :style="`background: ${color.color || '#EDEDED'}`"
        >
          <img
            class="concept-image"
            v-if="event.concept.images[index]"
            :src="`${event.concept.images[index].thumb_url || event.concept.images[index].url}`"
          />
        </div>
        <div
          v-for="(color, index) in event.concept.colors"
          :key="`header-image-${index}-2`"
          class="concept-color"
          :style="`background: ${color.color || '#EDEDED'}`"
        >
          <img
            class="concept-image"
            v-if="event.concept.images[index]"
            :src="`${event.concept.images[index].thumb_url || event.concept.images[index].url}`"
          />
        </div>
      </div>
      <img v-else :src="defaultImage" class="default-image" />
    </div>
    <div class="proposal-banner">
      <div class="header-content">
        <ul>
          <li class="font-size-30">
            {{ event.concept ? event.concept.name : event.title }}
          </li>
          <li>
            <img
              class="company-logo"
              alt=""
              v-if="event.owner && event.owner.companyLogo"
              :src="`${event.owner.companyLogo}`"
            />
            {{ event.owner ? event.owner.company : "" }}
          </li>
        </ul>
      </div>
      <div class="summary-cont">
        <ul>
          <li>
            <img :src="`${$iconURL}common/users-white.svg`" />
            {{ proposalRequest ? event.numberOfParticipants : "-" | withComma }}
          </li>
          <li>
            <img :src="`${$iconURL}common/clock-white.svg`" />
            {{ eventTime }}
          </li>
          <li>
            <img :src="`${$iconURL}common/calendar-white.svg`" />
            {{ eventDate }}
            <div
              class="suggest-date-help"
              v-if="suggestionDate"
              @mouseover="dateTooltip = true"
              @mouseleave="dateTooltip = false"
            >
              ?
              <div class="date-tooltip" v-show="dateTooltip">
                <h3>Your Time Suggestion</h3>
                <p>
                  Client will get this proposal with
                  <br />your new suggested date
                </p>
              </div>
            </div>
          </li>

          <li>
            <img :src="`${$iconURL}common/location-white.svg`" />
            {{ getLocation }}
          </li>

          <li>
            <a class="see-full" @click="showModal = true">
              <u>Full Details</u>
              <md-icon>keyboard_arrow_right</md-icon>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="pull-bottom-right">
      <vendor-bid-time-counter
        :key="getRemainingTime.seconds"
        :days="getRemainingTime.days"
        :hours="getRemainingTime.hours"
        :minutes="getRemainingTime.mins"
        :seconds="getRemainingTime.seconds"
        class="bg-yellow"
        :bottom-content="'To send your bid'"
      />
    </div>
    <modal v-if="showModal" class="full-details-modal" container-class="modal-container lg">
      <template slot="header">
        <div class="full-details-modal__header">
          <div class="header-description" v-if="event.concept">
            {{ event.concept.description }}
          </div>
        </div>
        <button class="close" @click="showModal = false">
          <img :src="`${$iconURL}NewSubmitPorposal/Group 3671 (2).svg`" />
        </button>
      </template>
      <template slot="body">
        <div class="full-details-modal__body">
          <ul>
            <li>
              <img :src="`${$iconURL}NewLandingPage/Path 251.svg`" />
              <span>
                <strong>Date:</strong>
                {{ eventDate }}
              </span>
            </li>
            <li>
              <img :src="`${$iconURL}NewLandingPage/Group 6085.svg`" />
              <span>
                <strong>Time:</strong>
                {{ eventTime }}
              </span>
            </li>
            <li>
              <img :src="`${$iconURL}NewLandingPage/Asset 506.svg`" />
              <span>
                <strong>Address:</strong>
                {{ getLocation }}
              </span>
            </li>
            <li>
              <img :src="`${$iconURL}NewLandingPage/Asset 505.svg`" />
              <span>
                <strong>Guests:</strong>
                {{ proposalRequest ? event.numberOfParticipants : "-" | withComma }}
              </span>
            </li>
            <li>
              <img :src="`${$iconURL}NewLandingPage/Path 1942.svg`" />
              <span>
                <strong>Type:</strong>
                {{ proposalRequest ? event.eventType.name : "-" }}
              </span>
            </li>
            <li>
              <img :src="`${$iconURL}NewLandingPage/Path 1383.svg`" />
              <span>
                <strong>Invited:</strong>
                {{ proposalRequest && event.guestType ? event.guestType : "-" }}
              </span>
            </li>
          </ul>
        </div>
      </template>
      <template slot="footer">
        <div class="full-details-modal__footer">
          <a class="see-full" @click="showModal = false">
            Hide Full Details
            <md-icon>keyboard_arrow_up</md-icon>
          </a>
        </div>
      </template>
    </modal>
  </section>
</template>
<script>
import VendorBidTimeCounter from "@/components/VendorBidTimeCounter/VendorBidTimeCounter";
import { Modal } from "@/components";
import moment from "moment";
export default {
  components: {
    VendorBidTimeCounter,
    Modal,
  },
  props: {
    event: {
      type: Object,
      default: () => {},
    },
    proposalRequest: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showModal: false,
      dateTooltip: false,
      defaultImage: "https://maryoku.s3.amazonaws.com/proposal/background-default.jpg",
    };
  },
  computed: {
    vendor() {
      return this.$store.state.vendorProposal.proposalRequest.vendor;
    },

    eventDate() {
      const suggestionDate = this.$store.state.vendorProposal.suggestionDate;
      if (!this.event) return "-";

      let startDate = moment(this.event.eventStartMillis).format("MMM D, YYYY");
      let endDate = moment(this.event.eventEndMillis).format("MMM D, YYYY");
      if (suggestionDate && suggestionDate.length > 0) {
        startDate = new Date(suggestionDate[0].date);
        endDate = new Date(suggestionDate[suggestionDate.length - 1].date);
        return `${moment(suggestionDate[0].date, "DD/MM/YYYY").format("MMM D, YYYY")} - ${moment(
          suggestionDate[suggestionDate.length - 1].date,
          "DD/MM/YYYY",
        ).format("MMM D, YYYY")}`;
      }
      return startDate === endDate ? startDate : `${startDate} - ${endDate}`;
    },
    getRemainingTime() {
      if (!this.proposalRequest) return { days: 0, hours: 0, mins: 0, seconds: 0 };
      let remainingMs = this.proposalRequest.expiredTime - new Date().getTime();
      if (remainingMs <= 0) {
        this.isTimeUp = true;
        this.openedModal = "timeIsUp";
        return { days: 0, hours: 0, mins: 0, seconds: 0 };
      }
      const days = Math.floor(remainingMs / 24 / 3600 / 1000);
      remainingMs = remainingMs - days * 24 * 3600 * 1000;
      const hours = Math.floor(remainingMs / 3600 / 1000);
      remainingMs = remainingMs - hours * 3600 * 1000;
      const mins = Math.floor(remainingMs / 60 / 1000);
      remainingMs = remainingMs - mins * 60 * 1000;
      const seconds = Math.floor(remainingMs / 1000);
      return { days, hours, mins, seconds };
    },
    eventTime() {
      if (!this.event) return "-";

      let startTime = moment(this.event.eventStartMillis).format("hh:mm a");
      let endTime = moment(this.event.eventEndMillis).format("hh:mm a");
      return startTime === endTime ? startTime : `${startTime} - ${endTime}`;
    },
    getEventDuration() {
      return moment.duration(this.event.eventEndMillis - this.event.eventStartMillis).humanize();
    },
    getLocation() {
      if (this.proposalRequest) {
        return this.event.location || "-";
      } else {
        return "-";
      }
    },
    suggestionDate() {
      return this.$store.state.vendorProposal.suggestionDate;
    },
  },
};
</script>
<style lang="scss" scoped>
section.proposal-header {
  background-color: #ffffff;
  position: relative;
  width: 100%;
  border-radius: 3px;
  -webkit-box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
  box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
  height: 200px;
  .suggest-date-help {
    width: 25px;
    height: 25px;
    background-color: #ffc001;
    border-radius: 50%;
    text-align: center;
    font-weight: 800;
    margin-left: 20px;
    position: relative;

    .date-tooltip {
      position: absolute;
      display: inline-block;
      width: 350px;
      padding: 24px 30px;
      color: #050505;
      font-size: 14px;
      left: 50%;
      top: 100%;
      text-align: center;
      background-color: #ffedbc;
      transform: translate(-53px, 20px);
      z-index: 2;
      cursor: pointer;
      h3 {
        font-size: 20px;
        font-weight: 800;
        margin-top: 0;
        margin-bottom: 17px;
      }
      p {
        font-size: 16px;
        max-width: 100% !important;
        margin: 0 !important;
      }

      &::after {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        top: 4px;
        left: 70px;
        box-sizing: border-box;

        border: 12px solid black;
        border-color: transparent transparent #ffedb7 #ffedb7;

        transform-origin: 0 0;
        transform: rotate(135deg);
      }
    }
  }
  .background-image {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
    overflow: hidden;
    &::after {
      position: absolute;
      width: 100%;
      height: 100%;
      content: "";
      top: 0;
      left: 0;
      background-color: #000;
      opacity: 0.6;
    }
    .default-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .concept-color {
      width: 250px;
      height: 200px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      .concept-image {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        object-fit: cover;
        transition: 0.2s;
      }
    }
  }
  .proposal-banner {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
    padding: 40px 60px;
    .header-content {
      color: white;
      margin: 20px 0;
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        li {
          padding: 5px 20px;
          &:first-child {
            padding-left: 0px;
          }
          &:not(:last-child) {
            border-right: solid 1px white;
          }
          .company-logo {
            max-height: 30px;
            max-width: 30px;
          }
        }
      }
    }
    .summary-cont {
      font-family: "Manrope-Regular", sans-serif;
      width: calc(100% - 454px);
      margin: 10px 0;
      ul {
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0;
        margin: 0;
        color: white;
        li {
          font-size: 16px;
          font-weight: bold;
          padding: 0px 25px;
          display: flex;
          margin-right: 0px;
          border-right: solid 1px white;
          position: relative;
          &:first-child {
            padding-left: 0px;
          }
          &:last-child {
            border-right: none;
          }
          img {
            width: 20px;
            margin-right: 10px;
          }

          i {
            color: #818080;
            padding-right: 8px;
          }

          &.with-help {
            background: #ffedb7;
            cursor: pointer;
            position: relative;

            img {
              &.question {
                margin-left: 12px;
                margin-right: 0;
              }
            }
          }

          &:last-child {
            margin-right: 0;
          }
        }
      }
      p {
        font-size: 16px;
        font-weight: normal;
        color: #050505;
        max-width: 60%;
        margin: 2rem 0;
      }
      .a-right {
        text-align: right;
        max-width: 60%;

        i {
          position: relative;
          top: -1px;
        }
      }
    }
  }

  .pull-bottom-right {
    position: absolute;
    right: 64px;
    top: 50%;
    transform: translateY(-50%);
  }
  .full-details-modal {
    &__header {
      width: 100%;
      padding: 55px 295px 24px 31px;
      .header-description {
        font-size: 16px;
        line-height: 1.69;
        max-width: 750px;
      }
      & + .close {
        background: transparent;
        border: none;
        position: absolute;
        top: 61px;
        right: 60px;
        color: #050505;
        cursor: pointer;

        img {
          width: 20px;
        }
      }
    }
    &__body {
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        padding-bottom: 26px;

        li {
          padding-left: 31px;
          text-align: left;
          margin-bottom: 50px;

          strong {
            min-width: 86px;
            margin-right: 20px;
            display: inline-block;
          }

          img {
            width: 18px;
            margin-right: 26px;
          }

          span {
            font-size: 20px;
            strong {
              font-weight: bold;
            }
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    &__footer {
      padding: 1rem;
      margin-top: -2rem;
    }
  }
  .see-full {
    font-size: 16px;
    font-weight: 800;
    color: white !important;
    cursor: pointer;

    i {
      color: white !important;
    }
    &:visited {
      color: #f51355 !important;
    }
  }
}
</style>
