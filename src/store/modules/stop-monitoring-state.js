import Vue from "vue";
import http from "../../services/stop-monitoring-service";
import * as T from "../../types";

const StopMonitoringStore = {
    state: {
        responses: {},
    },

    getters: {
        responses: (state) => (name) => {
            return state.responses[name];
        },
        values: (state) => (name) => {
            let response = state.responses[name];
            return (response)
                ? response.Siri.StopMonitoringDelivery.MonitoredStopVisit
                : [];
        },
    },

    mutations: {
        [T.STOP_MONITORING_SUCCESS](state, { name, payload }) {
            Vue.set(state.responses, name, payload)
        },
        [T.STOP_MONITORING_FAILURE](state, { name }) {
            delete state.responses[name];
        }
    },

    actions: {
        [T.STOP_MONITORING]({ commit }, { name, payload }) {
            return new Promise((resolve, reject) => {
                http.get(payload).then(response => {
                    commit({
                        type: T.STOP_MONITORING_SUCCESS,
                        name: name,
                        payload: response.data,
                    });
                    resolve();
                }).catch(() => {
                    commit({
                        type: T.STOP_MONITORING_FAILURE,
                        name: name,
                        payload: {},
                    })
                    reject();
                });
            });
        },
    }
};

export default StopMonitoringStore;