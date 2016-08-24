(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name app [ngBraveNavigation]
   * @description Show http errors by angular-navigation
   */
  angular
    .module('ngBraveNavigation', [])
    .value('version', '0.0.3');

})();

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

(function () {
  'use strict';

  angular
    .module('ngBraveNavigation')
    .constant('navigationConfig', {
      apiUrl: '/api'
    });

}());

(function () {
  'use strict';

  angular
    .module('ngBraveNavigation')
    .controller('BraveNavigationController', BraveNavigationController);

  BraveNavigationController.$inject = ['$scope', 'BraveNavigationService'];

  /**
   *
   * @param {Object} $scope - Scope
   * @param {Object} braveNavigationService - Service
   * @constructor
   */
  function BraveNavigationController($scope, braveNavigationService) {

    activate();

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf ngBraveNavigation.BraveNavigationController
     */
    function activate() {
      braveNavigationService.get($scope.symbol).then(function (navigation) {
        $scope.navigation = navigation;
      });
    }

  }

})();

(function () {
  'use strict';

  angular
    .module('ngBraveNavigation')
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

(function () {
  'use strict';

  angular
    .module('ngBraveNavigation')
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

(function () {
  'use strict';

  angular
    .module('ngBraveNavigation')
    .directive('braveNavigation', ['$rootScope', '$compile', 'BraveNavigationService', function ($rootScope, $compile, braveNavigationService) {

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
    .directive('smartMenuItems2', function ($http, $rootScope, $compile, APP_CONFIG, Authentication) {
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

/**
 * MenuItem
 * @namespace ngBraveNavigation
 */
(function () {
  'use strict';

  angular
    .module('ngBraveNavigation')
    .factory('MenuItem', MenuItem);

  MenuItem.$inject = [];

  function MenuItem() {

    var factory = function (data) {
      this.title = data.title;
      this.sref = data.sref;
      this.icon = data.icon;
      this.href = data.href;
      this.data = data.data;

      // TODO: recurse tree
      if (typeof data.items !== 'string') {
        this.items = data.items;
      }
    };

    return factory;
  }

}());

(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name app [ngBraveNavigation]
   * @description Config provider for ngBraveNavigation
   */
  angular
    .module('ngBraveNavigation')
    .provider('BraveNavigationConfig', function () {

      this.apiUrl = '/api';

      this.$get = function () {
        var apiUrl = this.apiUrl;

        return {
          getApiUrl: function () {
            return apiUrl;
          }
        };
      };

      this.setApiUrl = function (apiUrl) {
        this.apiUrl = apiUrl;
      };

    });

})();



(function () {

  'use strict';

  angular
    .module('ngBraveNavigation')
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

(function () {
  'use strict';

  angular
    .module('ngBraveNavigation')
    .factory('BraveNavigationService', BraveNavigationService);

  BraveNavigationService.$inject = ['$http', '$q', 'BraveNavigationConfig', 'NavigationTransformer'];

  /**
   *
   * @param {object} $http - Http object
   * @param {object} $q - Query object
   * @param {object} braveNavigationConfig - app config object provider
   * @param {object} navigationTransformer - doc list transformer object
   * @returns {{get: ngBraveNavigation.get}} - Service Factory
   * @constructor
   */
  function BraveNavigationService($http, $q, braveNavigationConfig, navigationTransformer) {

    var cache = {};

    var apiUrl = braveNavigationConfig.getApiUrl();

    /**
     * @name Docs
     * @desc The Factory to be returned
     */
    var factory = {
      get: get
    };

    return factory;

    /**
     * @name get
     * @desc Get single doc by type and slug params
     * @param {string} symbol Document symbol
     * @returns {Promise} - Promise an object
     * @memberOf ngBraveNavigation
     */
    function get(symbol) {

      var deferred = $q.defer();
      var id = symbol;

      if (typeof cache[id] !== 'undefined') {
        deferred.resolve(cache[id]);
      } else {
        $http({
          method: 'GET',
          url: apiUrl + '/navigation/' + symbol,
          transformResponse: navigationTransformer
        })
          .then(function (data) {
            cache[id] = data.data;
            deferred.resolve(cache[id]);
          }, function (data) {
            deferred.reject(data);
          });
      }

      return deferred.promise;
    }

  }
})();

/**
 * NavigationTransformer
 * @namespace ngBraveNavigation
 */
(function () {
  'use strict';

  angular
    .module('ngBraveNavigation')
    .factory('NavigationTransformer', NavigationTransformer);

  NavigationTransformer.$inject = ['MenuItem'];

  function NavigationTransformer(MenuItem) {
    return function (response) {

      var result = (typeof response === 'string') ? angular.fromJson(response) : response;
      var data = [];
      if (result.items.length > 0) {
        data = _.map(result.items, function (item) {
          return new MenuItem(item);
        });
      }

      return {
        items: data
      };
    };
  }

}());
