(function() {
	'use strict';

	angular.module('cca').controller('DonutChartController',
			DonutChartController);

	DonutChartController.$inject = [ '$scope' ];

	function DonutChartController($scope) {

		$scope.loadDonutChart = function(containerId, donutData) {
			var chart = new Highcharts.chart(containerId, {
				chart : {
					plotBackgroundColor : null,
					plotBorderWidth : null,
					plotShadow : false,
					type : 'pie'
				},
				title : {
					text : donutData.name
				},
				tooltip : {
					pointFormat : '<b>{point.percentage:.1f}%</b>'
				},
				plotOptions : {
					pie : {
						allowPointSelect : true,
						cursor : 'pointer',
						dataLabels : {
							enabled : false
						}
						//,showInLegend: true
					// size : 10,
						 ,center : [ '50%', '50%' ]
					}
				},
				series : [ {
					name : 'Insight',
					colorByPoint : true,
					// size : '80%',
					innerSize : '80%',
					data : donutData.data
				} ]
			});

		}

	}
})();