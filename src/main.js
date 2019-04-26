import Vue from 'vue'
import App from './App.vue'
import store from "./store";
import BootstrapVue from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Debug from './mixins/debug'

import './main.scss'

Vue.mixin(Debug);

Vue.use(BootstrapVue);
library.add(fas);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount("#app")
