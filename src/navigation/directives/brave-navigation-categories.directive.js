(function () {
  'use strict';

  angular
    .module('brave.navigation')
    .directive('braveNavigationCategories', ['$compile', function ($compile) {

      var renderMenu = function (menuItems, currentScope) {

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
            'data-menu': "test"
          })
            .addClass('categories-list')
            .addClass('collapsed')
          ;

        if (angular.isDefined(menuItems.items)) {

          _.forEach(menuItems.items, function (item) {

            if (typeof item !== 'undefined') {
              _createItem(item, ul, 1);
            }
          });

          var html = $('<div>').append(ul).html();
          var linkingFunction = $compile(html);

          var _element = linkingFunction(currentScope);
        }

        return _element;
      };

      return {
        restrict: 'AE',
        scope: {
          items: '='
        },
        controller: function ($scope) {

          $scope.$watch('items', function (newItems) {

            if (angular.isDefined(newItems)) {
              $scope.renderedMenu = renderMenu(newItems, $scope);
            }
          });
        },
        link: function (scope, element, attrs) {

          scope.$watch('renderedMenu', function (newMenuValue) {

            element.text('LOADING');
            if (angular.isDefined(newMenuValue) && newMenuValue) {
              element.replaceWith(newMenuValue);
            }
          });
        }
      };
    }]);

}());
