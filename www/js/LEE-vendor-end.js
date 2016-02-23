/** BEGIN: Krux user and segments */
window.Krux||((Krux=function(){ Krux.q.push(arguments);}).q=[]);
(function(w,d,n,t){
function z(n){var m,k='kx'+n;if(w.localStorage){return w.localStorage[k]||"";
}else if(n.cookieEnabled) {m=d.cookie.match(k+'=([^;]*)');return (m&&unescape(m[1]))||"";
}else{return ''}}t.user=z('user');t.segments=z('segs')&&z('segs').split(',')||[];
})(window,document,navigator,Krux);
/** END: Krux user and segments */

(function(ctx,w,d,$) {
	ctx.getScript=function(url,success) {
		return $.ajax({'url':url,'dataType':"script",'cache':true}).success(success);
	};
	ctx.gt.cmd.push(function() {
		ctx.log('loaded DFP')
		ctx.gt_loaded=true;
	});
	ctx.log('loading DFP');
	ctx.getScript(ctx.protocol+'//www.googletagservices.com/tag/js/gpt.js',function(){
		ctx.gt.cmd.push(function() {
			ctx.log('loading OpenX');
			ctx.getScript(ctx.protocol+'//ox-d.leessp.servedbyopenx.com/w/1.0/jstag?nc=8438-Lee',function(){
				ctx.OX = window.OX;
				ctx.log('loaded OpenX');
			});
		});	
	});

	ctx.ad_display = function(name, size, fold, mappings) {
		var gt=ctx.gt,adunit=ctx.ad_unit,ctn='gfp-ad-'+name,
			pos = fold.split(/\s*,\s*/);
		pos.push(name);
		
	    ctx.cmd.push(function() {
			var gp_slot;
			ctx.log('ad_display ',name, 'adunit:',adunit,'pos:',pos);
			try {
				gp_slot = gt.defineSlot(adunit, size, ctn);
				gp_slot.setTargeting("pos",pos).addService(gt.pubads());
			} catch(e) {
				console.error('calling defineSlot: ',e);
			}
			ctx.ad_slots[ctn] = {
				'id': ctn,
				'el':$('#'+ctn),
				'name': name,
				'size': size,
				'fold': fold,
				'pos': pos,
				'slot': gp_slot
			};
			try {
				if (mappings) gp_slot.defineSizeMapping(mappings);
			} catch(e) {
				console.error('calling defineSlot: ',e);
			}
            gt.display(ctn);
        });
	};	
	
	ctx.ad_slot_rendered = function(event) {
		var slot = event.slot,slots=ctx.ad_slots, id=slot.getSlotId().getDomId();
		if (slots.hasOwnProperty(id)) {
			var ad_slot = slots[id], log_pos = JSON.stringify(ad_slot.pos);
			if (ad_slot.slot && ad_slot.slot === slot) {
				ad_slot.rendered = {
					'size': event.size,
					'empty': event.isEmpty,
					'creative': event.creativeId,
					'line_item': event.lineItemId
				};
				if (event.isEmpty) {
					ctx.log('DFP(' + log_pos 
					+ ') slot not rendered, no creative/line items found.');
				}
				else {
					ctx.log('DFP(' + log_pos
					+') slot rendered,'
					+ 'line_item=' + event.lineItemId + ', '
					+ 'creative=' + event.creativeId);
				}
				ad_slot.el.trigger('dfp-rendered',ad_slot.rendered);
			}
		}
	};
	
	ctx.ad_launch=function() {
		var gt=ctx.gt, OX=ctx.OX, cmd;
		if (!ctx.gt_loaded) {
			ctx.log('waiting for DFP');
			setTimeout(ctx.ad_launch,500);
			return;
		}
		if (!OX) {
			ctx.log('waiting for OpenX');
			setTimeout(ctx.ad_launch,500);
			return;
		}
		if (gt && OX) {
			ctx.log("Ad platforms are ready... Handing off ad slots to DFP.");
			while(cmd=ctx.cmd.shift()) {
				gt.cmd.push(cmd);
			}
			ctx.log("ad slot definitions pushed, setting up page request.");
			gt.cmd.push(function() {
				var pa = gt.pubads();
				pa.setTargeting("page", ctx.page_type);
				ctx.log('page keywords are: ',ctx.page_keywords);
				pa.setTargeting("k", ctx.page_keywords);
				pa.enableSingleRequest();
				pa.collapseEmptyDivs();
				pa.addEventListener('slotRenderEnded', ctx.ad_slot_rendered);
				gt.enableServices();
			});
		}
		else {
			ctx.log('waiting for DFP and OX');
			setTimeout(ctx.ad_launch,250);
		}
	};
})(LEE.vendor,window,document,jQuery);
