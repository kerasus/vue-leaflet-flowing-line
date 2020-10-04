'use strict';

import {SVG} from 'leaflet'
import FlowingLine from "./FlowingLine"

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
            let styles = '';
            for (const [key, value] of Object.entries(options2.flowing.style)) {
                styles += key + ': ' + value + 's; ';
            }
            styles += '';
            path1.setAttribute('style', styles);
            path1.classList.add('leaflet-flowing-line');
            if (options2.flowing.dir === 'reverse') {
                path1.classList.add('leaflet-flowing-line__reverse');
            }
        };
    }
};

export { FlowingLine, FlowingSVG }
