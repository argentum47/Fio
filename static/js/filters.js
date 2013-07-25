angular.module('fio.filters', [])

// Convert given number to currency with required decimals
// Not using default because that one puts parentheses around negatives
.filter('currency', function($filter) {
	return function(target, symbol, decimals) {
		var is_negative = target < 0 ? true : false;
		var abs = Math.abs(target);
		var with_decimals = $filter('number')(abs, decimals);
		var currency = symbol + with_decimals;
		if (is_negative) {
			currency = "-" + currency;
		}
		else {
			currency = "+" + currency;
		}
		return currency;
	}
});