(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name app.docs tests
   * @description Docs tests
   *
   */
  describe('should provide BraveNavigationController', function () {

    var // AuthenticationMock,
      braveNavigationServiceMock,
      controller;

    var $httpBackend,
      $controller,
      $rootScope,
      $scope;

    beforeEach(function () {
      module('ngBraveNavigation');
    });

    beforeEach(inject(function ($injector) {
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
      $controller = $injector.get('$controller');

      $scope = $rootScope.$new();
    }));

    beforeEach(inject(function (_BraveNavigationServiceMock_) {

      // AuthenticationMock = _AuthenticationMock_;
      braveNavigationServiceMock = _BraveNavigationServiceMock_; // (2)

      $scope.symbol = 'default';

      controller = $controller('BraveNavigationController', {
        $scope: $scope,
        braveNavigationService: braveNavigationServiceMock
      });

    }));

    it('should have defined controller', inject(function () {
      expect(controller).toBeDefined();
    }));

    it('should have navigation in scope', inject(function () {
      $httpBackend.whenGET('/api/navigation/default').respond(braveNavigationServiceMock.default);
      $httpBackend.flush();
      $scope.$apply();

      expect($scope.navigation).toEqual(braveNavigationServiceMock.default);
    }));

  });

})();

