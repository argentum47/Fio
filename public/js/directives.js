angular.module('fio.directives', [])

// Directive that executes expression when the FORM it is applied to either
// detects an ENTER keypress
// or detects that all of it's inputs have lost focus
.directive('interestLost', function($timeout) {
  return function(scope, element, attrs) {

    // Execute when interest has been lost
    var interest_lost = function() {
      // Only allow execution if the form is valid
      if (!$(element).find('form').hasClass('ng-invalid')) {     
        scope.$apply(function() {
          scope.$eval(attrs.interestLost);
        });
      }     
    }

    // All the inputs we need to watch
    var inputs = element.find('input');

    // Lose interest on ENTER or ESC keypress,
    // or TAB keypress if it is the last input in the element
    inputs.bind("keydown", function(event) {
      var key = event.keyCode || event.which;
      var is_last_input = $(this).is(inputs[inputs.length - 1]);
      if(key === 13 || key === 27 || 
         (key === 9 && is_last_input)) {
        interest_lost();
      }
    });

    // Lose interest when no inputs have focus
    inputs.bind('blur', function(event) {

      // Give it a moment to allow any other inputs to get focus
      $timeout(function() {
        if (!inputs.is(':focus')) {

          setTimeout(function() {
            // You can't lose interest
            // if the element isn't there
            if ($('html').find(element).length) {
              interest_lost();
            }
          }, 500);

        } /* if no other has focus */
      }); /* timeout */
    }); /* input bind blur */

  }; /* return function */
}) /* interestLost */

// Execute the expression when enter is pressed
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

// Focus the first input contained in the directive applied to
// unless other inputs of the form have focus
// (this would mean we are still editing the entry)
.directive('focusOnClick', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      element.bind('click', function(event) {
        $timeout(function() {
          if (!element.find('input').is(':focus')) {

            // Start out by focusing the first input
            element.find('input')[0].focus();

            // Attempt to perform a mouse click again 
            // to focus the input I actually wanted to change
            var el_at_pointer = $(document.elementFromPoint(event.clientX, event.clientY));
            if (el_at_pointer.is('input')) {
              el_at_pointer.focus();
            }

          }
        });
      });
    }
  };
});