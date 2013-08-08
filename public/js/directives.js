angular.module('fio.directives', [])

//=========================================================
// Directive that executes expression when the FORM it is applied to either
// detects an ENTER keypress
// or detects that all of it's inputs have lost focus.
//=========================================================

.directive('interestLost', function($timeout) {
  return function(scope, element, attrs) {

    // All the inputs we need to watch
    var inputs = element.find('input');

    // Check whether our current element is visible
    // also doubles as an existance check
    var active = function() { 
      return angular.element(element).is(':visible') ? true: false;
    }

    // Blur input on ENTER
    // or TAB keypress if it is the last input in the element
    inputs.bind("keydown", function(event) {
      var key = event.keyCode || event.which;
      var is_last_input = $(this).is(inputs[inputs.length - 1]);
      if(key === 13 || 
         (key === 9 && is_last_input)) {
        event.preventDefault();
        element.find('input:focus').blur();
        check_interest();
      }
    });

    // Whenever we make a click, we need to make sure the element
    // is still there (which may have been a remove action)
    // If it is, go on to check if we've lost interest
    angular.element('body').bind('click', function(event) {
      if (/* still */active()) {
        // Ignore this click event, we're still editing
        // (prevents other entries from opening)
        event.stopPropagation();
        check_interest();
      }
    });

    // Lose interest when no inputs have focus
    var check_interest = function() {
      // Give it a moment to allow any other inputs to get focus
      $timeout(function() {
        if (!inputs.is(':focus')) {
          interest_lost();
        } /* if no other has focus */
      }); /* timeout */
    };

    // When interest has been lost
    var interest_lost = function() {

      // If the form is valid
      if (!$(element).hasClass('ng-invalid')) {
        // Change the state to transitioning for just a few moments
        scope.losing_interest = true;
        $timeout(function() {
          scope.losing_interest = false;
        }, 400);
        // Execute the attributes
        scope.$apply(function() {
          scope.$eval(attrs.interestLost);
        });
      }

      // If the form is not valid
      else {
        // Set focus to the first invalid input
        $(inputs.filter('.ng-invalid')[0]).focus();
      }
    }

  }; /* return function */
}) /* interestLost */

//=========================================================
// Execute the expression when enter is pressed
//=========================================================

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

//=========================================================
// Focus the first input contained in the directive applied to
// unless other inputs of the form have focus
// (this would mean we are still editing the entry)
//=========================================================

.directive('focusOnClick', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      element.bind('click', function(event) {
        $timeout(function() {
          if (!element.find('input').is(':focus')) {

            // Start out by focusing the input at the given index
            element.find('input')[attrs.focusOnClick].focus();

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
})

//=========================================================
// Add a date processor and validator to an input
// in addition to existing angular validation.
//=========================================================

.directive('validateDate', function() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attr, ctrl) {

      // The parser will run each time the value is parsed
      // into the model when the user updates it
      ctrl.$parsers.unshift(function(value) {
        var date_valid = moment(value, 'DD/MM/YYYY').isValid();
        ctrl.$setValidity('date', date_valid);
        return date_valid ? value : undefined;
      });

      // Also add to $formatters.
      // Not sure why...
      ctrl.$formatters.unshift(function(value) {
        var date_valid = moment(value, 'DD/MM/YYYY').isValid();
        ctrl.$setValidity('dateValid', date_valid);
        return date_valid ? value : undefined;
      });

    }
  };
})