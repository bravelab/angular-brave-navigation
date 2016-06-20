/**
 * CategoriesTransformer
 * @namespace brave.navigation
 */
(function () {
  'use strict';

  angular
    .module('brave.navigation')
    .factory('CategoriesTransformer', CategoriesTransformer);

  CategoriesTransformer.$inject = ['MenuItem'];

  function CategoriesTransformer(MenuItem) {
    return function (response) {

      var result = (typeof response === 'string') ? angular.fromJson(response) : response;

      var data = [];
      if (result.data.length > 0) {

        data = _.map(result.data, function (item) {

          if (item.is_visible === true) {

            var menuItemObj = {};

            menuItemObj.title =  item.name;
            menuItemObj.sref = 'productHome.list';
            menuItemObj.icon = null;
            menuItemObj.data = {'slug': item.slug};
            menuItemObj.href = null;

            return new MenuItem(menuItemObj);
          }

        });
      }

      return {
        items: data
      };
    };
  }

}());
