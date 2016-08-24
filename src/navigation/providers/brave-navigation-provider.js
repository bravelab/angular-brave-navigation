(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name brave.navigation [brave.navigation]
   * @description Config provider for brave.navigation
   */
  angular
    .module('brave.navigation')
    .provider('BraveNavigation', function () {

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


