<template>
    <div class="event-summery">
        <div class="container">
            <div class="summery-section">
                <h1>Here what happened next</h1>

                <div class="event-steps">
                    <div class="event-steps__item">
                        3 Ideas for Event Concepts
                    </div>
                    <div class="event-steps__item">
                        Detailed timeline
                    </div>
                    <div class="event-steps__item">
                        detailed budget table
                    </div>
                    <div class="event-steps__item">
                        vendor proposals
                    </div>
                </div>

                <div class="wizard small row ">
                    <a href="">Within 24 hour</a>
                    <a href="">+ 12 hour</a>
                    <a href="">+ 12 hour</a>
                    <a href="">Within a week</a>
                </div>

                <div class="event-dashboard-desc">
                    <img src="https://www.maryoku.com/img/events-img3.png">
                    <div class="event-dashboard-desc__content">
                        <h4>You will get a designed event site to engage your invitees and for them to RSVP</h4>
                        <p>
                            Some text here Some text here klere klkle text here
                        </p>
                    </div>
                </div>

            </div>
            <div class="price-submit-section">
                <div class="form-section">
                    <div class="price-desc">
                        <div class="desc-item">
                            <div class="item-label">Price</div>
                            <div class="item-value">$60</div>
                        </div>
                        <div class="desc-item">
                            <div class="item-label">
                                <md-checkbox v-model="agree">I agree to showcase this event in Maryoku library</md-checkbox>

                            </div>
                            <div class="item-value">-$60</div>
                        </div>
                    </div>

                    <div class="total-and-submit">
                        <div class="desc-item total-desc">
                            <div class="item-label">Total</div>
                            <div class="item-value">$0</div>
                        </div>

                        <md-button
                            @click="createEvent"
                            class="md-rose next-btn custom-btn">Submit
                        </md-button>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import GoBack from './componenets/GoBack'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import numeral from 'numeral'
import EventComponent from '@/models/EventComponent'
import CalendarEvent from '@/models/CalendarEvent'
import Calendar from '@/models/Calendar'

export default {
  components: {
    GoBack
  },
  data () {
    return {
      agree: true
    }
  },
  created () {
    // create new event

    this.$auth.currentUser(this, false, () => {

    })
  },
  methods: {

    createEvent () {
      this.$router.push({ path: `/event-created`})
    }

  },
  computed: {
    ...mapState('PublicEventPlanner', [
      'publicEventData'
    ])
  }

}
</script>
<style lang="scss">
    $baseColor : #5c2153;
    @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap');
    @import url('https://fonts.googleapis.com/css?family=Rubik:400,500,700&display=swap');

    html,
    body {
        height: 100%;
        >div , .create-event {
            height: 100%;
        }
    }

    .event-summery {
        border-top : 50px solid $baseColor;
        font-family: 'Open Sans',sans-serif;
        padding : 4em 0;

        .container {
            max-width : 1200px;
            margin : 0 auto;

            .summery-section {
                width : 70%;

                h1 {
                    color : $baseColor;
                    font-weight: 500;
                    font-size: 38px;
                    margin : 0 0 2em;
                }

                .event-steps {
                    display: flex;
                    flex : 1;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    color : $baseColor;
                    width : 648px;
                    margin-bottom : 1em;

                    &__item {
                        height : 100px;
                        padding : 0 2em;
                        display: flex;
                        align-items: center;

                        &:not(:last-child) {
                            border-right : 1px dashed #cdcdcd;
                        }
                    }
                }

                .event-dashboard-desc {

                    display: flex;
                    flex : 1;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    margin-top : 3em;

                    img {
                        width: 348px;
                        height: 241px;
                    }

                    &__content {
                        display: flex;
                        align-items: center;
                        font-size: 18px;
                        flex-direction: column;
                        width : 30%;

                        h4 {
                            color : #6B1262;
                            font-weight: 500;
                            margin : 0 0 1em;
                        }
                        p {
                            color : #606060;
                            margin : 0;
                        }
                    }
                }
            }

            .price-submit-section {
                .form-section {
                    background: #FFFFFF;
                    box-shadow: 0 12px 24px #0000000D;
                    border-radius: 18px;
                    padding : 2em;
                    width: 348px;

                    .price-desc {

                        border-bottom: 1px dashed #cdcdcd;
                        padding-bottom: 2em;
                        margin-bottom: 2em;
                    }
                    .desc-item {
                        display: flex;
                        flex : 1;
                        justify-content: space-between;
                        margin-bottom : 1em;
                        color : #641956;
                        font-weight: 600;
                        .item-label {
                            .md-checkbox.md-theme-default label {
                                color : #641956;
                                font-weight: 600;

                            }
                        }
                        .item-value {

                        }

                        &.total-desc {
                            .item-value {
                                font-size: 30px;
                                font-weight: 700;
                            }
                        }
                    }

                    .md-button.custom-btn  {
                        width : 100%;
                        margin-top : 2em;
                    }

                }
            }
        }

        .wizard a {
            padding: 17px 12px;
            position: relative;
            display: inline-block;
            text-decoration: none;
            min-width: 20%;
            margin-left:0;
            text-align: center;
            text-decoration: none;
            font-size: 15px;
            background: #EBEBEB;
            text-transform: initial;
            cursor: pointer;
            height : 56px;
            color : #fff;
            margin-right : -3px

        }

        .wizard a:hover {
            text-decoration: none;
            color : #fff !important;
        }

        .wizard a:not(:first-child) {
        }

        .wizard a:last-child {
            border-radius: 0 10px  10px 0;
        }

        .wizard:not(.left-arrow) a:after {
            width: 0;
            height: 0;
            border-top: 28px inset transparent;
            border-bottom: 28px inset transparent;
            border-left: 28px solid #EBEBEB;
            position: absolute;
            content: "";
            top: 0;
            right: -28px;
            z-index: 2;
        }

        .wizard a {
            &:first-child {
                margin-left: 0;
                border-radius: 10px 0 0 10px;
                background: #9F2888;

                &:after {
                    border-left: 28px solid #9F2888;

                }
            }

            &:nth-child(2) {
                background: #1FBBD2;

                &:after {
                    border-left: 28px solid #1FBBD2;
                    right: -27px;

                }
            }

            &:nth-child(3) {
                background: #FFC000;

                &:after {
                    border-left: 28px solid #FFC000;
                    right: -27px;

                }
            }

            &:last-child {
                background: #641956;
                width: 180px !important;

                &:after {
                    border-left: 28px solid #641956;

                }
            }

        }

        .wizard a:first-child:before,
        .wizard a:last-child:after {
            border: none;
        }

    }

</style>
