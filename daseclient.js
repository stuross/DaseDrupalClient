$(document).ready(function() {

	var showResults = function(json){
		var base = json.app_root;
		var fieldset = $('#edit-search-wrapper').parent('div');
		$(fieldset).children('ul, img, h1').remove();
		if(json.items.length > 0){
			var list = '<ul class="dase_search_gallery">';
			$.each(json.items,function(i,n){
				var title = 'No Title';
				var thumb = '';
				var mp3 = '';
				if(n.metadata.title){
					title = n.metadata.title;
					if(title[0].length > 40){
						title = title[0].substring(0,40)+'...';
					}
				}

				if(n.media.thumbnail){
					thumb = base+n.media.thumbnail;
				}
				if(n.media.mp3){
					mp3 = base+n.media.mp3;
				}


				if(thumb){
					if(!n.media.mp3){
						list += '<li id="'+i+'"><div><input type="checkbox"/><img src="'+thumb+'"/><span>'+title+'</span></div></li>';
					}
					else{
						list += '<li id="'+i+'"><div><input type="checkbox"/><a href="'+mp3+'"><img src="'+thumb+'"/></a><span>'+title+'</span></div></li>';
					}
				}
			});	
			list += '</ul><div class="spacer"></div>';
			var ul = $(fieldset).append(list);
			var click_count = 0;
			$(ul[0]).children('ul.dase_search_gallery').children('li').children('div').children('input').click(function(){
				var item = json.items[$(this).parent('div').parent('li').attr('id')];
				if($(this).is(':checked')){
					$(this).parent('div').css('background-color','#009900');
					var media = '';
					var type = 'image';
					//if it has an mp3 then we only upload audio
					if(item.media.mp3){
						type = 'audio';
						media = base+item.media.mp3;
					}
					//download enclosure image
					else{
						media = base+item.media.enclosure;
					}


					inputs = '<div class="'+item._serial_number+' to_be_uploaded"><input style="display:none" name="daseclient['+type+']['+click_count+'][url]" value="'+media+'"/>';
					inputs += '<input style="display:none" name="daseclient['+type+']['+click_count+'][serial]" value="'+item._serial_number+'"/>';
					inputs += '<input style="display:none" name="daseclient['+type+']['+click_count+'][dase_url]" value="'+base+'/item/'+item._id+'"/>';
					for(var i in item.metadata){
						if( item.metadata[i].length > 1){
							for(var j in item.metadata[i]){
								if(item.metadata[i][j] != undefined){
									inputs += '<input style="display:none" name="daseclient['+type+']['+click_count+'][metadata]['+i+']['+j+']" value="'+item.metadata[i][j]+'"/>' 
								}
							}
						}
						else{
							if(item.metadata[i] != undefined){
								inputs += '<input style="display:none" name="daseclient['+type+']['+click_count+'][metadata]['+i+']" value="'+item.metadata[i]+'"/>' 
							}
						}
					}
					inputs += '</div>';
					$(fieldset).append(inputs);
					click_count += 1;
					$('#edit-download-button').show();
				}
				else{
					$('div.'+item._serial_number).remove();		
					$(this).parent('div').css('background-color','transparent');
					if(!$('input:checked').size()){
						$('#edit-download-button').hide();
					}
				}
			});
		}
		else{
			$(fieldset).append('<h1> No Results </h1>');	
		}
	};

	$('#edit-download-button').hide();

	$('#edit-search-button').click(function(){
		$('div.to_be_uploaded').remove();
		$('#edit-search-wrapper').parent('div').append('<img id="ajax_loader" src="/moore/sites/laits.utexas.edu.moore/modules/dase/custom/daseclient/images/loader.gif"/>');
		$('#edit-download-button').hide();
		$.ajax({
			type: 'GET',
			url: Drupal.settings['basePath']+'daseclient/search',
			success: showResults,
			dataType: 'json',
			data: 'term='+$('#edit-search').val()+'&col='+$('#edit-collection').val()
		});
		return false;
	});



});
