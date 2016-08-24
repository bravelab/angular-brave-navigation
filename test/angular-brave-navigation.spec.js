(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name brave.navigation
   * @description brave.navigation tests
   *
   */
  describe('brave.navigation module', function () {

    beforeEach(module('brave.navigation'));

    describe('value - version', function () {
      it('should return current version', inject(function (version) {
        expect(version).toEqual('0.0.6');
      }));
    });

  });
})();

