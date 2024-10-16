
$(window).load(function(){
	resize();
	$(window).resize(function(){
		resize();
	})
	$('#stage').fadeIn(300);

	
	abertura();
	$('#creditoObj .bt_CredObj').off().on('click', function(){
		$('#creditoObj').toggleClass('open');
	})
})

function abertura(){
	player();
	
	if($('#creditoObj').hasClass('open')){
		$('#creditoObj').removeClass('open')
	}
	
	$('.btInit').off().on('click', function(){
		$('#abertura').fadeOut();
		$('#creditoObj ').removeClass('open').hide();
		mapa();
	})
	// .trigger('click');
}	

function mapa(){


	$('#mapa').fadeIn();
	
	
	$('.btInfo').off().on('click',function(){
		$info = $(this).attr('data-info');
		
		info();
		
	})
	
	$('.link').off().on('click',function(){
		$info = $(this).attr('data-info');
		info();
	})
	
	$('.btSalvar').off().on('click',function(){
		download();
	})
}



function info(){
	$('#info').fadeIn();
	$('.pop').not('.pop.'+$info).fadeOut();
	$('.pop.'+$info).fadeIn();
	
	$('#anotacao').val('');
	
	$('#info .pop .videoClero video')[0].currentTime = 0;
	$('#info .faixaEstudos').removeClass('on');
	$('#info .faixaIgual').hide();
	
	$('.btX').off().on('click',function(){
		$('#info').fadeOut();
		$('#info .pop').fadeOut();
		$('#info .pop .videoClero video')[0].pause();
	})
	
	$('#info .igual .linkF').off().on('click',function(){
		$('#info .faixaIgual').slideDown();
	})
	
	$('#info .faixaIgual .btX').off().on('click',function(){
		$('#info .faixaIgual').slideUp();
	})
	$('#info .faixaIgual .linkE').off().on('click',function(){
		$('#info .faixaEstudos').addClass('on');
	})
	$('#info .faixaEstudos .btX').off().on('click',function(){
		$('#info .faixaEstudos').removeClass('on');
	})
	
	$('#info .btEscrever').off().on('click',function(){
		$info = 'anotacoes';
		info();
	})
	
}
function download() {
	var text = $('#anotacao').val();
	var file = new Blob([text], {type: 'text/plain'});
	$('#download').attr("download", "a_ilha_utopia.txt").attr("href", URL.createObjectURL(file));
	$('#download')[0].click();
}


function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};



function resize(){
	var sW = $(window).width();
	var sH = $(window).height();
	w = sW/1024;
	h = sH/768;

	if(h > w){
		$scale = w;
	}else{
		$scale = h;
	}


	// if($scale > 1){
		// $scale = 1;
	// }

	$('#stage').css('transform','scale('+$scale+' , '+$scale+')');
	$('#stage').css('transform-origin','50% 50%');


}

function player(){

	mejs.i18n.language('pt-BR');

	var mediaElements = document.querySelectorAll('video'), i, total = mediaElements.length;

	for (i = 0; i < total; i++) {
		new MediaElementPlayer(mediaElements[i], {
			stretching: 'auto',
			success: function (media) {

				media.addEventListener('loadedmetadata', function () {
					var src = media.originalNode.getAttribute('src').replace('&amp;', '&');
					if (src !== null && src !== undefined) {
						//SUCESS
					}
				});

				media.addEventListener('error', function (e) {
					//ERROR
				});
				media.addEventListener('ended', function (e) {
					// $('.mejs__poster').show();
				});
			}
		});
	}

}


function replayTrilha(){
	playAudio('trilha','Rodeo_Show',replayTrilha);
}

function playAudio(tag,nome,callback){
	var audio = document.getElementById(tag);
	audio.src = 'audios/'+nome+'.mp3';
	
	$(audio).off();
	if(nome == 'abertura'){
		$(audio).on('timeupdate',function(){
			legendaAbre($(this)[0].currentTime);
			
			if($(this)[0].currentTime < ($(this)[0].duration-0.5)){
				$('.bigode').css('background-position-x',(-615*randomNumber(0,5))+'px')
			}else{
				$('.bigode').css('background-position-x','0px')
			}
		})
	}
	
	$(audio).unbind('ended');
	if(callback){
		$(audio).bind('ended',callback);
	}else{
		$(audio).bind('ended', function(){audio.src = 'audios/mute.mp3';});
	}
	audio.play();
	
}

