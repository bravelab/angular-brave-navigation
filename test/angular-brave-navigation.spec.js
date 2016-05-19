(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name ngBraveNavigation
   * @description ngBraveNavigation tests
   *
   */
  describe('ngBraveNavigation module', function () {

    beforeEach(module('ngBraveNavigation'));

    describe('value - version', function () {
      it('should return current version', inject(function (version) {
        expect(version).toEqual('0.0.2');
      }));
    });

  });
})();

