(function () {
  'use strict';

  angular
    .module('ngBraveNavigation')
    .factory('BraveNavigationService', BraveNavigationService);

  BraveNavigationService.$inject = ['$http', '$q', 'BraveNavigationConfig', 'NavigationTransformer'];

  /**
   *
   * @param {object} $http - Http object
   * @param {object} $q - Query object
   * @param {object} braveNavigationConfig - app config object provider
   * @param {object} navigationTransformer - doc list transformer object
   * @returns {{get: ngBraveNavigation.get}} - Service Factory
   * @constructor
   */
  function BraveNavigationService($http, $q, braveNavigationConfig, navigationTransformer) {

    var cache = {};

    var apiUrl = braveNavigationConfig.getApiUrl();

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
