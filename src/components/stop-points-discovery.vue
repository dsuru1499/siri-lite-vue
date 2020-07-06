<template>
  <div id="map"></div>
</template>

<script>
import Vue from "vue";
import * as L from "leaflet";
import * as T from "../types";
import StopMonitoring from "./stop-monitoring";

export default {
  name: "StopPointsDiscovery",
  props: {
    url: {
      type: String,
      default: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    },
    center: {
      type: Array
    },
    zoom: {
      type: Number,
      default: 17
    }
  },

  data: function() {
    return {
      stopPointIcon: null,
      stopAreaIcon: null,
      map: null,
      markers: null,
      popups: null,
      bounds: null
    };
  },

  computed: {
    stoppoints: function() {
      return this.$store.state.stopPointsDiscovery;
    }
  },

  mounted: function() {
    this.initialize();
  },

  methods: {
    initialize: function() {
      this.stopPointIcon = L.icon({
        iconUrl: "images/marker-icon.png",
        shadowUrl: "images/marker-shadow.png"
      });

      this.stopAreaIcon = L.icon({
        iconUrl: "images/marker-red-icon.png",
        shadowUrl: "images/marker-shadow.png"
      });

      this.map = new L.map("map", {
        center: L.latLng(this.center),
        zoom: this.zoom
      });
      L.tileLayer(this.url, {}).addTo(this.map);
      this.markers = L.layerGroup([]).addTo(this.map);
      this.popups = L.layerGroup([]).addTo(this.map);
      L.control.scale().addTo(this.map);

      this.$watch("stoppoints", value => this.update(value), {
        immediate: true,
        deep: true
      });

      this.map.on("moveend", this.load, this);

      this.load();
    },

    load: function() {
      if (this.map.getZoom() >= this.zoom) {
        let bounds = this.map.getBounds();
        let count = this.markers.getLayers().length;
        if (!this.bounds || !this.bounds.contains(bounds) || count == 0) {
          let dx = this.diff(bounds.getEast(), bounds.getWest());
          let dy = this.diff(bounds.getNorth(), bounds.getSouth());
          this.bounds = new L.LatLngBounds(
            new L.LatLng(bounds.getSouth() - dy, bounds.getWest() - dx),
            new L.LatLng(bounds.getNorth() + dy, bounds.getEast() + dx)
          );

          let url = "";
          if(process.env.NODE_ENV === "development"){
            url = "http://127.0.0.1:8080";
          }
          url += "/siri-lite/stop-points-discovery" +
            "?" +
            T.UPPER_LEFT_LONGITUDE +
            "=" +
            this.bounds.getNorthWest().lng +
            "&" +
            T.UPPER_LEFT_LATITUDE +
            "=" +
            this.bounds.getNorthWest().lat +
            "&" +
            T.LOWER_RIGHT_LONGITUDE +
            "=" +
            this.bounds.getSouthEast().lng +
            "&" +
            T.LOWER_RIGHT_LATITUDE +
            "=" +
            this.bounds.getSouthEast().lat;

          this.$store.dispatch({
            type: T.STOP_POINTS_DISCOVERY,
            payload: url
          });
        }
      } else {
        this.$store.commit({
          type: T.STOP_POINTS_DISCOVERY_FAILURE,
          payload: {}
        });
      }
    },

    diff: function(a, b) {
      let result = a * b > 0 ? Math.abs(b - a) : Math.abs(a) + Math.abs(b);
      return result;
    },

    update: function(value) {
      this.markers.clearLayers();
      this.popups.clearLayers();
      if (value.response) {
        let array =
          value.response.Siri.StopPointsDelivery.AnnotatedStopPointRef;

        array.forEach(i => {
          let latlng = L.latLng(i.Location.Latitude, i.Location.Longitude);
          let options = {
            title: i.StopName["0"].value + "\n" + i.StopPointRef,
            alt: i.StopPointRef,
            icon: i.StopPointRef.startsWith("StopArea")
              ? this.stopAreaIcon
              : this.stopPointIcon
          };
          let marker = L.marker(latlng, options);
          marker.on("click", () => {
            this.createPopup(marker);
          });
          this.markers.addLayer(marker);
        });
      }
    },

    createPopup: function(marker) {
      let popup = marker.getPopup();
      if (popup) {
        popup.closePopup();
      } else {
        let popup = L.popup({
          autoClose: false,
          closeOnClick: false,
          closeButton: false
        });
        popup.setLatLng(marker.getLatLng());

        let ComponentClass = Vue.extend(StopMonitoring);
        let instance = new ComponentClass({
          propsData: { name: marker.options.alt }
        });
        instance.$mount();
        popup.setContent(instance.$el);

        marker.on("popupclose", () => {
          marker.unbindPopup();
          instance.$destroy();
        });
        marker.bindPopup(popup);

        this.popups.addLayer(popup);
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../node_modules/leaflet/dist/leaflet.css";
#map {
  height: calc(100% - 0px);
  width: 100%;
  position: absolute !important;
}
</style>