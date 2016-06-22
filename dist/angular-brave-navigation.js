(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name brave.navigation [brave.navigation]
   * @description Simple navigation directives and services
   */
  angular
    .module('brave.navigation', [])
    .value('version', '0.0.6');

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
    .module('brave.navigation')
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
     * @memberOf brave.navigation.BraveNavigationController
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

(function () {
  'use strict';

  angular
    .module('brave.navigation')
    .directive('braveNavigation', ['$rootScope', '$compile', '$translate', 'BraveNavigationService', function ($rootScope, $compile, $translate, braveNavigationService) {

      return {
        restrict: 'E',
        scope: {
          symbol: '@symbol'
        },
        compile: function (element, attrs) {
          braveNavigationService.get(attrs.symbol).then(function (data) {

            // Helper function
            function _createItem(item, parent, level) {
              var li = $('<li />', {'data-ui-sref-active': 'active'});
              var a = $('<a />');
              var i = $('<i />');

              li.append(a);

              if (item.sref) {
                a.attr('data-ui-sref', item.sref);
              }
              if (item.href) {
                a.attr('href', item.href);
              }
              if (item.icon) {
                i.attr('class', 'fa fa-lg fa-fw fa-' + item.icon);
                a.append(i);
              }
              if (item.title) {
                a.attr('title', $translate.instant(item.title));
                if (level === 1) {
                  a.append('<span class="menu-item-parent">' + $translate.instant(item.title) + '</span>');
                } else {
                  a.append(' ' + $translate.instant(item.title));

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
    .module('brave.navigation')
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
    .module('brave.navigation')
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
    .module('brave.navigation')
    .directive('smartMenu', function ($state, $rootScope, $timeout) {
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


              $timeout(function () {
                if ($li.find('li.active').length) {
                  // initialization toggle
                  $li.smartCollapseToggle();
                  $li.find('li.active').parents('li').addClass('active');
                }
              });
            });
          };
          bindEvents();


          // click on route link
          element.on('click', 'a[data-ui-sref]', function (e) {
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
 * @namespace brave.navigation
 */
(function () {
  'use strict';

  angular
    .module('brave.navigation')
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
   * @name brave.navigation [brave.navigation]
   * @description Config provider for brave.navigation
   */
  angular
    .module('brave.navigation')
    .provider('BraveNavigation', function () {

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
    .module('brave.navigation')
    .factory('BraveNavigationCategories', BraveNavigationCategories);

  BraveNavigationCategories.$inject = ['$http', '$q', 'BraveNavigation', 'CategoriesTransformer'];

  /**
   *
   * @param {object} $http - Http object
   * @param {object} $q - Query object
   * @param {object} braveNavigation - module config provider
   * @param {object} categoriesTransformer - doc list transformer object
   * @returns {{get: brave.navigation.get}} - Service Factory
   * @constructor
   */
  function BraveNavigationCategories($http, $q, braveNavigation, categoriesTransformer) {

    var cache = {};

    var apiUrl = braveNavigation.getApiUrl();

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
     * @returns {Promise} - Promise an object
     * @memberOf brave.navigation
     */
    function get() {

      var deferred = $q.defer();
      var id = 'categories';

      if (typeof cache[id] !== 'undefined') {
        deferred.resolve(cache[id]);
      } else {
        $http({
          method: 'GET',
          url: apiUrl + '/products/categories',
          transformResponse: categoriesTransformer
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

(function () {
  'use strict';

  angular
    .module('brave.navigation')
    .factory('BraveNavigationService', BraveNavigationService);

  BraveNavigationService.$inject = ['$http', '$q', 'BraveNavigation', 'NavigationTransformer'];

  /**
   *
   * @param {object} $http - Http object
   * @param {object} $q - Query object
   * @param {object} braveNavigation - app config object provider
   * @param {object} navigationTransformer - doc list transformer object
   * @returns {{get: brave.navigation.get}} - Service Factory
   * @constructor
   */
  function BraveNavigationService($http, $q, braveNavigation, navigationTransformer) {

    var cache = {};

    var apiUrl = braveNavigation.getApiUrl();

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
     * @memberOf brave.navigation
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
 * CategoriesTransformer
 * @namespace brave.navigation
 */
(function () {
  'use strict';

  angular
    .module('brave.navigation')
    .factory('CategoriesTransformer', CategoriesTransformer);

  CategoriesTransformer.$inject = ['MenuItem'];

  function CategoriesTransformer(MenuItem) {
    return function (response) {

      var result = (typeof response === 'string') ? angular.fromJson(response) : response;

      var data = [];
      if (result.data.length > 0) {

        data = _.map(result.data, function (item) {

          if (item.is_visible === true) {

            var menuItemObj = {};

            menuItemObj.title =  item.name;
            menuItemObj.sref = 'productHome.list';
            menuItemObj.icon = null;
            menuItemObj.data = {'slug': item.slug};
            menuItemObj.href = null;

            return new MenuItem(menuItemObj);
          }

        });
      }

      return {
        items: data
      };
    };
  }

}());

/**
 * NavigationTransformer
 * @namespace brave.navigation
 */
(function () {
  'use strict';

  angular
    .module('brave.navigation')
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
