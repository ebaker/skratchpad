var app = angular.module('skratchpadApp', []);

app.directive('skratchpad', function(skratchesFactory) {
  return {
    scope: {},
    restrict: 'E',
    replace: true,
    link: function(scope, elem, attrs){
      skratchesFactory.getAll().then(function(data){
        scope.skratches = data;
      });
    },
    controller: function($scope) {
      $scope.addSkratch = function(){
        skratchesFactory.post({text: $scope.text}).then(function(data){
          $scope.skratches.unshift(data);
        });
      }
    },
    templateUrl: 'skratchpad.html'
  }
});

app.directive('ngEnter', function () {
  return {
    restict: 'A',
    require: '^skratchpad',
    link: function (scope, element, attrs, SkratchpadCtrl) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$eval(attrs.ngEnter);
        element.val('');
        event.preventDefault();
        }
    });
    }
  };
});

app.factory('skratchesFactory', function($http, $q) {
  return {
    getAll: function() {
      var defer = $q.defer()
      $http.get('/api/skratches').success(function(data){
        defer.resolve(data);
      }).error(function() {
        defer.resolve([]);
      });
      return defer.promise;
    },
    post: function(data) {
      var defer = $q.defer()
      $http.post('/api/skratches', data).success(function(data){
        defer.resolve(data);
      }).error(function() {
        defer.resolve(null);
      });
      return defer.promise;
   
    }
  }

});

