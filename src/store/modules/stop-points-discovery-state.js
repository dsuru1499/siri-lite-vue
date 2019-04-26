import http from "../../services/stop-points-discovery-service";
import * as T from "../../types";

const StopPointsDiscoveryStore = {
    state: {
        response: null,
    },
    mutations: {
        [T.STOP_POINTS_DISCOVERY_SUCCESS](state, { payload }) {
            state.response = payload;
        },
        [T.STOP_POINTS_DISCOVERY_FAILURE](state, { payload }) {
            state.response = payload;
        }
    },
    actions: {
        [T.STOP_POINTS_DISCOVERY]({ commit }, { payload }) {
            return new Promise((resolve, reject) => {
                http.get(payload).then(response => {
                    commit({
                        type: T.STOP_POINTS_DISCOVERY_SUCCESS,
                        payload: response.data,
                    });
                    resolve();
                }).catch(() => {
                    commit({
                        type: T.STOP_POINTS_DISCOVERY_FAILURE,
                        payload: {},
                    })
                    reject();
                });
            });
        },
    }
};

export default StopPointsDiscoveryStore;