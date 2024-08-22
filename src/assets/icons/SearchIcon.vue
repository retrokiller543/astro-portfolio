<template>
  <svg :xmlns="xmlns" :height="height" :viewBox="viewBox" :width="width" :fill="fillColor">
    <path
      d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
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