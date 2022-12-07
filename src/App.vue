<template>
    <div id="app">
        <button v-on:click="addMarker" style="background-color: forestgreen">add marker</button>
        <button @click="enough" style="background-color: orangered">stop add marker</button>
        <l-map style="height: 100vh;"
               ref="lMap"
               :zoom.sync="zoom"
               :center.sync="center"
               :min-zoom="minZoom"
               :max-zoom="maxZoom"
               :options.sync="mapOptions"
               :maxBoundsViscosity="maxBoundsViscosity"
               :crs="crs"
               @click="mapClick($event)">
            <l-tile-layer :url="url"/>
            <l-polyline :lat-lngs.sync="adminToolBox.polyline.latlngs"
                        :color="adminToolBox.polyline.data.line.color"
                        :weight="adminToolBox.polyline.data.line.weight"
                        :dash-array="adminToolBox.polyline.data.line.dashArray"
                        :options="adminToolBox.polyline.data.line.options"/>
            <template>
                <l-marker
                    v-for="(item, index) in adminToolBox.polyline.latlngs"
                    :key="index"
                    :lat-lng="item"
                    :draggable="true"
                    @dblclick="removeEditablePolylineLatLang($event, item, index)"
                    @drag="updateEditablePolylineLatLangs($event, item, index)"
                    @dragend="checkForAddPointToEditablePolylineLatLangs(index)">
                    <l-icon
                        :icon-url="getEditablePolylineNodeImg(index)"
                        :icon-size="adminToolBox.marker.data.icon.options.iconSize"
                        :icon-anchor="adminToolBox.marker.data.icon.options.iconAnchor"
                    >
                        <img :src="getEditablePolylineNodeImg(index)" alt=""/>
                    </l-icon>
                </l-marker>
            </template>
        </l-map>
    </div>
</template>

<script>
import Vue from 'vue'
import {LMap, LTileLayer, LPolyline, LMarker, LIcon} from 'vue2-leaflet'
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
        LPolyline,
        LMarker,
        LIcon
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
                    latlngs: [],
                    // latlngs: [
                    //     {
                    //         "lat": -12897.2421875,
                    //         "lng": 21054.14501953125
                    //     },
                    //     {
                    //         "lat": -12897.216796875,
                    //         "lng": 21054.01416015625
                    //     },
                    //     {
                    //         "lat": -12897.11474609375,
                    //         "lng": 21054.03464453125
                    //     },
                    //     {
                    //         "lat": -12897.096509325,
                    //         "lng": 21054.0468515625
                    //     },
                    //     {
                    //         "lat": -12897.091796875,
                    //         "lng": 21054.06982421875
                    //     },
                    //     {
                    //         "lat": -12897.35595703125,
                    //         "lng": 21054.2490234375
                    //     }
                    // ],
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
        addMarker() {
            this.enableToAddMarker = true
        },
        enough() {
            this.enableToAddMarker = false
        },
        getEditablePolylineNodeImg(index) {
            if (index % 2 === 0) {
                return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAAZiS0dEAP4ACgAK4wU5iwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EFQswOAsixbAAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABDUlEQVQY042QMUoEURBEq3sQ9jeyGm86IpOIycI/gAaCF9gTGHoDzyDew8hMBhSM5ggjbLCZijCDyZ/E32Ww4wauwb6kg6pquloAIIeAYhjgZqcgz+leisgHVJ81pReMiJsBwB7JBwEuGCOkLIGuA5sG0vdLqsYipQ7j5tc8m7mvViRJJzczLxbuITCb7cPNrvJ0Su97/sV9HfP5nD6Z3MFDeMwx/qr8J0Gva2bVd6X7sVTV2ECwhQikqoCiOFBR/WTbrgVy20yCbQvk/I1sdrPTzSHcw80Ocwjc4RsnAgBuVpJcCgDGSClLQdeRTSPS94Dqmab0tGmUQxAA1wJcgjyCyBtFapC3xTB8AcAPM3L4CmzlQRcAAAAASUVORK5CYII=';
            } else {
                return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gEEBgwnW9DvzQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAEPSURBVBjTbZBBSkJxGMR/89cQnxAKFdQiCTeK0M5c1y08iifwPO46QIgHUJQWlctQ1E1P1N6bFiooNsuZH/N9jDhSGkWX2FdO04KkNSHMQhzPD7n2kGw/Ca7dbKJKBeZz3O+jxeLHIbxl4ngrgCSff6ZUKqjXQ+Uy3rcYcKuFul0svSqNontns4+aTFCxePwVtpGEGw0YDD4D9i212g60T2BJO6/TwZvNXXCaFlStHlLOJKFqFTKZi6AQNh6PD3fPYRuPx5AkabD0zWiEl8uzZts7r91Gudw0CL7YbnG9jieTHXT0QtpqwXCIpffDzpHtFwH/7Awh9EMcz07uJvn8g+AGu4C0tjTF/sisVr8Af3fdgpLllLoZAAAAAElFTkSuQmCC'
            }
        },
        mapClick(event) {
            if (this.enableToAddMarker && event.latlng) {
                let lat = event.latlng.lat,
                    lng = event.latlng.lng,
                    newPolyline = L.latLng(lat, lng)
                this.adminToolBox.polyline.latlngs.push(newPolyline)
                const index = this.adminToolBox.polyline.latlngs.length - 1
                if (index > 0) {
                    this.addMidPointToEditablePolyline(index)
                }
            }
        },
        calcMiddlePoint(latlang1, latlang2) {
            if (latlang1.lat) {
                return {
                    lat: (latlang1.lat + latlang2.lat) / 2,
                    lng: (latlang1.lng + latlang2.lng) / 2
                }

            } else {
                return {
                    lat: (latlang1[0] + latlang2[0]) / 2,
                    lng: (latlang1[1] + latlang2[1]) / 2
                }
            }
        },
        removeEditablePolylineLatLang(event, item, index) {
            if (
                index === this.adminToolBox.polyline.latlngs.length - 1 ||
                this.adminToolBox.polyline.latlngs.length <= 3
            ) {
                return;
            }

            this.adminToolBox.polyline.latlngs.splice(index + 1, 1)
            this.adminToolBox.polyline.latlngs.splice(index, 1)

        },
        updateEditablePolylineLatLangs(event, item, index) {
            Vue.set(this.adminToolBox.polyline.latlngs, index, event.latlng)
        },
        addMidPointToEditablePolyline(index) {
            let latlang1 = this.adminToolBox.polyline.latlngs[index - 1],
                latlangIndex = this.adminToolBox.polyline.latlngs[index],
                mid1 = this.calcMiddlePoint(latlang1, latlangIndex)
            this.adminToolBox.polyline.latlngs.splice(index, 0, mid1)
            Vue.set(this.adminToolBox.polyline.latlngs, index, mid1);

        },
        checkForAddPointToEditablePolylineLatLangs(index) {
            if (index % 2 === 0) {
                return
            }
            let latlang1 = this.adminToolBox.polyline.latlngs[index - 1],
                latlangIndex = this.adminToolBox.polyline.latlngs[index],
                latlang2 = this.adminToolBox.polyline.latlngs[index + 1],
                mid1 = this.calcMiddlePoint(latlang1, latlangIndex),
                mid2 = this.calcMiddlePoint(latlangIndex, latlang2);
            this.adminToolBox.polyline.latlngs.splice(index, 0, mid1)
            Vue.set(this.adminToolBox.polyline.latlngs, index, mid1);
            this.adminToolBox.polyline.latlngs.splice(index + 2, 0, mid2)
            Vue.set(this.adminToolBox.polyline.latlngs, index + 2, mid2);
        },
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
