/*versao 9/10/2020
refacao quase total
*/
var ex_AppInfografico = function (
	_id,
	_dentroModulo,
	modoEdicao, 
	_itensTemp,
	_enunciado, 
	_idioma, 
	_sons,
	_temVideo=false) {
	var caminho = "resources/image/",
	stage,
	content,
	contentFundo,
	contenthit,
	contentBts,
	audioIngredientes,
	count = 0,
	fase = 0,
	hits = [],
	rollovers = [],
	imgcliques = [],
	inicio1 = false,
	btreseta,
	i_erros = 0,
	i_acertos = 0,
	i_total=0,
	mostraLinha = false,
	line,
	pontosNecessarios = 0,
	index,
	calculaTempo = false,
	countTempo = 0,
	rate = 0,
	sonsHits = [],
	selecionado=0,
	_itens,
	btSomFasePlay,
	btSomFasePause,
	update=true,
	tempOver,
	i_zoom,
	img_loading,
	sons=_sons,
	duracaoVideo,
	loadcount=0,
	locucao,
	classeAlt=[],
	t;

	$divOd=$('#'+_id);
	$btinicio=$('#'+_id).find('#btIniciaTutorial');
	$btprox=$('#'+_id).find('#btProximo');
	$btant=$('#'+_id).find('#btAnterior');
	$btmaiszoom=$('#'+_id).find('#btMais');
	$btmenoszoom=$('#'+_id).find('#btMenos');
	$btTutoL=$('#'+_id).find('#tutoLand');
	$btTutoP=$('#'+_id).find('#tutoPort');
	$divCanvas = $('#'+_id).find("#divCanvas");
	$canvas=$('#'+_id).find('#canvas_od');
	$caixaInfo=$('#'+_id).find('.infobox2d');
	//ClasseAlt serve para ativar as setas de prox e ant quando clica na primeira interação
	classeAlt=document.getElementsByClassName('altera');
	var videoHTMLTag = document.getElementById('videoInfografico2d');
	const caixas = Array.from($caixaInfo);

	if(_dentroModulo){
		$divOd.css("position",'relative');
		$divOd.css("height",window.innerHeight + 'px');
	}
	var orientacao;
	var widthToHeight = 16 / 9;
	var newWidth = window.innerWidth;
	var newHeight = window.innerHeight;
	var newWidthToHeight = newWidth / newHeight;
	if(newWidthToHeight<1){
		orientacao=1;
		widthToHeight = 9 / 16;
	}else{
		orientacao=0;
		widthToHeight = 16 / 9;
	}
	if (newWidthToHeight > widthToHeight) {
		newWidth = newHeight * widthToHeight;
	} else { 
		newHeight = newWidth / widthToHeight;
	}

	function iniciaTutorial(_this){
		$(_this).closest('.objetoDigital').find('.telaInicio').hide();
		$(_this).closest('.objetoDigital').find('.telaTutorial').show();
	}
	function iniciaOd(_this){
		$(_this).closest('.objetoDigital').find('.telaTutorial').hide();
		$(_this).closest('.objetoDigital').find('.telaMenu').show();
		$(_this).closest('.objetoDigital').find('#divCanvas').show();

		//Faz a verificação se existe classeAlt no arquivo, se não segue o padrão normal
		if(classeAlt.length<=0){
			$btprox.show();
			$btant.show();
		}

		$btmaiszoom.show();
		$btmenoszoom.show();
		inicio1 = true;
		loadcount=_itensTemp[fase][10].length;
		console.log("loadcount "+loadcount);
		montaFase();
		if (typeof _enunciado !== 'undefined') {
			var enun = new Audio(caminho + _enunciado);
			enun.play();

		}
	}
	$btinicio.on('click', function() {
		iniciaTutorial(this);
	});
	$btTutoP.on('click', function() {
		iniciaOd(this);
	});
	$btTutoL.on('click', function() {
		iniciaOd(this);
	});	
	$btprox.on('click', function() {
		if(imgcliques[selecionado]){
			imgcliques[selecionado].visible=false;
		}
		$caixaAtual = $(caixas[selecionado]);
		$caixaAtual.hide();
		if(selecionado<_itensTemp[fase][10].length-1){
			selecionado++;
		}
		$caixaAtual = $(caixas[selecionado]);
		$caixaAtual.show();
		daZoom();
		//da play no som clicando nas setas
		if(_itensTemp[fase][10][imgcliques[selecionado].id].som){
			locucao.pause();
			locucao=new Audio(caminho+_itensTemp[fase][10][imgcliques[selecionado].id].som);
			locucao.play();
		}
	});	
	$btant.on('click', function() {
		if(imgcliques[selecionado]){
			imgcliques[selecionado].visible=false;
		}
		$caixaAtual = $(caixas[selecionado]);
		$caixaAtual.hide();
		console.log(selecionado);
		if(selecionado>0){
			selecionado--;
		}
		$caixaAtual = $(caixas[selecionado]);
		$caixaAtual.show();
		daZoom();
		//da play no som clicando nas setas
		if(_itensTemp[fase][10][imgcliques[selecionado].id].som){
			locucao.pause();
			locucao=new Audio(caminho+_itensTemp[fase][10][imgcliques[selecionado].id].som);
			locucao.play();
		}
	});	
	$btmaiszoom.on('click', function() {
		if(i_zoom<5){
			i_zoom+=0.2;	
		}
		zoomSimples();
	});
	$btmenoszoom.on('click', function() {
		if(imgcliques[selecionado]){
			imgcliques[selecionado].visible=false;
		}
		$caixaAtual = $(caixas[selecionado]);
		$caixaAtual.hide();
		contentBts.alpha=1;
		offsetX=$canvas.get(0).width/2;
		offsetY=$canvas.get(0).height/2;
		if((i_zoom/2)>0){
			i_zoom=i_zoom/2;	
		}
		zoomSimples();
	});




	window.addEventListener('resize', resizeGame, false);
	window.addEventListener('orientationchange', resizeGame, false);
	if(_temVideo){
		videoHTMLTag.addEventListener('loadeddata', function() {
			duracaoVideo=videoHTMLTag.duration;
			console.log(videoHTMLTag.duration);
		}, false);
		videoHTMLTag.onended = function() {
			
		};
		videoHTMLTag.addEventListener('timeupdate', function () {
			if(duracaoVideo>0){
				if(videoHTMLTag.currentTime>(duracaoVideo-0.5)){
					videoHTMLTag.currentTime=0;
					videoHTMLTag.play();
				}
			}

		}, false);
	}

	for (index in sons) {
		t = sons[index];
		sons[index] = new Audio(caminho + t);
	}

	stage = new createjs.Stage($canvas.get(0));
	stage.enableMouseOver();
	stage.mouseMoveOutside = true;
	createjs.Touch.enable(stage);
	contenthit = new createjs.Container();
	contentBts = new createjs.Container();
	contentFundo = new createjs.Container();
	content = new createjs.Container();

	var imgFundo;

	stage.canvas.width = window.innerWidth;
	stage.canvas.height = window.innerHeight;

	var tamanhoTela = [window.innerWidth,window.innerHeight];
	var tamX;
	var tamY;

	var offsetX=$canvas.get(0).width/2;
	var offsetY=$canvas.get(0).height/2;

	stage.addChild(content);
	content.addChild(contentFundo);

	stage.addChild(contenthit);
	content.addChild(contentBts);
	stage.addChild(content);

	fase = 0;
	_itens = _itensTemp[fase][10];


	
	createjs.Ticker.setFPS(30);
	createjs.Ticker.on("tick", ticker);


	function resizeGame() {
		stage.canvas.width = window.innerWidth;
		stage.canvas.height = window.innerHeight;
		content.x=$canvas.get(0).width/2;
		content.y=$canvas.get(0).height/2;
	}
	function zoomSimples(){
		createjs.Tween.get(content).to({ x:offsetX,y:offsetY, scaleX:i_zoom,scaleY:i_zoom}, 500, createjs.Ease.quadOut);
	}
	function daZoom(){
		for(var i=0;i<imgcliques.length;i++){
			if(imgcliques[i]){
				imgcliques[i].visible=false;
			}
		}

		i_zoom=rollovers[selecionado].zoom[2];
		offsetX=$canvas.get(0).width/2+(tamX/2-rollovers[selecionado].zoom[0])*rollovers[selecionado].zoom[2];
		offsetY=$canvas.get(0).height/2+(tamY/2-rollovers[selecionado].zoom[1])*rollovers[selecionado].zoom[2];
		createjs.Tween.get(content).to({ x:offsetX,y:offsetY,scaleX:rollovers[selecionado].zoom[2],scaleY:rollovers[selecionado].zoom[2] }, 500, createjs.Ease.quadOut);
		if(imgcliques[selecionado]){
			imgcliques[selecionado].visible=true;
			imgcliques[selecionado].alpha=0;
			createjs.Tween.get(imgcliques[selecionado],{override:true}).wait(200).to({ alpha:1 }, 500, createjs.Ease.quadOut);
		}
	}
	function montaFase(_orientacao=orientacao) {
		inicio1 = true;
		contenthit.removeAllChildren();
		contentBts.removeAllChildren();
		contentFundo.removeAllChildren();

		img_loading = new createjs.Bitmap(caminho+"loading.png");
		contentFundo.addChild(img_loading);
		img_loading.regX=128;
		img_loading.regY=128;
		img_loading.scaleX=0.5;
		img_loading.scaleY=0.5;
		img_loading.x=$canvas.get(0).width/2;
		img_loading.y=$canvas.get(0).height/2;

		var extensao=_itensTemp[fase][0][0].split('.')[1];
		if(extensao=="mp4"){
			videoHTMLTag.play();
			var bmp = new createjs.Bitmap(videoHTMLTag);
			contentFundo.addChild (bmp);
			tamY=videoHTMLTag.videoHeight;
			tamX=videoHTMLTag.videoWidth;
			trataImagem(bmp);

		}else{
			/* se não tiver imagem pra portrait ignora*/
			if(_itensTemp[fase][0][1]){
				imgFundo = new createjs.Bitmap(caminho+_itensTemp[fase][0][_orientacao]);
			}else{
				imgFundo = new createjs.Bitmap(caminho+_itensTemp[fase][0][0]);
			}
			imgFundo.image.onload = function(){
				contentFundo.addChild(imgFundo);
				tamX=imgFundo.getBounds().width;
				tamY=imgFundo.getBounds().height;
				imgFundo.alpha=0;
				createjs.Tween.get(imgFundo,{override:true}).to({ alpha:1 }, 1500, createjs.Ease.quadOut);
				trataImagem(imgFundo);
				contentFundo.removeChild(img_loading);
			}

		}
		function trataImagem(_img){
			content.regX=tamX/2;
			content.regY=tamY/2;
			i_zoom=_itensTemp[fase][0][2][_orientacao];
			content.scaleX=i_zoom;
			content.scaleY=i_zoom;
			content.x=$canvas.get(0).width/2;
			content.y=$canvas.get(0).height/2;
			_img.on("mousedown", function (evt) {
				evt.target.cursor = "grabbing";
				var global = stage.localToGlobal(content.x, content.y);
				content.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
			});
			_img.on("pressmove", function (evt) {
				var local = stage.globalToLocal(evt.stageX + content.offset.x, evt.stageY + content.offset.y);
				content.x = Math.floor(local.x);
				content.y = Math.floor(local.y);
				console.log(content.x+","+content.y);
			});			
			_img.on("mouseover", function (evt) {
				evt.target.cursor = "grab";
			});

			var i;
			for (i = 0; i < _itensTemp[fase][10].length; i++) {
				if(_itensTemp[fase][10][i].imgClique){
					imgcliques[i] = new createjs.Bitmap(caminho +_itensTemp[fase][10][i].imgClique);
					imgcliques[i].x = _itensTemp[fase][10][i].posicaoClique[0];
					imgcliques[i].y = _itensTemp[fase][10][i].posicaoClique[1];
					imgcliques[i].alpha = 0;
					imgcliques[i].id=i;
					console.log(caminho +_itensTemp[fase][10][i].imgClique);
					contentBts.addChild(imgcliques[i]);
				}else{
					imgcliques[i]=null;
				}
				rollovers[i] = new createjs.Bitmap(caminho +_itensTemp[fase][10][i].rollOver);
				rollovers[i].x = _itensTemp[fase][10][i].posicao[0];
				rollovers[i].y = _itensTemp[fase][10][i].posicao[1];
				rollovers[i].scaleX=_itensTemp[fase][10][i].posicao[2];
				rollovers[i].scaleY=_itensTemp[fase][10][i].posicao[2];
				rollovers[i].posicao=_itensTemp[fase][10][i].posicao;
				rollovers[i].zoom=_itensTemp[fase][10][i].zoom;
				rollovers[i].id=i;
				rollovers[i].alpha=0;
				createjs.Tween.get(rollovers[i],{override:true}).wait(i*100).to({ alpha:1 }, 500, createjs.Ease.quadOut);
				contentBts.addChild(rollovers[i]);


				rollovers[i].image.onload =  (function (count,obj) {
					return function (e) {
						console.log(rollovers[count].getBounds().width);
						var tamXb=rollovers[count].getBounds().width;
						var tamYb=rollovers[count].getBounds().height;
						rollovers[count].regX=tamXb/2;
						rollovers[count].regY=tamYb/2;
					}
				})(i);



				rollovers[i].on('mouseover', function() {
					createjs.Tween.get(this,{override:true}).to({ scaleX:this.posicao[2]*1.2,scaleY:this.posicao[2]*1.2,alpha:0.2 }, 250, createjs.Ease.backOut);


				});
				rollovers[i].on('mouseout', function() {
					createjs.Tween.get(this,{override:true}).to({ scaleX:this.posicao[2],scaleY:this.posicao[2],alpha:1 }, 250, createjs.Ease.backOut);

				});
				if (modoEdicao) {
					if(_itensTemp[fase][10][i].imgClique){
						imgcliques[i].alpha = 0.7;
						imgcliques[i].on("mousedown", function (evt) {
							var global = content.localToGlobal(this.x, this.y);
							this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
						});
						imgcliques[i].on("pressmove", function (evt) {
							var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
							this.x = Math.floor(local.x);
							this.y = Math.floor(local.y);
						});					
						imgcliques[i].on("pressup", function (evt) {
							_itensTemp[fase][10][this.id].posicaoClique[0] = this.x;
							_itensTemp[fase][10][this.id].posicaoClique[1] = this.y;
							criaDebug();
						});
					}
					rollovers[i].on("mousedown", function (evt) {
						var global = content.localToGlobal(this.x, this.y);
						this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
						this.regX = this.getBounds().width / 2;
						this.regY = this.getBounds().height / 2;
						selecionado = this;
					});
					rollovers[i].on("pressmove", function (evt) {
						var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
						this.x = Math.floor(local.x);
						this.y = Math.floor(local.y);
					});					
					rollovers[i].on("mouseover", function (evt) {
						console.log(this.id);
					});
					rollovers[i].on("pressup", function (evt) {
						_itensTemp[fase][10][this.id].posicao[0] = this.x;
						_itensTemp[fase][10][this.id].posicao[1] = this.y;
						_itensTemp[fase][10][this.id].zoom[0] = this.x;
						_itensTemp[fase][10][this.id].zoom[1] = this.y;
						criaDebug();
						console.log(this.id);
					});



				}else{
					rollovers[i].on("click", function () {
						
						if(locucao){
							locucao.pause();
						}
						if(_itensTemp[fase][10][this.id].som){
							locucao=new Audio(caminho+_itensTemp[fase][10][this.id].som);
							locucao.play();
						}

						//liga o btProx e btAnt quando clicado no primeiro seletor
						if(classeAlt.length>0){
							$btprox.show();
							$btant.show();
						}



						$caixaAtual = $(caixas[selecionado]);
						$caixaAtual.hide();
						selecionado=this.id;
						$caixaAtual = $(caixas[selecionado]);
						$caixaAtual.show();
						daZoom();
					});
				}
			}
		}


	}


	function criaDebug() {
		var myJSON = JSON.stringify(_itensTemp,null,0);

		console.clear();
		console.log(myJSON);
	}


	function ticker(event) {
		if(update){
			stage.update();

		}
	}
	function detectKeys() {
	}
	document.addEventListener("keydown", function (e) {
		console.log(e.keyCode);
		if (selecionado) {
			if (e.keyCode == 39) {
				selecionado.x += 1;
			}
			if (e.keyCode == 40) {
				selecionado.y += 1;
			}
			if (e.keyCode == 37) {
				selecionado.x -= 1;
			}
			if (e.keyCode == 38) {
				selecionado.y -= 1;
			}
		}

	});
}