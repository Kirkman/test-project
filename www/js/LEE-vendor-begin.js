var LEE=LEE||{},googletag=googletag||{};
googletag.cmd=googletag.cmd||[];
googletag.cmd.push.loading=true;
	
/** @desc console shim for IE, implements a dummy console object for IE when the dev tools window is not open.  */
(function(b){function c(){}for(var a,d={},e=["memory"],f="assert clear count debug dir dirxml error exception group groupCollapsed groupEnd info log markTimeline profile profiles profileEnd show table time timeEnd timeline timelineEnd timeStamp trace warn".split(" ");a=e.pop();)b[a]=b[a]||d;for(;a=f.pop();)b[a]=b[a]||c})(this.console=this.console||{});
	
LEE.vendor = {
	'ad_unit': "/8438/stltoday.com/entertainment/dining/top100",
	'page_type':['app-graphics','not-defined'],
	'page_keywords':['not-defined'],
	'ad_mappings': [
		// desktop and phablets
		[[728, 90],[[728, 90]]],
		// smart phone
		[[320, 50],[[320, 50]]]
	],
	'ad_slots': {},
	'protocol': (document.location.protocol=='https:'?'https:':'http:'),
	'gt': googletag,
	'gt_loaded':false,
	'OX': null,
	'cmd':[],
	'debug': (document.location.search.match(/ninja=1/)?true:false),
	'log': function() {
		var things=['ninja:'],thing,args=Array.prototype.slice.call(arguments);
		if (this.debug) {
			while(thing=args.shift()) things.push(thing);
			console.log.apply(console,things);
		}
	}
};
