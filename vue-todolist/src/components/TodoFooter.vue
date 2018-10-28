<template lang="html">
  <div class="clearAllContainer">
    <span class="clearAllBtn" @click="clearTodo">Clear All</span>
  </div>
</template>

<script>
export default {
  methods: {
    clearTodo() {
      this.$emit('removeAll');
    }
  }
}
</script>

<style scoped>
  .clearAllContainer {
    width: 8.5rem;
    height: 50px;
    line-height: 50px;
    background-color: #E20303;
    border-radius: 5px;
    margin: 0 auto;
  }
  .clearAllBtn {
    color: white;
    display: black;
  }
</style>
