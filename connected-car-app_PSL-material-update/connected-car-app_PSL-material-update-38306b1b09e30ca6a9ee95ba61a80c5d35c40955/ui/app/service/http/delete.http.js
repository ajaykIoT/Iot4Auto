angular.module('cca')
    .factory('HTTPDELETEService',function($http, $q){
        return {
            httpDelete: function(url){
                var deferred = $q.defer();
                $http({
                    method: 'DELETE',
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