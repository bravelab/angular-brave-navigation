(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name app [ngBraveNavigation]
   * @description Config provider for ngBraveNavigation
   */
  angular
    .module('ngBraveNavigation')
    .provider('BraveNavigationConfig', function () {

      this.apiUrl = '/api';

      this.$get = function () {
        var apiUrl = this.apiUrl;

        return {
          getApiUrl: function () {
            return apiUrl;
          }
        };
      };

      this.setApiUrl = function (apiUrl) {
        this.apiUrl = apiUrl;
      };

    });

})();


