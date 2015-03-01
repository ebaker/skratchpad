//
var app = angular.module('skratchpadApp',[]);

app.directive('skratchpad', function(skratchesFactory) {
  return {
    scope: {},
    restrict: 'E',
    replace: true,
    link: function(scope, elem, attrs){
      skratchesFactory.getAll().then(function(data){
        console.log('data', data);
        scope.skratches = data;
      });
    },
    templateUrl: 'skratchpad.html'
  }
});

app.factory('skratchesFactory', function($http, $q) {
  return {
    getAll: function() {
      var defer = $q.defer()
      $http.get('/api/skratches').success(function(data){
        // return data;
        defer.resolve(data);

      }).error(function() {
        defer.resolve([]);
      
      });
      return defer.promise;
    }
  }

});

