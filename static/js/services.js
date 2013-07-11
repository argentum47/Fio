angular.module('fio.services', [])

// Provide entry and daily manipulation services
.factory('DataServices', function($filter) {

  // Declare services
  var s = {};

  // Retrieve entries from the API
  s.get_entries = function() {
    // For now, use test data from csv file
    var entries;
    $.ajax('http://127.0.0.1:5000/static/data.csv', {
      async: false,
      success: function(data) {
        var raw_entries = csvjson.csv2json(data).rows;
        // Convert date strings to Dates and amount strings to Numbers
        angular.forEach(raw_entries, function(entry) {
          entry.date = new Date(entry.date);
          entry.amount = Number(entry.amount.replace('£',''));
        });
        entries = raw_entries;
      }
    });
    return entries;
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