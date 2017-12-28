angular.module('cca')
    .factory('HTTPGETService',function($http, $q){
        return {
            get: function(url){
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: url
                })
                .then(function(data, status, headers, config){
					deferred.resolve(data);
				})
				.catch(function(data, status, headers, config){
			        deferred.reject("An error occured while fetching items");
				});
			    return deferred.promise;
            }
        }
});