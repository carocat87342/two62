<template>
  <div class="note-item d-flex justify-content-between"  :key="note.id">
    <template v-if="!note.isDeleted">
      <div class="note-item-mark">
        <md-checkbox v-model="isCompleted" class="md-simple md-checkbox-circle"></md-checkbox>
      </div>
      <div class="note-item-description">{{note.description}}</div>
      <div class="note-item-actions">
        <md-button class="edit-btn md-simple" @click="editNote">
          <img :src="`${$iconURL}Event%20Page/edit-dark.svg`" />
        </md-button>
        <md-button class="edit-btn md-simple" @click="deleteNote">
          <img class="trash" :src="`${$iconURL}Timeline-New/Trash.svg`" />
        </md-button>
      </div>
    </template>
    <template v-else>
      <div class="d-flex note-item-deleted">
        <div>You have been deleted</div>
          <md-button class="md-simple edit-btn" @click="cancel">Undo</md-button>
          <md-button class="md-simple edit-btn md-black" @click="remove"><md-icon>close</md-icon></md-button>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "event-note-item",
  props: {
    note: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      isCompleted: this.note.isCompleted || false
    };
  },
  methods: {
    ...mapActions("event", ["deleteEventNote", "updateEventNote", "removeNote"]),
    editNote() {
      this.$emit("edit", this.note);
    },
    deleteNote() {
      this.note.isDeleted = true
      this.updateEventNote(this.note);
    },
    cancel() {
      this.note.isDeleted = false
      this.updateEventNote(this.note);
    },
    remove() {
      this.removeNote(this.note);
    }
  },
  
  watch: {
    isCompleted(newValue, oldValue) {
      this.note.isCompleted = newValue
      this.updateEventNote(this.note);
    }
  },
};
</script>
<style lang="scss" scoped>
.note-item {
  margin: 20px 0;
  &-mark {
    width: 30px;
    height: 30px;
  }
  &-description {
    max-width: calc(100% - 80px);
    flex-grow: 1;
    padding: 18px 5px 5px 15px;
    text-align: left;
  }
  &-actions {
    width: 50px;
    min-width: 50px;
    white-space: nowrap;
    padding: 16px 0;
    .edit-btn {
      opacity: 0;
      img {
        width: 18px;
        &.trash {
          width: 15px;
        }
      }
    }
  }
  &-deleted {
    padding: 15px 30px;
    background: #ffe5ec;
    width: 100%;
    justify-content: space-between;
  }
  &:hover {
    .note-item-actions {
      .edit-btn {
        opacity: 1;
      }
    }
  }
}
</style>