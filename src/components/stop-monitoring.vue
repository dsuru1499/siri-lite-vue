<template>
  <div>
    <h5>#{{ counter }} StopMonitoring: {{ name }}</h5>
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Departure</th>
          <th>Destination</th>
          <th>Line</th>
          <th>#</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="value in values" :key="value.id">
          <th
            scope="row"
          >{{ value.MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime | moment("HH:mm") }}</th>
          <td>{{ value.MonitoredVehicleJourney.DestinationName | uppercase }}</td>
          <td>{{ value.MonitoredVehicleJourney.PublishedLineName | uppercase }}</td>
          <td>
            <a class="blue-text">
              <font-awesome-icon style="color: steelblue;" icon="bus"/>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import * as T from "../types";
import store from "../store";

export default {
  name: "StopMonitoring",
  props: {
    name: {
      type: String
    },
    length: {
      type: Number,
      default: 10
    }
  },
  store,
  data: function() {
    return {
      counter: 0,
      timer: null
    };
  },

  computed: {
    values: function() {
      return this.$store.getters.values(this.name);
    }
  },

  watch: {
    values: function() {
      this.counter++;
    }
  },

  filters: {
    uppercase: function(value) {
      return _.upperCase(value);
    },

    moment: function(value, format) {
      return moment(value).format(format);
    }
  },

  mounted: function() {
    this.initialize();
  },

  beforeDestroy: function() {
    this.dispose();
  },
  
  // result = response.Siri.StopMonitoringDelivery.MonitoredStopVisit;
  methods: {
    initialize: function() {
      this.log("initialize %s", this.name);
      this.timer = setInterval(this.load, 10000);
      this.load();
    },

    dispose: function() {
      this.log("dispose %s", this.name);
      this.$store.commit({
        type: T.STOP_MONITORING_FAILURE,
        name: this.name
      });
      clearInterval(this.timer);
    },

    load: function() {
      // let url = "http://127.0.0.1:8080/siri-lite/stop-monitoring"
      let url =
        "/siri-lite/stop-monitoring" +
        "?" +
        T.MONITORING_REF +
        "=" +
        this.name +
        "&" +
        T.MAXIMUM_STOP_VISITS +
        "=" +
        this.length;
      this.$store.dispatch({
        type: T.STOP_MONITORING,
        name: this.name,
        payload: url
      });
    }
  }
};
</script>

<style lang="scss">
</style>
