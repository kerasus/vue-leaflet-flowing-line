<template>
    <div id="app">
        <!--        <button v-on:click="addMarker" style="background-color: forestgreen">add marker</button>-->
        <!--        <button @click="enough" style="background-color: orangered">stop add marker</button>-->
        <l-map style="height: 100vh;"
               ref="lMap"
               :zoom.sync="zoom"
               :center.sync="center"
               :min-zoom="minZoom"
               :max-zoom="maxZoom"
               :options.sync="mapOptions"
               :maxBoundsViscosity="maxBoundsViscosity"
               :crs="crs">
            <l-tile-layer :url="url"/>
            <l-polyline :lat-lngs="adminToolBox.polyline.latlngs"
                        :color="adminToolBox.polyline.data.line.color"
                        :weight="adminToolBox.polyline.data.line.weight"
                        :dash-array="adminToolBox.polyline.data.line.dashArray"
                        :options="adminToolBox.polyline.data.line.options"/>
        </l-map>
    </div>
</template>

<script>
import Vue from 'vue'
import {LMap, LTileLayer, LPolyline} from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
import L, {CRS, latLng} from 'leaflet'
import {FlowingSVG} from '../index'
import '../css/animate.css'

Vue.use(FlowingSVG);

export default {
    name: 'App',
    components: {
        LMap,
        LTileLayer,
        LPolyline
    },
    data() {
        return {
            crs: null,
            bounds: null,
            center: null,
            maxBounds: null,
            zoom: 18,
            minZoom: 3,
            maxZoom: 18,
            maxBoundsViscosity: 1,
            mapOptions: {
                zoomControl: true,
                zoomSnap: 1
            },
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            adminToolBox: {
                marker: {
                    id: 0,
                    action: {},
                    data: {
                        latlng: {
                            lng: 0,
                            lat: 0
                        },
                        headline: {
                            text: null,
                            fontSize: 14
                        },
                        icon: {
                            options: {
                                iconAnchor: [0, 0],
                                iconUrl: null,
                                iconSize: [70, 70]
                            }
                        }
                    },
                    enable: 1,
                    tags: [],
                    min_zoom: 3,
                    max_zoom: 11,
                    editMode: false,
                    type: {
                        name: 'marker'
                    }
                },
                polyline: {
                    action: {},
                    enable: 1,
                    min_zoom: 3,
                    max_zoom: 18,
                    data: {
                        line: {
                            className: '',
                            bubblingMouseEvents: false,
                            options: {
                                flowing: {
                                    dir: 'flowing',
                                    style: {'animation-duration': 15}
                                }
                            },
                            color: 'red',
                            weight: 5,
                            dashArray: '15',
                            dashOffset: '0'
                        },
                        displayZoom: 1,
                        iconSize: [16, 16],
                        iconAnchor: [10, 10]
                    },
                    latlngs: [
                        {
                            "lat": -12897.2421875,
                            "lng": 21054.14501953125
                        },
                        {
                            "lat": -12897.216796875,
                            "lng": 21054.01416015625
                        },
                        {
                            "lat": -12897.11474609375,
                            "lng": 21054.03464453125
                        },
                        {
                            "lat": -12897.096509325,
                            "lng": 21054.0468515625
                        },
                        {
                            "lat": -12897.091796875,
                            "lng": 21054.06982421875
                        },
                        {
                            "lat": -12897.35595703125,
                            "lng": 21054.2490234375
                        }
                    ],
                    editMode: true,
                    tags: [],
                    type: {
                        name: 'polyline'
                    }
                }
            },
            enableToAddMarker: false
        }
    },
    created() {
        this.crs = this.getCRS([0.00000000, -15426.00000000, 26934.00000000, 0.00000000]);
        this.bounds = [[-20140, 920], [-920, 28650]]; // down - left - up - right
        this.center = latLng(-12897.3, 21054.1);
        FlowingSVG.install
    },
    methods: {
        getCRS(mapExtent) {
            let mapMaxZoom = 10,
                mapMaxResolution = 0.12500000,
                mapMinResolution = Math.pow(2, mapMaxZoom) * mapMaxResolution,
                tileExtent = mapExtent,
                crs = CRS.Simple;
            crs.transformation = new L.Transformation(1, -tileExtent[0], -1, tileExtent[3]);
            crs.scale = function (zoom) {
                return Math.pow(2, zoom) / mapMinResolution;
            };
            crs.zoom = function (scale) {
                return Math.log(scale * mapMinResolution) / Math.LN2;
            };

            return crs;
        },
    }
}
</script>

<style src="../css/animate.css"></style>

<style>
body {
    margin: 0;
    padding: 0;
}


</style>
