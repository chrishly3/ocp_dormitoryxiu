<template>
  <d2-container-iframe :src="src"/>
</template>
<script>
export default {
  name: 'Jeecp-jobGroup',
  data () {
    return {
      src: `http://localhost:8888/jobgroup`
    }
  }
}
</script>
