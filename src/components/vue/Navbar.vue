<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" to="/">VueApp</a>
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" @click="toggleMenu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div :class="['navbar-menu', { 'is-active': isActive }]">
      <div class="navbar-start">
        <a class="navbar-item" to="/">Home</a>
        <a class="navbar-item" to="/about">About</a>
      </div>
      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">Themes</a>
          <div class="navbar-dropdown">
            <a :class="{ 'is-active': currentTheme === 'light' }" class="navbar-item" @click="changeTheme('light')">Light</a>
            <a :class="{ 'is-active': currentTheme === 'dark' }" class="navbar-item" @click="changeTheme('dark')">Dark</a>
            <a :class="{ 'is-active': currentTheme === 'nord' }" class="navbar-item" @click="changeTheme('nord')">Nord</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isActive: false,
      currentTheme: window.localStorage.getItem('theme') || 'light'
    };
  },
  methods: {
    toggleMenu() {
      this.isActive = !this.isActive;
    },
    changeTheme(theme) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  },
  mounted() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
};
</script>

<style>
.navbar-item.is-active {
  font-weight: bold;
}
</style>

