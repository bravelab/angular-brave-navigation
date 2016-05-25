(function () {
  'use strict';

  angular
    .module('ngBraveNavigation')
    .factory('BraveNavigationServiceCategories', BraveNavigationServiceCategories);

  BraveNavigationServiceCategories.$inject = ['$http', '$q', 'BraveNavigation', 'NavigationTransformer'];

  /**
   *
   * @param {object} $http - Http object
   * @param {object} $q - Query object
   * @param {object} braveNavigation - app config object provider
   * @param {object} navigationTransformer - doc list transformer object
   * @returns {{get: ngBraveNavigation.get}} - Service Factory
   * @constructor
   */
  function BraveNavigationServiceCategories($http, $q, braveNavigation, navigationTransformer) {

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
     * @param {string} symbol Document symbol
     * @returns {Promise} - Promise an object
     * @memberOf ngBraveNavigation
     */
    function get() {

      var deferred = $q.defer();
      var id = 'categories';

      if (typeof cache[id] !== 'undefined') {
        deferred.resolve(cache[id]);
      } else {
        $http({
          method: 'GET',
          url: apiUrl + '/products/categories/',
          transformResponse: navigationTransformer
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
