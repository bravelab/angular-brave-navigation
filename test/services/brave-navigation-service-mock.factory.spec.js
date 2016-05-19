(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name app.docs tests
   * @description braveNavigationServiceMock tests
   *
   */
  describe('should provide braveNavigationServiceMock', function () {

    var braveNavigationServiceMock;

    beforeEach(function () {
      module('ngBraveNavigation');
    });

    beforeEach(inject(function (_BraveNavigationServiceMock_) {
      braveNavigationServiceMock = _BraveNavigationServiceMock_; // (2)
    }));

    it('should have detail object', function () {
      expect(braveNavigationServiceMock.default).toBeDefined();
      expect(braveNavigationServiceMock.second).toBeDefined();
    });

    it('should defined object keys', function () {
      console.log(braveNavigationServiceMock);
    //  expect(braveNavigationServiceMock.default[0].title).toBeDefined();
    //  expect(braveNavigationServiceMock.default[0].sref).toBeDefined();
    //  expect(braveNavigationServiceMock.default[0].icon).toBeDefined();
    //  expect(braveNavigationServiceMock.default[0].href).toBeDefined();
    //  expect(braveNavigationServiceMock.default[0].items).toBeDefined();
    });

  });

})();
