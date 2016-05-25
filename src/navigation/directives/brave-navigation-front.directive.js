(function () {
  'use strict';

  angular
    .module('ngBraveNavigation')
    .directive('braveNavigationFront', ['$rootScope', '$compile', function ($rootScope, $compile) {

      return {
        restrict: 'E',
        scope: {
          items: '@items'
        },
        compile: function (element, attrs) {

          // rendering 

          console.log(attrs);
        }
      };
    }]);

}());
