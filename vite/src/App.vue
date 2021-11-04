<template>
  <div>
    <div>{{count}}</div>
    <div>double: <span>{{doubleCount}}</span></div>
    <button class="btn" @click="addCount">click</button>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  setup() {
    let count = ref(0)

    let addCount = () => {
      count.value++
    }

    const doubleCount = computed(() => count.value * 2)

    return {
      count,
      addCount,
      doubleCount
    }
  },
}
</script>

<style scoped>
.btn {
  margin-top: 10px;
  outline: 0;
  border: 1px solid #6199ef;
  border-radius: 2px;
  background: #97c3e4;
  color: #fff;
  cursor: pointer;
}
</style>
