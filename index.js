'use strict';

import { SVG } from 'leaflet'
import __vue_component__ from 'vue2-leaflet/dist/components/LPolyline.js'

var FlowingSVG = {
    install: function (){

        let updateStyle = SVG.prototype._updateStyle;
        SVG.prototype._updateStyle = function(layer) {
            updateStyle(layer);
            let path1 = layer._path,
                options2 = layer.options;
            if (!options2.flowing || !options2.flowing.style) {
                return;
            }
            if (options2.flowing.dir === 'fixed') {
                path1.classList.remove('leaflet-flowing-line');
                path1.classList.remove('leaflet-flowing-line__reverse');
                return;
            }
            var styles = '';
            for (const [key, value] of Object.entries(options2.flowing.style)) {
                styles += key + ': ' + value + 's; ';
            }
            styles += '';
            path1.setAttribute('style', styles);
            path1.classList.add('leaflet-flowing-line');
            if (options2.flowing.dir === 'reverse') {
                path1.classList.add('leaflet-flowing-line__reverse');
            } else {
                path1.classList.remove('leaflet-flowing-line__reverse');
            }
        };

        // Define this function so you can reuse it later and keep your overrides "cleaner"
        function hookFunction(object, functionName, callback) {
            (function(originalFunction) {
                object[functionName] = function () {
                    var returnValue = originalFunction.apply(this, arguments);

                    callback.apply(this, [returnValue, originalFunction, arguments]);

                    return returnValue;
                };
            }(object[functionName]));
        }

        hookFunction(__vue_component__, 'mounted', function(){
            /* This anonymous function gets called after UIIntentionalStream.instance.loadOlderPosts() has finished */
            if (this.mapObject.options.flowing) {
                this.$watch(
                    'options.flowing',
                    function (newVal) {
                        // this['setFlowing'](newVal, oldVal);
                        this.mapObject.setStyle({ flowing: newVal });
                    },
                    {
                        deep: true,
                    }
                );
            }
        });

    }
};

export { FlowingSVG }
