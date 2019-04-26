<template>
  <div id="app">
    <stop-points-discovery :center="[48.866667,2.333333]"/>
  </div>
</template>

<script>
import StopPointsDiscovery from "./components/stop-points-discovery";

export default {
  name: "app",
  components: {
    StopPointsDiscovery
  }
};
</script>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
}

html,
body {
  height: 100%;
  width: 100%;
}
</style>
