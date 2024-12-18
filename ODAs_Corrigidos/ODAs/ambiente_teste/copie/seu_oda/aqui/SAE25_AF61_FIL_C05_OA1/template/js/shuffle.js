/*
 * jQuery shuffle
 *
 * Copyright (c) 2008 Ca Phun Ung 
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://yelotofu.com/labs/jquery/snippets/shuffle/
 *
 * Shuffles an array or the children of a element container.
 * This uses the Fisher-Yates shuffle algorithm 
 */
 
(function($){

	$.fn.shuffle = function() {
		return this.each(function(){
			var items = $(this).children();
			return (items.length) ? $(this).html($.shuffle(items)) : this;
		});
	}
	
	$.shuffle = function(arr) {
		for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
		return arr;
	}
	
})(jQuery);
 

/*
//A utilização é bem simples:
$(´ul´).shuffle();
*/

/*
//E para array:
var arr = [1,2,3,4,5,6];
arr = $.shuffle(arr);
*/