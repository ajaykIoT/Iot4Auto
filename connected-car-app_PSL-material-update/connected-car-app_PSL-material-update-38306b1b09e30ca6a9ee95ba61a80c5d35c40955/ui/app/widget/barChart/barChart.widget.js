(function() {
	'use strict';

	angular.module('cca').controller('BarChartController',
			BarChartController);

	BarChartController.$inject = [ '$scope', '$rootScope' ];

	function BarChartController($scope, $rootScope) {

		$rootScope.loadBarChart = function(containerId, barChartData) {
			var chart = Highcharts.chart(containerId, {
			    chart: {
			        type: 'column'
			    },
			    title: {
			        text: ''
			    },
			    xAxis: {
			        type: 'category',
			        title: {
			            text: 'Behavior'
			        },
			        labels: {
			        	enabled: false
			        }
			    },
			    yAxis: {
			        title: {
			            text: 'Count'
			        }

			    },
			    legend: {
			        enabled: true,			        
		            verticalAlign: 'bottom',
		            align:'right',
		            margin:15,
		            itemStyle: {
		                fontWeight: 'bold',
		                fontSize: '11px'
		            }
			    },
			    credits: {
			    	enabled: false
			    },
			    tooltip: {
			        useHTML: true,
			        headerFormat: ''
			    },
			    plotOptions: {
			        column: {
	                    grouping: false,
	                    pointPadding: 0.2,
	                    borderWidth: 0
	                }
			    },
			    series: barChartData
			});

		}

	}
})();