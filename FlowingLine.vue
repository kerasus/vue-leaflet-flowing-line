<template>
    <div>
    </div>
</template>

<script>
    import {SVG} from 'leaflet'

    export default {
        name: 'FlowingLine',
        props: {
        },
        data() {
            return {
            }
        },
        watch: {
        },
        methods: {
        },
        created: function () {
            let updateStyle = SVG.prototype._updateStyle;
            SVG.prototype._updateStyle = function(layer) {
                updateStyle(layer);
                let path1 = layer._path,
                    options2 = layer.options;
                if (!options2.style) {
                    return;
                }
                let styles = '';
                for (const [key, value] of Object.entries(options2.style)) {
                    styles += key + ': ' + value + '; ';
                }
                styles += '';
                path1.setAttribute('style', styles);
            };
        }
    }
</script>

<style scoped>

    @-webkit-keyframes leaflet-flowing-line-animation {
        from {
            stroke-dashoffset: 100%;
        }
        to {
            stroke-dashoffset: 0;
        }
    }

    @-moz-keyframes leaflet-flowing-line-animation {
        from {
            stroke-dashoffset: 100%;
        }
        to {
            stroke-dashoffset: 0;
        }
    }

    @-ms-keyframes leaflet-flowing-line-animation {
        from {
            stroke-dashoffset: 100%;
        }
        to {
            stroke-dashoffset: 0;
        }
    }

    @-o-keyframes leaflet-flowing-line-animation {
        from {
            stroke-dashoffset: 100%;
        }
        to {
            stroke-dashoffset: 0;
        }
    }

    @keyframes leaflet-flowing-line-animation {
        from {
            stroke-dashoffset: 100%;
        }
        to {
            stroke-dashoffset: 0;
        }
    }

    path.leaflet-flowing-line {
        fill: none;
        -webkit-animation: linear infinite leaflet-flowing-line-animation;
        -moz-animation: linear infinite leaflet-flowing-line-animation;
        -ms-animation: linear infinite leaflet-flowing-line-animation;
        -o-animation: linear infinite leaflet-flowing-line-animation;
        animation: linear infinite leaflet-flowing-line-animation;
        animation-duration: 0s;
    }
</style>
