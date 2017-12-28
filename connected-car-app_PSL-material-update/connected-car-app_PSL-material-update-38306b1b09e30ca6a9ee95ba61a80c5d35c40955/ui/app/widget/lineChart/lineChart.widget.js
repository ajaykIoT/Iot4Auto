(function() {
	'use strict';

	angular.module('cca').controller('LineChartController', LineChartController);

	LineChartController.$inject = ['$scope'];

	function LineChartController($scope) {
	
		$scope.$watch('barChartSeriesYAxis', function() {
		if($scope.barChartSeriesYAxis === 'Centigrade'){
			$scope.barChartSeriesData = [{
			        name: 'Neo',
			        data: [45, 42, 45,41, 51, 37, 57, 57],
					pointStart: 1
			    }, {
			        name: 'MonoSpace',
			        data: [87, 22, 65,22, 15, 45, 67,57],
					pointStart: 1
			    }, {
			        name: 'MiniSpace',
			        data: [96, 64, 42, 81, 90, 65, 61, 63],
					pointStart: 1
			    }, {
			        name: 'TransSys',
			        data: [26, 45, 42,51, 90, 82,90, 82],
					pointStart: 1
			    }];
				
			$scope.chartTooltip = {
					headerFormat: '<span style="font-size:10px">Week {point.key}</span><table>',
					pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						'<td style="padding:0"><b>{point.y} °C</b></td></tr>',
					footerFormat: '</table>',
					shared: true,
					useHTML: true
			}	
		}else {
			$scope.barChartSeriesData = [{
			        data: [0,60, 80, 60, 40],
					pointStart: 0
			    }];
			
			$scope.xAxisCategories = ['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM'];
			
				$scope.chartTooltip = {
						headerFormat: '<span style="font-size:10px">Week {point.key}</span><table>',
						pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
							'<td style="padding:0"><b>{point.y} amp</b></td></tr>',
						footerFormat: '</table>',
						shared: true,
						useHTML: true
				}			
		}
			$scope.loadLineChart();
		});
		
		$scope.loadLineChart = function(containerId, lineChartData, xAxisCategories){
			var chart = new Highcharts.chart(containerId, {
				chart : {
					type: 'spline',
					width: 600
				},
				title : {
					text : ''
				},
				yAxis : {
					title : {
						text : $scope.barChartSeriesYAxis
					}
				},
				xAxis : {
					categories: xAxisCategories,
					title : {
						text : 'Time'
					}
				},
				yAxis : {
					title : {
						text : 'Speed(kms)'
					}
				},
				tooltip: $scope.chartTooltip,
				legend:{
				     align: 'right',
				     verticalAlign: 'top',
				     layout: 'vertical'
				},
				margin:30,
				series: lineChartData.data
				
			});
		}
	}
})();