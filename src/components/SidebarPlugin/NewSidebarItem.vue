<template>
  <component
    :is="baseComponent"
    :to="link.path ? link.path : '/'"
    :class="{ active: isActive, disable: disabled }"
    tag="li"
  >
    <a
      v-if="isMenu"
      href="#"
      class="nav-link sidebar-menu-item"
      :aria-expanded="!collapsed"
      data-toggle="collapse"
      @click.prevent="collapseMenu"
    >
      <md-icon class="font-size-30">{{ link.icon }}</md-icon>
      <p>
        {{ link.name }}
        <b class="caret"></b>
      </p>
    </a>

    <collapse-transition>
      <div v-if="$slots.default || this.isMenu" v-show="!collapsed">
        <ul class="nav">
          <slot></slot>
        </ul>
      </div>
    </collapse-transition>

    <slot name="title" v-if="children.length === 0 && !$slots.default && link.path">
      <component
        :to="disabled ? '' : link.path"
        @click.native="linkClick"
        :is="elementType(link, false)"
        :class="{ active: link.active }"
        class="nav-link"
        :target="link.target"
        :href="disabled ? '' : link.path"
      >
        <template v-if="addLink">
          <md-icon class="font-size-30" v-if="link.icon">{{ link.icon }}</md-icon>
          <span class="sidebar-mini" v-else>{{ linkPrefix }}</span>
        </template>
        <template v-else>
          <md-icon v-if="link.icon" class="font-size-30" :style="{ color: disabled ? '#a0a0a0 !important' : '#000' }">
            {{ link.icon }}
          </md-icon>
          <img v-else :src="isActive ? link.iconActiveUrl : link.iconUrl" />
        </template>
        <span class="badge-mark" v-if="hasBadge"></span>
      </component>
    </slot>
  </component>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";

export default {
  name: "sidebar-item",
  components: {
    CollapseTransition,
  },
  props: {
    menu: {
      type: Boolean,
      default: false,
    },
    link: {
      type: Object,
      default: () => {
        return {
          name: "",
          path: "",
          children: [],
        };
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hasBadge: {
      type: Boolean,
      default: false,
    }
  },
  provide() {
    return {
      addLink: this.addChild,
      removeLink: this.removeChild,
    };
  },
  inject: {
    addLink: { default: null },
    removeLink: { default: null },
    autoClose: {
      default: true,
    },
  },
  data() {
    return {
      children: [],
      collapsed: true,
    };
  },
  computed: {
    baseComponent() {
      return this.isMenu || this.link.isRoute ? "li" : "router-link";
    },
    linkPrefix() {
      if (this.link.name) {
        let words = this.link.name.split(" ");
        return words.map((word) => word.substring(0, 1)).join("");
      }
    },
    isMenu() {
      return this.children.length > 0 || this.menu === true;
    },
    isActive() {
      if (this.$route.path.startsWith(this.link.startLink)) {
        this.link.active = true;
        return true;
      }

      if (this.$route && this.$route.path) {
        let matchingRoute = this.children.find((c) => this.$route.path.startsWith(c.link.startLink));
        if (matchingRoute !== undefined) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    addChild(item) {
      const index = this.$slots.default.indexOf(item.$vnode);
      this.children.splice(index, 0, item);
    },
    removeChild(item) {
      const tabs = this.children;
      const index = tabs.indexOf(item);
      tabs.splice(index, 1);
    },
    elementType(link, isParent = true) {
      if (link.isRoute === false) {
        return isParent ? "li" : "a";
      } else {
        return "router-link";
      }
    },
    linkAbbreviation(name) {
      const matches = name.match(/\b(\w)/g);
      return matches.join("");
    },
    linkClick() {
      if (this.autoClose && this.$sidebar && this.$sidebar.showSidebar === true) {
        this.$sidebar.displaySidebar(false);
      }
    },
    collapseMenu() {
      this.collapsed = !this.collapsed;
    },
    collapseSubMenu(link) {
      link.collapsed = !link.collapsed;
    },
  },
  mounted() {
    if (this.addLink) {
      this.addLink(this);
    }
    if (this.link.collapsed !== undefined) {
      this.collapsed = this.link.collapsed;
    }
    if (this.isActive && this.isMenu) {
      this.collapsed = false;
    }

  },
  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    if (this.removeLink) {
      this.removeLink(this);
    }
  },
};
</script>
<style>
.sidebar-menu-item {
  position: relative;
  cursor: pointer;
}
.badge-mark {
    display: block;
    width: 12px;
    height: 12px;
    background-color: #f51355;
    border-radius: 50%;
    z-index: 1;
    right: 15px;
    top: 20px;
    position: absolute;
    transform: translate(-50%);
}
</style>
