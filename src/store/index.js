import Vue from 'vue'
import Vuex from 'vuex'
import StopPointsDiscoveryStore from "./modules/stop-points-discovery-state";
import StopMonitoringStore from "./modules/stop-monitoring-state";

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: true,
    modules: {
        stopPointsDiscovery: StopPointsDiscoveryStore,
        stopMonitoring: StopMonitoringStore,
    }
});

export default store;

