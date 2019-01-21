<template>
    <div class="jk-labels">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'JkLabels',
        
        componentName: 'JkLabels',
        
        provide() {
            return {
                labels: this
            }
        },
        
        props: {
            model: Object,
            labelWidth: String,
            labelRight: String,
        }
    }
</script>

<style scoped>
    .jk-labels {
        position: relative;
    }
</style>