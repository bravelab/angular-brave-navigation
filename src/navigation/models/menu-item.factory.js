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
