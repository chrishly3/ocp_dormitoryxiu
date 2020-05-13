<template>
  <d2-container-iframe :src="src"/>
</template>
<script>
export default {
  name: 'Jeecp-jobInfo',
  data () {
    return {
      src: `http://localhost:8888/jobinfo`
    }
  }
}
</script>
