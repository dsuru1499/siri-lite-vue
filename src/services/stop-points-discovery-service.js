import axios from "axios";

const StopPointsDiscoveryService = {
    get: function (url) {
        return axios.get(url, {
            "Content-Type": "application/json"
        });
    }
}

export default StopPointsDiscoveryService;
