<template>
  <d2-container-iframe :src="src"/>
</template>
<script>
export default {
  name: 'Jeecp-EUREKA',
  data () {
    return {
      src: `${process.env.VUE_APP_GOVERNANCE_URL}`
    }
  }
}
</script>
