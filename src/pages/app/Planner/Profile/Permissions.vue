<template>
  <div class="profile-permission">
    <div class="font-size-20 font-bold-extra">Add colleague to your projects</div>
    <div class="font-size-16 font-bold mt-40">Email</div>
    <div class="add-form">
      <maryoku-input v-model="newColleague.email" inputStyle="email"></maryoku-input>
      <div class="input-wrapper">
        <multiselect
          v-model="newColleague.role"
          :options="roles"
          :close-on-select="true"
          :clear-on-select="true"
          tag-placeholder="Add this as new tag"
          placeholder="User permission"
          label="title"
          track-by="id"
        ></multiselect>
      </div>
      <div class="input-wrapper">
        <multiselect
          v-model="newColleague.invitedEvent"
          :options="myEvents"
          :close-on-select="true"
          :clear-on-select="true"
          tag-placeholder="Add this as new tag"
          placeholder="Type to search event"
          label="title"
          track-by="id"
        ></multiselect>
      </div>
      <md-button class="maryoku-btn md-red" @click="addCollaborator">Add</md-button>
    </div>
    <hr class="mt-50 mb-50" />
    <div class="permision-list">
      <div class="permission-row">
        <div><img :src="userData.avatar" class="user-icon" /></div>
        <div>{{ userData.name }}</div>
        <div></div>
        <div class="color-gray">Owner</div>
        <div></div>
      </div>
      <permitted-user-row
        v-for="(user, index) in permittedUsers"
        :key="index"
        :index="index"
        :user="user"
        @remove="removeUser"
        @update="updateCollobrator"
      ></permitted-user-row>
    </div>
  </div>
</template>

<script>
import MaryokuInput from "@/components/Inputs/MaryokuInput.vue";
import PermittedUserRow from "./components/PermittedUserRow.vue";
import Collaborator from "@/models/Collaborator";
import CalendarEvent from "@/models/CalendarEvent";
export default {
  components: {
    MaryokuInput,
    PermittedUserRow,
  },
  data() {
    return {
      invitedEmail: "",
      permittedUsers: [{ name: "Rachel Mendelovich" }, { name: "Rachel Mendelovich" }, { name: "Rachel Mendelovich" }],
      roles: [
        { id: "edit", title: "Can Edit" },
        { id: "view", title: "Can View" },
        { id: "comment", title: "Can Comment" },
      ],
      newColleague: {
        email: "",
        role: { id: "edit", title: "Can Edit" },
        invitedEvent: "",
      },
      myEvents: [],
    };
  },
  created() {
    let filters = {
      filters: {
        myEvents: true,
      },
    };
    this.getCollaborators();
    this.$http
      .get(`${process.env.SERVER_URL}/1/events`, {
        params: filters,
      })
      .then((response) => {
        this.myEvents = response.data;
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  computed: {
    userData() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    addCollaborator() {
      new Collaborator({
        email: this.newColleague.email,
        role: this.newColleague.role.id,
        eventList: [new CalendarEvent({ id: this.newColleague.invitedEvent.id })],
      })
        .save()
        .then((res) => {
          this.permittedUsers.push(res);
          this.newColleague = {
            email: "",
            role: "edit",
            invitedEvent: null,
          };
        });
    },
    updateCollobrator() {
      this.getCollaborators();
    },
    removeUser(user) {
      const userIndex = this.permittedUsers.findIndex((item) => item.id == user.id);
      setTimeout(() => {
        this.permittedUsers.splice(userIndex, 1);
      }, 300);
    },
    getCollaborators() {
      new Collaborator().get().then((res) => {
        this.permittedUsers = res;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.profile-permission {
  padding-top: 60px;
  text-align: left;
  .add-form {
    display: grid;
    grid-template-columns: 40% 18% 30% 12%;
    .input-wrapper {
      padding: 0 10px;
      /deep/ .multiselect {
        box-shadow: 0 3px 13px 0 rgba(0, 0, 0, 0.15);
        border: none;
        .multiselect__tags {
          border: none;
        }
      }
    }
    .maryoku_input,
    input,
    button {
      height: 100%;
      margin: 0;
    }
  }
  .permision-list {
    .permission-row {
      display: grid;
      grid-template-columns: 80px 25% 25% 25% auto;
      padding: 20px 0;
      font-size: 16px;
      align-items: center;
      img.user-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        object-fit: cover;
      }
    }
  }
}
</style>