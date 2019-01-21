<template>
    <div ref="coin">
        <div style="height: 350px;" id="coin-chart"></div>
    </div>
</template>
<script>
    // 引入 ECharts 主模块
    var echarts = require('echarts/lib/echarts');
    // 引入柱状图
    require('echarts/lib/chart/line');
    // 引入提示框和标题组件
    require('echarts/lib/component/tooltip');
    // require('echarts/lib/component/toolbox');
    require('echarts/lib/component/title');
    require('echarts/lib/component/legend');
    import { chartType } from './page-config.js'

    export default {
        props: {
            tableData: {
                type: Array,
                required: true,
            },
            type: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                coinChart: null,
                chartOptions: {
                    title: {
                        text: '积分趋势图'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: []
                    },
                    xAxis: {
                        axisLabel: {
                            rotate: 30
                        },
                        data: []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: []
                },
            }
        },
        mounted(){
            if(this.tableData.length > 0){
                this.initData();
            }
            var timer = null;
            window.onresize = () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    this.initChart();
                }, 500);
            }
        },
        watch: {
            tableData(){
                if(this.tableData.length > 0){
                    this.initData();
                }
            }
        },
        methods: {
            initData(){
                // 先重置配置
                this.chartOptions.legend.data = [];
                this.chartOptions.xAxis.data = [];
                this.chartOptions.series = [];
                chartType[this.type].forEach((item, index) => {
                    let obj = {
                        name: item.label,
                        type: 'line',
                        smooth: true,
                        data: []
                    };
                    this.tableData.forEach(value => {
                        // x 轴数据
                        if(index === 0){
                            this.chartOptions.xAxis.data.push(value.scoreDate);
                        }
                        obj.data.push(value[item.prop])
                    });
                    this.chartOptions.legend.data.push(item.label);
                    this.chartOptions.series.push(obj);
                });
                this.initChart();
            },
            initChart(){
                // 初始化前对宽度进行处理
                let chart = document.getElementById('coin-chart');
                chart.style.width = this.$refs.coin.clientWidth + 'px';
                if(this.coinChart){
                    this.coinChart.dispose();
                }
                this.coinChart = echarts.init(chart);
                this.coinChart.setOption(this.chartOptions);
            }
        }
    }
</script>
<style>

</style>
