(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name app [ngBraveNavigation]
   * @description Show http errors by angular-navigation
   */
  angular
    .module('ngBraveNavigation', [])
    .value('version', '0.0.1');

})();

(function () {
  'use strict';

  angular
    .module('ngBraveNavigation')
    .directive('smartMenuItems', function ($http, $rootScope, $compile) {
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


          $http.get(attrs.smartMenuItems).then(function (res) {
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

(function () {
  'use strict';

  angular
    .module('ngBraveNavigation')
    .directive('smartMenu', function ($state, $rootScope) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var $body = $('body');

          var $collapsible = element.find('li[data-menu-collapse]');

          var bindEvents = function () {
            $collapsible.each(function (idx, li) {
              var $li = $(li);
              $li
                .on('click', '>a', function (e) {

                  // collapse all open siblings
                  $li.siblings('.open').smartCollapseToggle();

                  // toggle element
                  $li.smartCollapseToggle();

                  // add active marker to collapsed element if it has active childs
                  if (!$li.hasClass('open') && $li.find('li.active').length > 0) {
                    $li.addClass('active');
                  }

                  e.preventDefault();
                })
                .find('>a').append('<b class="collapse-sign"><em class="fa fa-plus-square-o"></em></b>');

              // initialization toggle
              if ($li.find('li.active').length) {
                $li.smartCollapseToggle();
                $li.find('li.active').parents('li').addClass('active');
              }
            });
          };
          bindEvents();


          // click on route link
          element.on('click', 'a[data-ui-sref]', function () {
            // collapse all siblings to element parents and remove active markers
            $(this)
              .parents('li').addClass('active')
              .each(function () {
                $(this).siblings('li.open').smartCollapseToggle();
                $(this).siblings('li').removeClass('active');
              });

            if ($body.hasClass('mobile-view-activated')) {
              $rootScope.$broadcast('requestToggleMenu');
            }
          });


          scope.$on('$smartLayoutMenuOnTop', function (event, menuOnTop) {
            if (menuOnTop) {
              $collapsible.filter('.open').smartCollapseToggle();
            }
          });
        }
      };
    });

}());

(function ($) {
  'use strict';

  $.fn.smartCollapseToggle = function () {

    return this.each(function () {

      var $body = $('body');
      var $this = $(this);

      // only if not  'menu-on-top'
      if ($body.hasClass('menu-on-top')) {
        // ...
      } else {

        $body.hasClass('mobile-view-activated');

        // toggle open
        $this.toggleClass('open');

        // for minified menu collapse only second level
        if ($body.hasClass('minified')) {
          if ($this.closest('nav ul ul').length) {
            $this.find('>a .collapse-sign .fa').toggleClass('fa-minus-square-o fa-plus-square-o');
            $this.find('ul:first').slideToggle(window.appConfig.menuSpeed || 200);
          }
        } else {
          // toggle expand item
          $this.find('>a .collapse-sign .fa').toggleClass('fa-minus-square-o fa-plus-square-o');
          $this.find('ul:first').slideToggle(window.appConfig.menuSpeed || 200);
        }
      }
    });
  };

})(jQuery);
