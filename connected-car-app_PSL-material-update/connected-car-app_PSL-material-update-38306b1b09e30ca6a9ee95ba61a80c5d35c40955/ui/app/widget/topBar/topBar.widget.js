(function() {
  'use strict';

  angular.module('cca').controller('TopNavController', TopNavController);

  TopNavController.$inject = ['$scope', '$state', '$cookies'];

  function TopNavController($scope, $state, $cookies) {
    //                            $scope.userName = $cookies.get('driverName');


    //$scope.userName = $cookies.get('first_name').split(/[^A-Za-z0-9]/)[0];
    $scope.userName = $cookies.get('firstName').split(/[^A-Za-z0-9]/)[0];
    console.log($scope.userName);
    $scope.doLogout = function() {

      var cookies = $cookies.getAll();
      angular.forEach(cookies, function(v, k) {
        $cookies.remove(k);
      });

      $state.go('login');
    }

  }
})();
