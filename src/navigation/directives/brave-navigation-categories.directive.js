(function () {
  'use strict';

  angular
    .module('brave.navigation')
    .directive('braveNavigationCategories', ['$rootScope', '$compile', 'BraveNavigationCategories', function ($rootScope, $compile, braveNavigationCategories) {

      return {
        restrict: 'E',
        templateUrl: '',
        scope: {
          items: '@items'
        },
        compile: function (element, attrs) {

          // rendering
          braveNavigationCategories.get().then(function (data) {

            function _createItem(item, parent, level) {
              var li = $('<li />'); // {'ui-sref-active': 'active'}
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
              'data-menu': 'test'
            })
              .addClass('categories-list')
              .addClass('collapsed')
            ;

            _.forEach(data.items, function (item) {

              if (typeof item !== 'undefined') {
                _createItem(item, ul, 1);
              }
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
