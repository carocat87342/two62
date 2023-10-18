<template>
  <div class="event-budget-requirement step2">
    <div class="container text-center">
      <div class="event-budget-flexibility event-basic-info">
        <div class="font-size-40 font-bold">
          2/2
        </div>
        <div class="font-size-40 font-bold text-transform-uppercase mt-3">
          Who’s calling the shots? 
        </div>
        <div class="mt-1">What character would you say he or she resembles?</div>
          <div class="mt-1 movies">
            <div 
              v-for="(movie) in movies" :key="movie.label"
              class="movie-card"
              :class="{selected:movie.label == selectedMovie.label}" 
              @click="selectedMovie=movie" 
              >
              <div class="movie-tip">
                <img :src="`${$iconURL}Event%20Page/light.svg`" width="18" >
                <transition name="fade">
                  <div class="tool-tip" v-html="movie.description">
                    <!-- {{movie.description}} -->
                      <!-- <b class="font-weight-bold">{{movie.label}}</b> is a queen bee. She likes things 
                      the way she likes them. At times she can seem 
                      bossy or hard to please - her standards are 
                      extremely high and your budget better be 
                      impeccable for her to approve it -->
                  </div>
                </transition>
              </div>
              <div class="movie-thumb">
                <img :src="`${$storageURL}${movie.icon}`"/>
              </div>
              <div class="movie-title" >
                <md-checkbox class="md-checkbox-circle md-red " v-model="selectedMovie" :value="movie"><span class="movie-label">{{movie.label}}</span></md-checkbox>
              </div>
              
            </div>
          </div>
      </div>
    </div>
  </div>  
</template>
<script>

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { MaryokuInput } from '@/components'
import 'vue-range-slider/dist/vue-range-slider.css'
import RangeSlider from 'vue-range-slider'
import moment from 'moment'

export default {
  components: {
    RangeSlider,
    MaryokuInput
  },
  props: {
    defaultData: {
      type: Object,
      default: {}
    },
  },
  created () {
    console.log(this.defaultData)
    if (this.defaultData && this.defaultData.label) {
      this.selectedMovie = this.movies.find(item => item.label == this.defaultData.label)
      console.log(this.selectedMovie)
    }
  },
  data() {
    return {
      selectedMovie:{},
      movies: [
        {
          icon: "movies/captain-kirk2.jpg",
          label: "Captain kirk",
          description: `When <b>Kirk</b> walks into a room, all eyes are on him. He is charismatic, charming, and confident. Though he is comfortable delegating responsibilities, Kirk typically lead by example and is never afraid to get into the trenches to fight alongside his crew. He is super inclusive and will likely care more about RSVP and participants feedback than about cost`
        },{
          icon: "movies/dirty-harry2.jpg",
          label: "Dirty Harry",
          description: `<b>Harry</b> is not a "company man" and not a real team player (his partners got killed or wounded at an alarming rate). But, what he did have was laser focus on achieving his goals. His moto is do what you have to do, and we bet he'll track RSVP like a hawk and deal personally with non comers`
        },{
          icon: "movies/jerry-seinfeld.jpg",
          label: "Jerry Seinfeld",
          description: "<b>Seinfeld</b> is very meticulous about the cleanliness and organization of his apartment. He is stubborn and holds on tightly to his opinions. He isn't easy to convince so every vendor you select must be dead on for him to approve the plan"
        },{
          icon: "movies/joan-harris.jpg",
          label: "Joan Harris",
          description: "<b>Joan Harris</b> is a queen bee. She likes things the way she likes them. At times she can seem bossy or hard to please - her standards are extremely high and your budget better be impeccable for her to approve it"
        },{
          icon: "movies/mirandapreistly.jpg",
          label: "Miranda Preistly",
          description: "<b>Miranda Priestly</b> personifies qualities of a classic A type boss: controlling, demanding and impossible to please. Her favorite words to utter after all are “do it correctly”, you may try to, but we all know how this will end"
        },{
          icon: "movies/soprano.jpeg",
          label: "Tony Soprano",
          description: "<b>Tony Soprano</b> doesn't like to wait, Impatience is a key characteristic for him. With visibility over how the plan is advancing, you will gain his trust and ensure a smooth approval"
        },
      ]
    }
  },
  watch: {
    selectedMovie: {
      handler(val){
        console.log(val)
        this.$emit("change", val)
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
  .movies {
    display: flex;
    flex-flow: wrap;
    justify-content: space-around;
    margin: auto;
    .movie-card {
      display: inline-block;
      margin: 20px 40px;
      text-align: left;
      position: relative;
      &.selected {
        .movie-thumb {
          box-shadow: 0 3px 10px 0 rgba(245, 19, 85, 0.43);
        }
        .movie-label {
          color: #f51355;
          font-weight: bold;
        }
        
      }
      .movie-thumb {
        border-radius: 3px;
        img {
          border-radius: 3px;
          width: 260px;
          height: 200px;
          object-fit: cover;
          // object-position: top;
          object-position: 90% 20%;
        }
        &:hover {
           box-shadow: 0 3px 10px 0 rgba(245, 19, 85, 0.43);
        }
      }
      .movie-title {
          .md-theme-default {
            margin-top: 16px;
          }
          margin-top: 10px;
        }
      .movie-tip {
        position: absolute;
        right: 20px;
        top: 20px;

        img {
          background-color: white;
          border-radius: 50%;
          cursor: pointer;
        }
        &:hover{
          .tool-tip {
            display: block;
          }
        }
      }
      .tool-tip {
        width: 300px;
        // height: 192.5px;
        right:-30px;
        bottom: 40px;
        padding: 20px;
        box-shadow: 0 3px 21px 0 rgba(0, 0, 0, 0.21);
        background-color: #ffedb7;
        position: absolute;
        display: none;
        z-index: 20;
        &::after{
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 15px solid #ffedb7;
          // box-shadow: 0 3px 21px 0 rgba(0, 0, 0, 0.21);
          content: "";
          bottom: -15px;
          position: absolute;
          right: 30px;
        }
      }
    }
  }
</style>