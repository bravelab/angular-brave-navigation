(function () {
  'use strict';

  angular
    .module('brave.navigation')
    .factory('BraveNavigationCategories', BraveNavigationCategories);

  BraveNavigationCategories.$inject = ['$http', '$q', 'BraveNavigation', 'CategoriesTransformer'];

  /**
   *
   * @param {object} $http - Http object
   * @param {object} $q - Query object
   * @param {object} braveNavigation - module config provider
   * @param {object} categoriesTransformer - doc list transformer object
   * @returns {{get: brave.navigation.get}} - Service Factory
   * @constructor
   */
  function BraveNavigationCategories($http, $q, braveNavigation, categoriesTransformer) {

    var cache = {};

    var apiUrl = braveNavigation.getApiUrl();

    /**
     * @name Docs
     * @desc The Factory to be returned
     */
    var factory = {
      get: get
    };

    return factory;

    /**
     * @name get
     * @desc Get single doc by type and slug params
     * @returns {Promise} - Promise an object
     * @memberOf brave.navigation
     */
    function get() {

      var deferred = $q.defer();
      var id = 'categories';

      if (typeof cache[id] !== 'undefined') {
        deferred.resolve(cache[id]);
      } else {
        $http({
          method: 'GET',
          url: apiUrl + '/products/categories',
          transformResponse: categoriesTransformer
        })
          .then(function (data) {
            cache[id] = data.data;
            deferred.resolve(cache[id]);
          }, function (data) {
            deferred.reject(data);
          });
      }

      return deferred.promise;
    }

  }
})();
