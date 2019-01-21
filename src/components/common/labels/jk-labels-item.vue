<template>
    <div class="jk-labels-item">
        <label class="jk-labels-item__label" :style="labelStyle">{{ label }}</label>
        <div class="jk-labels-item__content" :style="contentStyle">
            <slot v-if="$slots.default"></slot>
            <p :class="$attrs['prop-class-name']" v-else>{{ value }}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'JkLabelsItem',
        
        componentName: 'JkLabelsItem',
        
        inheritAttrs: false,
        
        inject: ['labels'],
        
        props: {
            label: String,
            prop: String,
        },
        
        computed: {
            value() {
                let value = "";
                const labels = this.labels;
                if(labels) {
                    value = labels.model[this.prop];
                }
                return value;
            },
            labelStyle() {
                let ret = {};
                const labels = this.labels;
                if(labels) {
                    ret.width = labels.labelWidth;
                }
                return ret;
            },
            contentStyle() {
                let ret = {};
                const labels = this.labels;
                if(labels) {
                    const labelWidth = labels.labelWidth.slice(0, -2);
                    const labelRight = labels.labelRight.slice(0, -2);
                    const marginLeft = parseInt(labelWidth) + parseInt(labelRight);
                    ret.marginLeft = marginLeft + 'px';
                }
                return ret;
            }
        }
    }
</script>

<style scoped>
    .jk-labels-item { margin-bottom: 18px; }
    .jk-labels-item:after { display: table; content: ""; clear: both; }
    .jk-labels-item__label {
        text-align: right;
        text-align-last: justify;
        vertical-align: middle;
        float: left;
        font-size: 14px;
        color: #48576a;
        line-height: 1;
        padding: 8px 10px;
        box-sizing: border-box;
    }
    .jk-labels-item__content {
        line-height: 30px;
        position: relative;
        font-size: 14px;
    }
    .jk-labels-item__content p {
        word-wrap: break-word;
        word-break: normal;
    }
</style>