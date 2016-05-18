(function () {
  'use strict';

  angular.module('ngBraveNavigation').directive('smartMenuItems2', function ($http, $rootScope, $compile,
                                                                             APP_CONFIG, Authentication) {
    return {
      restrict: 'A',
      compile: function (element, attrs) {


        function createItem(item, parent, level) {
          var li = $('<li />', {'ui-sref-active': 'active'});
          var a = $('<a />');
          var i = $('<i />');

          li.append(a);

          if (item.sref) {
            a.attr('ui-sref', item.sref);
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
              createItem(child, ul, level + 1);
            });
          }

          parent.append(li);
        }


        $http({
          method: 'GET',
          url: APP_CONFIG.apiUrl + attrs.smartMenuItems2,
          headers: {'Authorization': 'Token ' + Authentication.getAuthenticatedAccount().key}
        }).then(function (res) {
          var ul = $('<ul />', {
            'smart-menu': ''
          });
          _.forEach(res.data.items, function (item) {
            createItem(item, ul, 1);
          });

          var $scope = $rootScope.$new();
          var html = $('<div>').append(ul).html();
          var linkingFunction = $compile(html);

          var _element = linkingFunction($scope);

          element.replaceWith(_element);
        });
      }
    };
  });
})();
