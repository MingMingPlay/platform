<template>
    <div id="pc">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name: 'pc',
    data() {
        return {
        }
    },
    methods: {

    }
}
</script>
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html,
body {
    height: 100%;
    overflow: hidden;
}

body {
    font-family: Helvetica Neue, Helvetica, microsoft yahei, arial, STHeiTi, sans-serif;
    color: #48576a;
}

ul,
li {
    list-style: none;
}

a {
    text-decoration: none;
    color: #48576a;
}

#pc {
    height: 100%;
    position: relative;
    overflow: auto;
}
</style>
