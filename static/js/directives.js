angular.module('fio.directives', [])

// Directive that executes expression when the FORM it is applied to either
// detects an ENTER keypress
// or detects that all of it's inputs have lost focus
.directive('stopEditing', function($timeout) {
  return function(scope, element, attrs) {

    // Unfocus focused input on ENTER keypress
    // (assuming only one input can have focus at any one time)
    element.bind("keydown keypress", function(event) {
      if(event.which === 13) {
        element.find('input:focus').blur();
      }
    });

    // Listen to any contained inputs losing focus
    element.find('input').bind('blur', function(event) {

      // Give it a moment to allow any other inputs to get focus
      $timeout(function() {
        // Only okay to execute expression when sure that
        // no other inputs in the same form now have focus
        if (!$(event.target).parents('form').find('input').is(':focus')) {
          scope.$apply(function() {
            scope.$eval(attrs.stopEditing)
          });
        } /* if no other has blur */
      }); /* timeout */

    }); /* input bind blur */

  }; /* return function */
}) /* stopEditing */

// Focus the first input contained in the directive applied to
// unless other inputs of the form have focus
// (this would mean we are still editing the entry)
.directive('pressEnter', function($timeout) {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if(event.which === 13) {
        scope.$apply(function(){
          scope.$eval(attrs.pressEnter);
        });
        event.preventDefault();
      }
    });
  };
})

// Execute the expression when enter is pressed
.directive('focusOnClick', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        $timeout(function() {
          if (!element.find('input').is(':focus')) {
            element.find('input')[0].focus();
          }
        });
      });
    }
  };
});