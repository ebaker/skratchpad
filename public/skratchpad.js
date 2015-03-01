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
      onId = function(id, cb){
        for (var i = 0; i < $scope.skratches.length; i++){
          if ($scope.skratches[i]._id == id) {
            skratch = $scope.skratches[i];
            skratch.text = $scope.updated;
            cb(i, skratch);
          }
        }
      }
      $scope.addSkratch = function(){
        skratchesFactory.post({text: $scope.text}).then(function(data){
          $scope.skratches.unshift(data);
        });
      };
      $scope.updateSkratch = function(id){
        skratchesFactory.put(id, {text:$scope.updated}).then(function(status){
          if (status == 204){
            onId(id, function(index, skratch){
              $scope.skratches[index] = skratch;
            });
          }
        });
      };
      $scope.removeSkratch = function(id){
        skratchesFactory.del(id).then(function(status){
          if (status == 204){
            onId(id, function(index, skratch){
              $scope.skratches.splice(index, 1);
            });
          }
        });
      };
    },
    templateUrl: 'skratchpad.html'
  }
});

app.directive('skratch', function() {
  return {
    restrict: 'C',
    require: '^skratchpad',
    link: function(scope, elem, attr){
      scope.editing = function() {
        elem.addClass('editing');
        $(elem).find('input').focus();
      };
      scope.doneEditing = function() {
        elem.removeClass('editing');
      };
      scope.remove = function() {
        scope.$parent.removeSkratch(scope.skratch._id);
      };
    }
  }
});

app.directive('ngEnter', function () {
  return {
    restict: 'A',
    require: '^skratchpad',
    link: function (scope, element, attrs, SkratchpadCtrl) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$parent.updated = element.val();
        if (attrs.ngEnter.indexOf('addSkratch') > -1){
          element.val('');
        }
        else if (attrs.ngEnter.indexOf('updateSkratch') > -1){
          $(element).blur();
        }
        scope.$eval(attrs.ngEnter);
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
    },
    put: function(id, data) {
      var defer = $q.defer()
      $http.put('/api/skratches/'+id, data).success(function(data, status){
        defer.resolve(status);
      }).error(function() {
        defer.resolve(null);
      });
      return defer.promise;
    },
    del: function(id) {
      var defer = $q.defer()
      $http.delete('/api/skratches/'+id).success(function(data, status){
        defer.resolve(status);
      }).error(function() {
        defer.resolve(null);
      });
      return defer.promise;
    }
  }
});

