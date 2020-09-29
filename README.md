# vue-leaflet-editable-polyline

This is a [editable polyline plugin](https://github.com/kerasus/vue-leaflet-editable-polyline) extension for [vue2-leaflet package](https://github.com/KoRiGaN/Vue2Leaflet)

## Install

    npm install --save vue-leaflet-editable-polyline

## Demo

    git clone https://github.com/kerasus/vue-leaflet-editable-polyline
    cd vue-leaflet-editable-polyline
    yarn
    yarn dev

    # or alternatively using npm
    npm install
    npm run dev

Then you should be able to navigate with your browser and see the demo in http://localhost:4000/

## Usage

### on &lt;template&gt; add

something like this

    <l-map>
        <editable-polyline
            ref="editablePolyline"
            :latlngs="editablePolylinelatlngs"
            :editablePolylineOptions="{
                                          latlngs: [],
                                          line: {
                                              color: 'red',
                                              bubblingMouseEvents: true,
                                              weight: 5,
                                              dashArray: '4 2',
                                              dashOffset: '0'
                                          },
                                          displayZoom: 6,
                                          iconSize: [16, 16],
                                          iconAnchor: [10, 10],
                                      }"
            :zoom="LMapZoom"
            :center="LMapCenter"
        />
    </l-map>

### on &lt;script&gt; add

#### option 1

In the same template file, at `<script>` part, this will make the component available only to the template in this file

    import EditablePolyline from 'vue-leaflet-editable-polyline'
    ...
    export default {
      ...
      components: {
        EditablePolyline,
        ...
      },
      ...
    }

#### option 2

At main Vue configuration, this will make the component available to all templates in your app

    import Vue from 'vue'
    import EditablePolyline from 'vue-leaflet-editable-polyline'
    ...
    Vue.component('editable-polyline', EditablePolyline)

## Develop and build

    npm install
    npm run build

## Author

[kerasus](https://github.com/kerasus/)


## License

MIT
editable polyline plugin extension for vue2-leaflet package
