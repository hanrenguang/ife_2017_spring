window.onload = function() {
    var chartBox = document.getElementById('main'),
        myChart = echarts.init(chartBox),
        option;

    option = {
        title: {
            text: 'ECharts Task1'
        },
        tooltip: {},
        legend: {
            data: ['收入', '支出']
        },
        xAxis: {
            data: [2010, 2011, 2012, 2013, 2014, 2015, 2016]
        },
        yAxis: {},
        series: [{
            name: '收入',
            type: 'bar',
            data: [100000, 150000, 200000, 200000, 250000, 300000, 350000]
        }, {
        	name: '支出',
        	type: 'line',
        	data: [50000, 70000, 60000, 100000, 160000, 80000, 200000]
        }]
    };

    myChart.setOption(option);
};
