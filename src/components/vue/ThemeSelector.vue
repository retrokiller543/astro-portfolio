<template>
  <div class="navbar-item has-dropdown is-hoverable">
    <button class="navbar-link">Themes</button>
    <div class="navbar-dropdown">
      <button :class="{ 'is-active': currentTheme === 'light' }" class="navbar-item"
        @click="changeTheme('light')">Light</button>
      <button :class="{ 'is-active': currentTheme === 'dark' }" class="navbar-item"
        @click="changeTheme('dark')">Dark</button>
      <button :class="{ 'is-active': currentTheme === 'nord' }" class="navbar-item"
        @click="changeTheme('nord')">Nord</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThemeSelector',
  data() {
    return {
      currentTheme: window.localStorage.getItem('theme') || 'light'
    };
  },
  methods: {
    changeTheme(theme) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  },
  beforeCreate() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
};
</script>

<style lang="scss">
[data-theme="nord"] .navbar-item.is-active {
  color: var(--polar-night-0) !important;
}

[data-theme="dark"] .navbar-item.is-active {
  color: var(--bulma-text-dark) !important;
}
</style>