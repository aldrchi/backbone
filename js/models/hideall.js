/**
 * Created with JetBrains WebStorm.
 * User: dunice
 * Date: 8/7/13
 * Time: 2:00 PM
 * To change this template use File | Settings | File Templates.
 */
/*global Backbone */
var app = app || {};

(function () {
  'use strict';

  app.Hideall = Backbone.Model.extend({

    defaults: {
      hAll: false
    },

    toggleAll: function(){
      console.log("toggleAll")
    }

  });
})();
