var AppPlayer=function(_id,_dentroModulo){
	$divOd=$('#'+_id);
	$btinicio=$('#'+_id).find('#btIniciaTutorial');
	$playervideo=$('#'+_id).find('#playerAntigo');
	$videotag=$('#'+_id).find('video');
	console.log("player "+$videotag.length);
	if(_dentroModulo){
		$divOd.css("position",'relative');
		$divOd.css("height",window.innerHeight + 'px');
	}
	
	function iniciaOd(_this){
		$(_this).closest('.objetoDigital').find('.telaInicio').hide();
		$(_this).closest('.objetoDigital').find('.telaMenu').show();
		$playervideo.show();
		document.getElementById(_id).getElementsByClassName("player")[0].getElementsByTagName("video")[0].play();
	}
	$btinicio.on('click', function() {
		iniciaOd(this);
	});
	/*
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
	*/

}