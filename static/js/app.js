function DataCtrl($scope) {

  $scope.today = new Date().toJSON().slice(0,10);
  $scope.order = '-date';
  $scope.dailies = [];

  $scope.init_data_ctrl = function() {

    // Get entries and convert to dailies
    //$scope.get_dailies();
    var entries = [{date: new Date('February 5, 2013'), amount: -137, category: 'Groceries', note: "Bought a lot of alcohol for a party"},
      {date: new Date('March 3, 2011'), amount: -100, category: 'Entertainment', note: "Went to the cinema and bought popcorn"},
      {date: new Date('March 3, 2011'), amount: -15.6, category: 'Groceries', note: "Milk, cheese etc"},
      {date: new Date('April 4, 2013'), amount: -20, category: 'Groceries', note: "Food for the weekend"},
      {date: new Date('July 1, 2013'), amount: 700, category: 'Salary', note: "My first salary"},
      {date: new Date('May 5, 2012'), amount: -24.53, category: 'Eating out', note: "Datenight"}];

    angular.forEach(entries, function(entry) {
      $scope.inject_to_dailies(entry);
    });
  }; // init_data_ctrl()

  $scope.init_add_entry = function() {
    $scope.date = $scope.today;
  };

  $scope.add_new_daily = function(date, amount, category, note) {
    $scope.dailies.push({date: date,
      subentries: [{amount: amount, category: category, note: note}],
      balance: amount});
  }

  $scope.inject_to_dailies = function(entry) {
    // If we don't have any dailies yet
    if ($.isEmptyObject($scope.dailies)) {
      // Create a new daily object
      $scope.add_new_daily(entry['date'], entry['amount'], entry['category'], entry['note'])
    }

    else {
      // Look through existing dates in dailies
      var found_existing_daily = false;
      angular.forEach($scope.dailies, function(daily) {

        // If we find a match (the time does not matter, only DD/MM/YYYYY)
        if (daily['date'].getDate() === entry['date'].getDate() 
          && daily['date'].getMonth() === entry['date'].getMonth() 
          && daily['date'].getFullYear() === entry['date'].getFullYear()) {
          
          // Add a subentry
          daily['subentries'].push({amount: entry['amount'],  category: entry['category'], note: entry['note'], type: entry['type']});
          
          // Calculate new balance
          var new_balance = 0;
          angular.forEach(daily.subentries, function(entry) {
            new_balance += entry.amount;
          });
          daily.balance = new_balance;
          
          found_existing_daily = true;

        } // if same date
      }); // forEach dailies

      if (!found_existing_daily) {
        // If we couldn't find a daily with this date, create a new one
        $scope.add_new_daily(entry['date'], entry['amount'], entry['category'], entry['note']);
      } // if !found_existing_daily
    } // else
  }

  $scope.add_entry = function() {
    var new_entry = {date: new Date($scope.date), amount: $scope.amount, category: $scope.category, note: $scope.note};
    // Save entry to db
    $scope.inject_to_dailies(new_entry);

    // Reset fields
    $scope.date = $scope.today;
    $scope.amount = '';
    $scope.category = '';
    $scope.note = '';
  };

  $scope.remove_entry = function(daily_hash, entry_hash) {
    angular.forEach($scope.dailies, function(daily) {
      var keep_looking = true;

      if (keep_looking) {
        // Find the entry and get rid of it
        if (daily.$$hashKey == daily_hash) {
          angular.forEach(daily.subentries, function(entry) {
            if (entry.$$hashKey == entry_hash) {
              daily.subentries.splice(daily.subentries.indexOf(entry), 1);
              keep_looking = false;
            }
          }); // forEach subentries
        }

        // If this leaves us with an empty daily, remove it, too
        if ($.isEmptyObject(daily.subentries)) {
          $scope.dailies.splice($scope.dailies.indexOf(daily), 1);
        }
      } // if keep_looking

    }); // forEach daily
  }

  $scope.get_totals = function() {
    var totals = {balance: 0, inc: 0, exp: 0};

    angular.forEach($scope.dailies, function(daily) {
      totals.balance += daily.balance;
      angular.forEach(daily.subentries, function(entry) {
        if (entry.amount > 0) {
          totals.inc += entry.amount;
        }
        else if (entry.amount < 0) {
          totals.exp += entry.amount;
        }
      });
    });

    return totals;
  }

  $scope.get_type = function(amount) {
    var type = '';
    if (amount > 0) {
      type = 'income';
    }
    else if (amount < 0) {
      type = 'expense';
    }
    return type;
  }
}