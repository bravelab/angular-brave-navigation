/**
 * NavigationTransformer
 * @namespace brave.navigation
 */
(function () {
  'use strict';

  angular
    .module('brave.navigation')
    .factory('NavigationTransformer', NavigationTransformer);

  NavigationTransformer.$inject = ['MenuItem'];

  function NavigationTransformer(MenuItem) {
    return function (response) {

      var result = (typeof response === 'string') ? angular.fromJson(response) : response;
      var data = [];
      if (result.items.length > 0) {
        data = _.map(result.items, function (item) {
          return new MenuItem(item);
        });
      }

      return {
        items: data
      };
    };
  }

}());
