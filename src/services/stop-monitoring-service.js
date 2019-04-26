import axios from "axios";

const StopMonitoringService = {
    get: function (url) {
        return axios.get(url, {
            "Content-Type": "application/json"
        });
    }
}

export default StopMonitoringService;
