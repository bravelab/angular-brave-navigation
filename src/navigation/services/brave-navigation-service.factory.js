(function () {
  'use strict';

  angular
    .module('brave.navigation')
    .factory('BraveNavigationService', BraveNavigationService);

  BraveNavigationService.$inject = ['$http', '$q', 'BraveNavigation', 'NavigationTransformer'];

  /**
   *
   * @param {object} $http - Http object
   * @param {object} $q - Query object
   * @param {object} braveNavigation - app config object provider
   * @param {object} navigationTransformer - doc list transformer object
   * @returns {{get: brave.navigation.get}} - Service Factory
   * @constructor
   */
  function BraveNavigationService($http, $q, braveNavigation, navigationTransformer) {

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
     * @memberOf brave.navigation
     */
    function get(symbol) {

      var deferred = $q.defer();
      var id = symbol;

      if (typeof cache[id] !== 'undefined') {
        deferred.resolve(cache[id]);
      } else {
        $http({
          method: 'GET',
          url: apiUrl + '/navigation/' + symbol,
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
