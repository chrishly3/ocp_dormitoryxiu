<template>
  <d2-container-iframe :src="src"/>
</template>
<script>
export default {
  name: 'Jeecp-Swagger',
  data () {
    return {
      src: `${process.env.VUE_APP_BASE_URL}/swagger-ui.html`
    }
  }
}
</script>
