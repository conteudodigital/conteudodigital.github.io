var AppPlayer=function(_id,_dentroModulo){
	$divOd=$('#'+_id);
	$btinicio=$('#'+_id).find('#btIniciaTutorial');
	$ply=$('#'+_id).find('#plVideo');
	$plyVimeo=$('#'+_id).find('#plVideoVimeo');
	$playervideo=$('#'+_id).find('#playerVideo');
	$playervideoVimeo=$('#'+_id).find('#player');
	if(_dentroModulo){
		$divOd.css("position",'relative');
		$divOd.css("height",window.innerHeight + 'px');
	}
	
	if(aplicativoOnline){
		retornaOrientacaoVideo($playervideoVimeo);
	}else{
		retornaOrientacaoVideo($playervideo);
	}
	function iniciaOd(_this){
		$(_this).closest('.objetoDigital').find('.telaInicio').hide();
		$(_this).closest('.objetoDigital').find('.telaMenu').show();
		if(aplicativoOnline){
	console.log("aplicativo online"+aplicativoOnline);
			$plyVimeo.show();
		}else{
			$ply.show();
			$playervideo.get(0).play();
		}
	}
	$btinicio.on('click', function() {
		iniciaOd(this);
	});
	window.addEventListener('resize', function(){
		if(aplicativoOnline){
			retornaOrientacaoVideo($playervideoVimeo);
		}else{
			retornaOrientacaoVideo($playervideo);
		}
		setTimeout(function(){
			console.log("funcao resize");
		},500);
	});

}