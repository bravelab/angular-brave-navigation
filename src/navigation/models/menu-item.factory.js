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

      // TODO: recurse tree
      if (typeof data.items !== 'string') {
        this.items = data.items;
      }

    };

    return factory;
  }

}());
