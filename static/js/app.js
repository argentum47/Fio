var app = angular.module('fio', []);

// Control the UI for the user's entries data list
app.controller('IOCtrl', function($scope, $filter, DataServices) {

  $scope.today = new Date().toJSON().slice(0,10);
  $scope.order = '-date';     // the order in which dailies are shown
  $scope.entries = [];        // the list of entries for this user
  $scope.dailies = [];        // the list of entries grouped by day shown to the user

  $scope.init_io_ctrl = function() {

    // Get entries and convert to dailies
    $scope.entries = DataServices.get_entries();
    $scope.dailies = DataServices.entries_to_dailies($scope.entries);

    // Fill date input with today's date
    $scope.date = $scope.today;
  }; // init_data_ctrl()
 
  $scope.add_entry = function() {
    var new_entry = {date: new Date($scope.date), amount: $scope.amount, category: $scope.category, note: $scope.note};
    // DataServices.save_entry(new_entry)
    $scope.dailies = DataServices.inject_to_dailies(new_entry, $scope.dailies);

    // Reset fields
    $scope.date = $scope.today;
    $scope.amount = '';
    $scope.category = '';
    $scope.note = '';
  };

  $scope.process_edits = function(daily, entry) {
    // DataServices.update_entry(entry);

    // Convert form date into a Date object
    entry.date = new Date(entry.date);

    // If the date has changed, reorganise dailies
    if ($filter('date')(daily.date, 'yyyy-MM-dd')
        != $filter('date')(entry.date, 'yyyy-MM-dd')) {

      // Remove entry from our dailies list
      DataServices.remove_from_dailies(daily.$$hashKey, entry.$$hashKey, $scope.dailies);
    
      // Re-inject the entry into a suitable place accorring to the edited date
      $scope.dailies = DataServices.inject_to_dailies(entry, $scope.dailies);
    
    }
  }

  $scope.remove_entry = function(daily, entry) {
    DataServices.remove_from_dailies(daily.$$hashKey, entry.$$hashKey, $scope.dailies);
    // DataServices.remove_entry(entry)
  }

  $scope.set_entry_date = function(date, entry) {
    entry.date = date;
  }

  $scope.get_daily_totals = function(daily) {
    return DataServices.get_totals_for(daily);
  }

  $scope.get_totals = function() {
    return DataServices.get_totals($scope.dailies);
  }

  $scope.get_type = function(amount) {
    return DataServices.get_amount_type(amount);
  }
});

// Provide entry and daily manipulation services
app.factory('DataServices', function($filter) {

  // Declare services
  var s = {};

  // Retrieve entries from the API
  s.get_entries = function() {
    var entries = [{date: new Date('February 5, 2013'), amount: -137, category: 'Groceries', note: "Bought a lot of alcohol for a party"},
      {date: new Date('March 3, 2011'), amount: -100, category: 'Entertainment', note: "Went to the cinema and bought popcorn"},
      {date: new Date('March 3, 2011'), amount: -15.6, category: 'Groceries', note: "Milk, cheese etc"},
      {date: new Date('April 4, 2013'), amount: -20, category: 'Groceries', note: "Food for the weekend"},
      {date: new Date('April 4, 2013'), amount: 700, category: 'Salary', note: "My first salary"},
      {date: new Date('April 4, 2013'), amount: -24.53, category: 'Eating out', note: "Datenight"}];
    return entries
  };
  
  // Add a new daily object to given dailies
  s.add_new_daily = function(date, amount, category, note, dailies) {
    dailies.push({date: date, subentries: [{amount: amount, category: category, note: note}]});
    return dailies;
  }

  // Find the correct place to inject an entry into given dailies
  s.inject_to_dailies = function(entry, dailies) {
    // If we don't have any dailies yet
    if ($.isEmptyObject(dailies)) {
      // Create a new daily object
      s.add_new_daily(entry.date, entry.amount, entry.category, entry.note, dailies)
    }

    else {
      // Look through existing dates in dailies
      var found_existing_daily = false;
      angular.forEach(dailies, function(daily) {

        // If we find a match (the time does not matter, only DD/MM/YYYYY)
        if ($filter('date')(daily.date, 'yyyy-MM-dd')
            == $filter('date')(entry.date, 'yyyy-MM-dd')) {
          
          // Add a subentry
          daily.subentries.push({amount: entry.amount,  category: entry.category, note: entry.note});
          
          found_existing_daily = true;

        } // if same date
      }); // forEach dailies

      if (!found_existing_daily) {
        // If we couldn't find a daily with this date, create a new one
        s.add_new_daily(entry.date, entry.amount, entry.category, entry.note, dailies);
      } // if !found_existing_daily
    } // else

    return dailies;
  }

  // Convert a batch of entries into daily objects
  s.entries_to_dailies = function(entries) {
    var dailies = [];
    angular.forEach(entries, function(entry) {
      dailies = s.inject_to_dailies(entry, dailies);
    });
    return dailies;
  }

  s.remove_from_dailies = function(daily_hash, entry_hash, dailies) {
    var entry_removed;
    angular.forEach(dailies, function(daily) {
        var keep_looking = true;

        if (keep_looking) {
          // Find the entry and get rid of it
          if (daily.$$hashKey == daily_hash) {
            angular.forEach(daily.subentries, function(entry) {
              if (entry.$$hashKey == entry_hash) {
                entry_removed = entry;
                daily.subentries.splice(daily.subentries.indexOf(entry), 1);
                keep_looking = false;
              }
            }); // forEach subentries
          }

          // If this leaves us with an empty daily, remove it, too
          if ($.isEmptyObject(daily.subentries)) {
            dailies.splice(dailies.indexOf(daily), 1);
          }
        } // if keep_looking

      }); // forEach daily

    // Return the entry we got rid of
    return entry_removed;
  };

  s.get_totals_for = function(daily) {
    var totals = {balance: 0, inc: 0, exp: 0}
    angular.forEach(daily.subentries, function(entry) {
      totals.balance += entry.amount;
      if (entry.amount > 0) {
        totals.inc += entry.amount;
      }
      else if (entry.amount < 0) {
        totals.exp += entry.amount;
      }
    });
    return totals;
  };

  s.get_totals = function(dailies) {
    var totals = {balance: 0, inc: 0, exp: 0};

    angular.forEach(dailies, function(daily) {
      var daily_totals = s.get_totals_for(daily);
      totals.balance += daily_totals.balance;
      totals.inc += daily_totals.inc;
      totals.exp += daily_totals.exp;
    });

    return totals;
  };

  s.get_amount_type = function(amount) {
    var type = '';
    if (amount > 0) {
      type = 'income';
    }
    else if (amount < 0) {
      type = 'expense';
    }
    return type;
  }

  return s;
});

// Directive that executes expression when the FORM it is applied to either
// detects an ENTER keypress
// or detects that all of it's inputs have lost focus
app.directive('stopEditing', function($timeout) {
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
}); /* stopEditing */

// Focus the first input contained in the directive applied to
// unless other inputs of the form have focus
// (this would mean we are still editing the entry)
app.directive('focusOnClick', function($timeout) {
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