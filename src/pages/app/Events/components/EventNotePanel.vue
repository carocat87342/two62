<template>
  <div class="note-panel">
    <div class="note-panel-header d-flex justify-content-between">
      Notes
      <event-notes-filter @filter="filterNotes" :filterUsers="getFilterUsers"></event-notes-filter>
    </div>
    <div class="note-panel-content" v-if="notes.length === 0">
      <div>
        <img :src="`${$iconURL}Notes/note-background.svg`" width="120px" />
      </div>
      <span class="color-red">
        Add your personal tasks & notes
        <br />to get things done
      </span>
    </div>
    <maryoku-input v-model="editingNote.description" placeholder="Add new note..."></maryoku-input>
    <div v-if="showEditor">
      <div class="setting-item">
        <div class="d-flex justify-content-between align-center">
          <div>
            <img :src="`${$iconURL}Notes/bell-dark.svg`" />Remind me on
          </div>
          <md-switch v-model="editingNote.isReminding"></md-switch>
        </div>
        <div class="d-flex" v-if="editingNote.isReminding">
          <maryoku-input
            v-model="editingNote.remindingDateString"
            inputStyle="date"
            placeholder="DD/MM/YY"
            readonly
          ></maryoku-input>
          <div style="width:20px"></div>
          <maryoku-input
            v-model="editingNote.remindingTimeString"
            inputStyle="time"
            placeholder="00:00 PM"
            readonly
          ></maryoku-input>
        </div>
      </div>
      <div class="setting-item">
        <div class="d-flex justify-content-between align-center">
          <div>
            <img :src="`${$iconURL}Notes/users-dark.svg`" />Give it to someone else
          </div>
          <md-switch v-model="editingNote.isGivenEmail"></md-switch>
        </div>
        <maryoku-input v-if="editingNote.isGivenEmail" v-model="editingNote.givingEmail"></maryoku-input>
      </div>
      <div class="text-right">
        <md-button class="md-simple md-black normal-btn" @click="clear">Clear</md-button>
        <md-button class="md-default md-red normal-btn" @click="saveNote" type="email">Save</md-button>
      </div>
    </div>
    <div class="note-items">
      <event-note-item v-for="(note) in notes" :key="note.id" :note="note" @edit="setEditNote"></event-note-item>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { MaryokuInput, TimeInput } from "@/components";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventNote from "@/models/EventNote";

import EventNoteItem from "./EventNoteItem";
import EventNotesFilter from "./EventNotesFilter";
import moment from "moment";

export default {
  name: "event-note-panel",
  components: {
    MaryokuInput,
    TimeInput,
    EventNoteItem,
    EventNotesFilter
  },
  data() {
    return {
      showEditor: false,
      boolean: false,
      editingNote: {
        description: "",
        isReminding: false,
        isGivenEmail: false,
        givingEmail: "",
        remindingDateString: "",
        remindingTimeString: "",
        remindingTime: 0
      }
    };
  },
  methods: {
    ...mapActions("event", ["getEventNotes", "addEventNote"]),
    clear() {
      this.editingNote = {
        description: "",
        isReminding: false,
        isGivenEmail: false,
        remindingDateString: "",
        remindingTimeString: "",
        remindingTime: 0,
        givingEmail: "",
        id: ""
      };
    },
    saveNote() {
      const newNote = { ...this.editingNote };
      newNote.remindingTime = moment(
        `${this.editingNote.remindingDateString} ${this.editingNote.remindingTimeString}`,
        "DD.MM.YYYY hh:mm A"
      ).valueOf();
      this.addEventNote(newNote);
      this.showEditor = false;
      this.clear();
      this.$forceUpdate();
    },
    setEditNote(note) {
      console.log(note);
      this.editingNote = {
        id: note.id,
        description: note.description,
        isReminding: note.isReminding,
        remindingDateString: note.remindingDateString,
        remindingTimeString: note.remindingTimeString,
        remindingTime: note.remindingTime,
        givingEmail: note.givingEmail
      };
      console.log(this.editingNote);
      this.showEditor = true;
    },
    filterNotes(filters) {
      const calendarId = this.$auth.user.defaultCalendarId;
      const eventId = this.event.id;
      this.getEventNotes({ calendarId, eventId, filters });
    }
  },
  created() {
    const calendarId = this.$auth.user.defaultCalendarId;
    const eventId = this.event.id;
    this.getEventNotes({ calendarId, eventId });
  },
  computed: {
    ...mapState("event", {
      event: state => state.eventData,
      notes: state => state.notes
    }),
    getFilterUsers() {
      const users = [];
      this.notes.forEach(item => {
        if (item.givingEmail && users.indexOf(item.givingEmail) < 0)
          users.push(item.givingEmail);
      });
      return users;
    }
  },
  watch: {
    editingNote: {
      deep: true,
      handler(newValue, oldValue) {
        if (newValue.description) {
          this.showEditor = true;
        } else {
          this.showEditor = false;
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.note-panel {
  width: 80%;
  margin: auto;
  &-header {
    font-size: 22px;
    font-family: "Manrope-ExtraBold";
    text-align: left;
    margin-bottom: 20px;
  }
  &-content {
    padding: 20px 0px;
  }
  .setting-item {
    margin: 20px 0px;
    img {
      width: 23px;
      margin-right: 10px;
    }
  }
  .note-items {
    margin-top: 10px;
    max-height: 500px;
    overflow-y: auto;
  }
}
</style>