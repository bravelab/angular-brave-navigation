(function () {

  'use strict';

  angular
    .module('brave.navigation')
    .factory('BraveNavigationServiceMock', ['$q', 'MenuItem', function ($q, MenuItem) {

      var defaultNav = {
        'items': [
          new MenuItem({
            'title': 'Home',
            'sref': 'app.home',
            'icon': 'home',
            'href': '#'
          }),
          new MenuItem({
            'title': 'Documents',
            'sref': 'app.doc.list',
            'icon': 'table',
            'href': '#'
          }),
          new MenuItem({
            'title': 'Settings',
            'sref': 'app.settings.list',
            'icon': 'table',
            'href': '#'
          })
        ]
      };

      var secondNav = {
        'items': [
          new MenuItem({
            'title': 'Some menu item',
            'sref': 'app.settings.list',
            'icon': 'table',
            'href': '#'
          })
        ]
      };

      var factory = {
        'default': defaultNav,
        'second': secondNav
      };

      return factory;

    }]);

})();
