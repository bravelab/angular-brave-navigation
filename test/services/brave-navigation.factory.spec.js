(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name app.docs tests
   * @description Docs tests
   *
   */
  describe('should provide braveNavigationService', function () {

    var braveNavigationService;

    beforeEach(function () {
      module('brave.navigation');
    });

    beforeEach(inject(function (_BraveNavigationService_) {
      braveNavigationService = _BraveNavigationService_; // (2)
    }));

    it('should have get function', function () {
      expect(angular.isFunction(braveNavigationService.get)).toBe(true);
    });

  });

})();
