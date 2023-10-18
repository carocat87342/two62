<template>
  <div class="content">
    <div class="md-layout">

      <div class="md-layout-item md-medium-size-100 md-size-33">
        <user-card button-color="rose">

        </user-card>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <edit-profile-form header-color="rose">

        </edit-profile-form>
      </div>
    </div>
  </div>
</template>

<script>
import { EditProfileForm, UserCard } from '@/pages'
export default {
  components: {
    EditProfileForm,
    UserCard
  }
}
</script>
<style lang="scss">
.text-right {
  display: flex;
}
</style>
