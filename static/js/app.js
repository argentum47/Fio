function DataCtrl($scope) {

  $scope.today = new Date().toJSON().slice(0,10);
  $scope.order = '-date';
  $scope.entries = [];
  $scope.dailies = [];

  $scope.init_data_ctrl = function() {

    // Find existing entries
    $scope.entries.push({date: new Date('February 5, 2013'), amount: 137, category: 'Groceries', note: "Bought a lot of alcohol for a party"},
      {date: new Date('March 3, 2011'), amount: 100, category: 'Entertainment', note: "Went to the cinema and bought popcorn"},
      {date: new Date('March 3, 2011'), amount: 15.6, category: 'Groceries', note: "Milk, cheese etc"},
      {date: new Date('April 4, 2013'), amount: 15.6, category: 'Groceries', note: "Milk, cheese etc"},
      {date: new Date('May 5, 2012'), amount: 24.53, category: 'Eating out', note: "Datenight"});

    angular.forEach($scope.entries, function(entry) {
      $scope.inject_to_dailies(entry);
    });
  }; // init_data_ctrl()

  $scope.add_new_daily = function(date, amount, category, note) {
    $scope.dailies.push({date: date,
      subentries: [{amount: amount, category: category, note: note}],
      total: amount});
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
          daily['subentries'].push({amount: entry['amount'],  category: entry['category'], note: entry['note']});
          
          // Calculate new total
          var new_total = 0;
          angular.forEach(daily['subentries'], function(subentry) {
            new_total += subentry['amount'];
          });
          daily['total'] = new_total;
          
          found_existing_daily = true;

        } // if same date
      }); // forEach dailies

      if (!found_existing_daily) {
        // If we couldn't find a daily with this date, create a new one
        $scope.add_new_daily(entry['date'], entry['amount'], entry['category'], entry['note'])
      } // if !found_existing_daily
    } // else
  }

  $scope.init_add_entry = function() {
    $scope.date = $scope.today;
  };

  $scope.add_entry = function() {
    var new_entry = {date: new Date($scope.date), amount: $scope.amount, category: $scope.category, note: $scope.note};
    $scope.entries.push(new_entry);
    $scope.inject_to_dailies(new_entry);

    // Reset fields
    $scope.date = $scope.today;
    $scope.amount = '';
    $scope.category = '';
    $scope.note = '';
  };

  $scope.remove_entry = function(i) {
    var entry_to_remove = $scope.entries[i];
    console.log("remove " + entry_to_remove);
  }

  $scope.balance = function() {
    var balance = 0;
    angular.forEach($scope.entries, function(entry) {
      balance += entry.amount;
    });
    return balance;
  }
}