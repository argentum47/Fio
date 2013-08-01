angular.module('fio.controllers', [])

// Control the UI for the user's entries data list
.controller('IOCtrl', function($scope, $filter, $timeout, DataServices) {

  var DS = DataServices;

  var templates_url = 'public/partials/io/';
  $scope.templates = {
    'entries': templates_url + 'entries.html'
  }

  $scope.today_date = new Date();
  $scope.today = new Date().toJSON().slice(0,10);
  $scope.order = '-date';     // the order in which dailies are shown
  $scope.categories = [];
  $scope.entries = [];        // the list of entries for this user
  $scope.dailies = [];        // the list of entries grouped by day shown to the user

  $scope.init_io_ctrl = function() {
    // Get entries and convert to dailies
    $scope.entries = DS.get_entries();
    $scope.dailies = DS.entries_to_dailies($scope.entries);

    // Get categories
    $scope.categories = DS.get_categories();

    // Fill date input with today's date
    $scope.date = $scope.today;
  }; // init_data_ctrl()

  $scope.add_entry = function() {

    // Only add if necessary fields have been filled in
    if ($scope.addEntryForm.$valid) {
      var new_entry = {date: new Date($scope.date), amount: $scope.amount, category: $scope.category.cat, note: $scope.note};
      // DS.save_entry(new_entry)
      $scope.entries.push(new_entry);
      $scope.dailies = DS.inject_to_dailies(new_entry, $scope.dailies);

      // Reset fields
      $scope.date = $scope.today;
      $scope.amount = '';
      $scope.category = '';
      $scope.note = '';
    }
  };

  $scope.process_edits = function(daily, entry) {
    // DS.update_entry(entry);

    // Convert form date into a Date object
    entry.date = new Date(entry.date);

    // If the date has changed, reorganise dailies
    if ($filter('date')(daily.date, 'yyyy-MM-dd')
        != $filter('date')(entry.date, 'yyyy-MM-dd')) {

      // Remove entry from our dailies list
      DS.remove_from_dailies(daily.$$hashKey, entry.$$hashKey, $scope.dailies);

      // Re-inject the entry into a suitable place accorring to the edited date
      $scope.dailies = DS.inject_to_dailies(entry, $scope.dailies);

    }
  }

  $scope.remove_entry = function(daily, entry) {
    $scope.entries.splice($scope.entries.indexOf(entry), 1);
    $timeout(function() {
      DS.remove_from_dailies(daily.$$hashKey, entry.$$hashKey, $scope.dailies);
    }, 500);
    // DS.remove_entry(entry)
  }

  // This is used to get dailies at specific positions in the *sorted* list
  $scope.get_daily_at = function(index) {
    var sorted_list = $filter('orderBy')($scope.dailies, $scope.order);
    return sorted_list[index];
  }

  $scope.set_entry_date = function(date, entry) {
    entry.date = date;
  }

  $scope.get_daily_totals = function(daily) {
    return DS.get_totals_for(daily);
  }

  $scope.get_totals = function() {
    return DS.get_totals($scope.dailies);
  }

  $scope.get_type = function(amount) {
    return DS.get_amount_type(amount);
  }
});