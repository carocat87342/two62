<template>
    <div class="header-actions" :class="className">
        <ul class="d-flex list-style-none">
            <template v-for="action in actions">
                <li v-if="action.key === 'share' || action.key === 'download' && !hideDownload || action.key === 'comment' && canComment" class="md-small-hide">
                    <md-button
                        class="md-simple md-just-icon"
                        :class="[action.key === 'comment' && isCommentMode ? 'active': '', action.key !== 'share' ?'md-small-hide':'']"
                        @click="click(action.key)">
                        <img :src="`${$iconURL}${action.icon}`" />
                    </md-button>
                </li>
            </template>
        </ul>
        <sharing-modal
            v-if="isSharing"
            :page="page"
            @share="shareLink"
            @cancel="isSharing = false"/>
    </div>
</template>
<script>
import SharingModal from "@/components/Modals/SharingModal";
import { HeaderActions } from "@/constants/tabs";

export default {
  name: "header-actions",
  components: {
    SharingModal,
  },
  props: {
    className: {
       type: String,
       default: '',
    },
    hideDownload: {
      type: Boolean,
      default: false,
    },
    page: {
      type: String,
      default: 'event',
    }
  },
  data() {
    return {
      actions: HeaderActions,
      isCommentMode: false,
      isSharing: false,
    };
  },
  created() {
    const tenantId = this.$authService.resolveTenantId();
  },
  methods: {
    click(key) {
      console.log('action', key);
      if (key === 'download') {
          this.$emit("export", { type: "pdf" });
      } else if (key === 'share') {
          this.isSharing = !this.isSharing;
      } else if (key === 'comment') {
          this.isCommentMode = !this.isCommentMode;
          this.$emit("toggleCommentMode", this.isCommentMode);
      }
    },

    shareLink(args){
      this.$emit("share", {...args, cb: params => {
          console.log('shareLink', params);
          this.isSharing = false;
        }})
    }
  },
  computed: {
    permission() {
      try {
        return this.$store.state.event.eventData.permit;
      } catch (e) {
        return "edit";
      }
    },
    canComment() {
      return this.canEdit || this.permission === "comment";
    },
    canEdit() {
      return !this.permission || this.permission === "edit";
    },
  },
};
</script>
