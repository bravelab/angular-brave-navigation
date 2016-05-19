(function () {
  'use strict';

  angular
    .module('ngBraveNavigation')
    .controller('BraveNavigationController', BraveNavigationController);

  BraveNavigationController.$inject = ['$scope', 'BraveNavigationService'];

  /**
   *
   * @param {Object} $scope - Scope
   * @param {Object} braveNavigationService - Service
   * @constructor
   */
  function BraveNavigationController($scope, braveNavigationService) {

    activate();

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf ngBraveNavigation.BraveNavigationController
     */
    function activate() {
      braveNavigationService.get($scope.symbol).then(function (navigation) {
        $scope.navigation = navigation;
      });
    }

  }

})();
