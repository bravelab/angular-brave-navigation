(function () {
  'use strict';

  angular
    .module('brave.navigation')
    .directive('braveNavigationFront', ['$rootScope', '$compile', 'BraveNavigationService', function ($rootScope, $compile, braveNavigationService) {

      return {
        restrict: 'E',
        scope: {
          symbol: '@symbol'
        },
        compile: function (element, attrs) {

          braveNavigationService.get(attrs.symbol).then(function (data) {

            // Helper function
            function _createItem(item, parent, level) {
              var li = $('<li />', {'ui-sref-active': 'active'});
              var a = $('<a />');
              var i = $('<i />');

              li.append(a);

              if (item.sref) {

                var srefValue;
                srefValue = item.sref;

                if (item.data) {

                  srefValue += '(' + JSON.stringify(item.data) + ')';
                }
                a.attr('ui-sref', srefValue);
              }


              if (item.href) {
                a.attr('href', item.href);
              }
              if (item.icon) {
                i.attr('class', 'fa fa-lg fa-fw fa-' + item.icon);
                a.append(i);
              }
              if (item.title) {
                a.attr('title', item.title);
                if (level === 1) {
                  a.append('<span class="menu-item-parent">' + item.title + '</span>');
                } else {
                  a.append(' ' + item.title);

                }
              }

              if (item.items) {
                var ul = $('<ul />');
                li.append(ul);
                li.attr('data-menu-collapse', '');
                _.forEach(item.items, function (child) {
                  _createItem(child, ul, level + 1);
                });
              }
              parent.append(li);
            }

            // Generate menu
            var ul = $('<ul />', {
              'smart-menu': ''
            });
            _.forEach(data.items, function (item) {
              _createItem(item, ul, 1);
            });

            var $scope = $rootScope.$new();
            var html = $('<div>').append(ul).html();
            var linkingFunction = $compile(html);

            var _element = linkingFunction($scope);

            element.replaceWith(_element);

          });
        }
      };
    }]);

}());
