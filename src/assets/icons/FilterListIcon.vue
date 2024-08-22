<template>
  <svg :xmlns="xmlns" :height="height" :viewBox="viewBox" :width="width" :fill="fillColor">
    <path d="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z" />
  </svg>
</template>

<script>
export default {
  props: {
    fillColor: {
      type: String,
      default: 'var(--bulma-text, #ffff)'
    },
    xmlns: {
      type: String,
      default: 'http://www.w3.org/2000/svg'
    },
    height: {
      type: String,
      default: '24px'
    },
    width: {
      type: String,
      default: '24px'
    },
    viewBox: {
      type: String,
      default: '0 -960 960 960'
    }
  }
}
</script>