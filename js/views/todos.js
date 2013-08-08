/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// Todo Item View
	// --------------

	// The DOM element for a todo item...
	app.TodoView = Backbone.View.extend({
		//... is a list tag.
		tagName:  'li',

		// Cache the template function for a single item.
		template: _.template($('#item-template').html()),

		// The DOM events specific to an item.
		events: {
      'click .but': 'showInput',
			'click .start': 'toggleSecond',
			'click .toggle': 'toggleCompleted',
			'dblclick label': 'edit',
			'click .destroy': 'clear',
			'keypress .edit': 'updateOnEnter',
			'blur .edit': 'close',
      'keypress .inp': 'updateList',
      'blur .inp': 'updateList',
      'click .swap': 'swap'


		},

		// The TodoView listens for changes to its model, re-rendering. Since there's
		// a one-to-one correspondence between a **Todo** and a **TodoView** in this
		// app, we set a direct reference on the model for convenience.


		initialize: function () {
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
			this.listenTo(this.model, 'change:isVisNewLabel', this.renderNewLabel);
			this.listenTo(this.model, 'change:isHide', this.renderHide);
			this.listenTo(this.model, 'change:title', this.renderName);
      this.listenTo(this.model, 'change:value', this.renderList);
      this.listenTo(this.model, 'change:allHide', this.renderHideList);
      this.listenTo(this.model, 'change:modelst', this.renderNewList);
      this.model.save({'value' : ' ' });
      this.model.save({'isHide': false});
      this.model.set("str", this.model.get('title'));
      this.model.save({'isVisNewLabel' : false});
      this.model.save({'hideStatus': false });
      this.model.save({'modelst': true});
		},

    renderHideList: function(){
      console.log("renderHideList", this.$el.parent(),"appTodos>>>", app.todos);
      this.$el.parent().toggle(!this.model.get("allHide"));

    },

    renderNewList: function(){
      console.log("renderNewList>>>",this.$el,this.model.get('modelst'));
      this.$el.find('.start').addClass('colr');
    },


    renderHide: function(){
      this.$el.find(".inp").toggle(this.model.get('isHide'))
    },
    showInput: function(){
      console.log("@@@@@@@@@",this);
      this.model.set('isHide', !this.model.get('isHide'))

//      this.model.get("isHide") ? true : this.$el.find(".inp").hide();
//
//      if(!this.model.get("isHide")){
//        this.$el.find(".inp").hide();
//        this.model.set('isHide', true);
//      }
//      else{
//        this.$el.find(".inp").show();
//        this.model.set('isHide', false);
//      }
//      console.log("showwwwwwwwwwwww",this.model.get("isHide"));
     },

    renderList: function(){
      console.log("renderList");
      console.log(this.model.get("value"));
      this.$el.find(".start").html(this.model.get('value'))
    },

    updateList: function(e){
      this.model.set( 'value', this.$el.find(".inp").val() );
      console.log("updateList")
      if (e.which === ENTER_KEY) {
        this.model.set( 'value', this.$el.find(".inp").val() );
      }
      //this.model.set( 'value', this.$el.find(".inp").val() );
    },

    swap: function(){
      console.log("fromSwap");
      console.log(this.$el.find(".start").html())
      console.log(this.$el.find(".test").html())

//      var str1 = this.model.get('title');
//      var str2 = this.model.get('str');

      console.log("@@@@@@@@",this.model.get('str'))

      //console.log("str1",str1,"str2", str2 );

      console.log( this.$el.find(".start").html() == this.$el.find(".test").html() );



      if( this.$el.find(".start").html() == this.$el.find(".test").html() ){
        console.log("noSwap");
        return
      }
      else{
        console.log("swap");
        //str1=[str2,str2=str1][0]
        //console.log("str1",str1,"str2", str2 );
        // console.log( this.model.toJSON() );
        var temp = this.model.get('title');
        this.model.set('title', this.$el.find(".test").html() );
        this.model.set('str', temp);
        this.renderName();

      }
    },

    toggleSecond: function(){
      console.log("toogleFunct", this.model.get('isVisNewLabel'))
      this.model.set('isVisNewLabel', !this.model.get('isVisNewLabel'))
    },

    renderName: function() {
      console.log("renderName", this.model.toJSON())

      this.$el.find(".start").html(this.model.get('title'))
      this.$el.find(".test").html(this.model.get('str'))


      this.model.get('isVisNewLabel') ? true : this.model.save({'isVisNewLabel' : true})


    },

		// Re-render the titles of the todo item.
		render: function () {
      console.log("render!!!!!!!!!!!!!!!!")

			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('completed', this.model.get('completed'));
			this.toggleVisible();
      this.renderNewLabel()
      this.renderHide()
      //this.renderName();
			this.$input = this.$('.edit');

			return this;
		},

    renderNewLabel: function() {
//      if (!this.dom_newlabel)
//        this.dom_newlabel = $(".newlabel")
//
      console.log("toogleFunct render", this.model.get('isVisNewLabel'))

      this.dom_newlabel = (this.dom_newlabel) ? this.dom_newlabel : this.$el.find(".test")

//      if (this.model.get('isVisNewLabel')) {
//        this.dom_newlabel.show()
//      } else {
//        this.dom_newlabel.html('asdfasdfasdf')
//      }
//      console.log("render nav label", this.model.get('isVisNewLabel'))

      console.log("toogleFunct render after", this.model.get('isVisNewLabel'))

      this.dom_newlabel.toggle(this.model.get('isVisNewLabel'))

    },
		toggleVisible: function () {
			this.$el.toggleClass('hidden', this.isHidden());
		},


		isHidden: function () {
			var isCompleted = this.model.get('completed');
			return (// hidden cases only
				(!isCompleted && app.TodoFilter === 'completed') ||
				(isCompleted && app.TodoFilter === 'active')
			);
		},

		// Toggle the `"completed"` state of the model.
		toggleCompleted: function () {
			this.model.toggle();
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function () {
			this.$el.addClass('editing');
			this.$input.focus();

		},

		// Close the `"editing"` mode, saving changes to the todo.
		close: function () {

			var value = this.$input.val().trim();
      var str = this.$input.val().trim();

			if (value) {
        console.log("from edit");
        this.model.set("str", this.model.get('title'));


        //this.$el.find(".test").html(this.model.get('title'))

				this.model.save({ title: value });

        console.log(this.model.toJSON());
			} else {
				this.clear();
			}

			this.$el.removeClass('editing');
      console.log("after save new title", this.model.toJSON())

    },

		// If you hit `enter`, we're through editing the item.
		updateOnEnter: function (e) {
			if (e.which === ENTER_KEY) {
				this.close();
			}
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function () {
			this.model.destroy();
		},
    showInfo: function(){
      console.log("show")

       }

	});
})(jQuery);