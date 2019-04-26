import debug from "../../../node_modules/debug";

export default {
    methods: {
        log: function (...args) {
            debug.log(...args);
        }
    }
}
