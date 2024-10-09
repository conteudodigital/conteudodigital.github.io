/*versao 9/10/2020
refacao quase total
*/
var ex_AppOrdenarObjetos = function (
	_id,
	_dentroModulo,
	modoEdicao, 
	_itensTemp,
	_errosPermitidos, 
	_contaTempo,
	_enunciado, 
	_idioma, 
	_colisaoBox,
	_rollOverHit,
	_sons,
	_icones,
	_responsivo) {
	var caminho = "resources/image/",
	stage,
	content,
	contentFundo,
	contenthit,
	contentFixado,
	audioIngredientes,
	count = 0,
	fase = 0,
	hits = [],
	btsPlayPausePerguntas = [],
	btsPlayPauseHits = [],
	figuras = [],
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
	selecionado,
	_itens,
	btSomFasePlay,
	btSomFasePause,
	update=true,
	tempOver,
	necessitaConclusao,
	sons=_sons,
	t;

	fase = 0;
	_itens = _itensTemp[fase][10];
	necessitaConclusao = _itensTemp[fase][6];
	console.log('necessitaConclusao '+necessitaConclusao);

	$divOd=$('#'+_id);
	$btinicio=$('#'+_id).find('#btIniciaTutorial');
	$btScroll=$('#'+_id).find('#iconeAnimadoScroll1');
	$btConcluir=$('#'+_id).find('#btConcluir');
	$btTutoL=$('#'+_id).find('#tutoLand');
	$btTutoP=$('#'+_id).find('#tutoPort');
	$divFps = $('#'+_id).find("#fps");
	$divCanvas = $('#'+_id).find("#divCanvas");
	$canvas=$('#'+_id).find('#canvas_od');
	$divTempo=$('#'+_id).find('#tempo');
	$divGuiFinal=$('#'+_id).find('#guiFinal');
	$btReload=$('#'+_id).find('#btReload');
	var $labelAcerto=$('#'+_id).find('#labelAcerto');
	var $labelErros=$('#'+_id).find('#labelErros');
	$progressoradial=$('#'+_id).find('#progressoradial');
	$btScroll.hide();
	var ctx = $progressoradial[0].getContext('2d');
	var firstProgressBar = new RadialBar(ctx, {
		x: 250,
		y: 250,
		angle: 250,
		radius: 125,
		lineWidth: 40,
		lineFill: '#FF6000',
		backLineFill: '#C7C7C7',
		bgFill: '#F2F2F2',
		isShowInfoText: true,
		infoStyle: '60px Arial'
	});

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
		if(_responsivo){
			trocaOrientacaoPortrait();
		}else{
			orientacao=0;
			widthToHeight = 16 / 9;
		}

	}else{
		orientacao=0;
		widthToHeight = 16 / 9;
		if(_responsivo){
			trocaOrientacaoLandscape();
		}
	}
	if (newWidthToHeight > widthToHeight) {
		newWidth = newHeight * widthToHeight;
		$divCanvas.css("width",newWidth + 'px');
		$divCanvas.css("height",newHeight + 'px');
	} else { 
		newHeight = newWidth / widthToHeight;
		$divCanvas.css("width",newWidth + 'px');
		$divCanvas.css("height",newHeight + 'px');
	}
	$divCanvas.css("marginLeft",(window.innerWidth-newWidth)/2 + 'px');
	$divCanvas.css("marginTop", (window.innerHeight-newHeight)/2 + 'px');

	function trocaOrientacaoPortrait(){
		$canvas.get(0).width = 720;
		$canvas.get(0).height = 1280;
		if(inicio1){
			montaFase(1);

		}
	}
	function trocaOrientacaoLandscape(){
		$canvas.get(0).width = 1280;
		$canvas.get(0).height = 720;
		if(inicio1){
			montaFase(0);

		}
	}
	function resizeGame() {
		newWidth = window.innerWidth;
		newHeight = window.innerHeight;
		
		newWidthToHeight = newWidth / newHeight;

		if(_responsivo){
			if(newWidthToHeight<1){
				if(orientacao==0){
					widthToHeight = 9 / 16;
					
					trocaOrientacaoPortrait();
					
				}
				orientacao=1;
			}else{
				if(orientacao==1){
					widthToHeight = 16 / 9;
					
					trocaOrientacaoLandscape();
					
				}
				orientacao=0;
			}
			if (newWidthToHeight > widthToHeight) {
				newWidth = newHeight * widthToHeight;
				$divCanvas.css("width",newWidth + 'px');
				$divCanvas.css("height",'100%');
			} else {
				newHeight = newWidth / widthToHeight;
				$divCanvas.css("width",'100%');
				$divCanvas.css("height",'auto');
			}
			$divCanvas.css("marginLeft",(window.innerWidth-newWidth)/2 + 'px');
			$divCanvas.css("marginTop", (window.innerHeight-newHeight)/2 + 'px');
		}else{
			if (newWidthToHeight > widthToHeight) {
				newWidth = newHeight * widthToHeight;
				$divCanvas.css("marginLeft",(window.innerWidth-newWidth)/2 + 'px');
				$divCanvas.css("marginTop", (window.innerHeight-newHeight)/2 + 'px');
			} else { 
				newHeight = newWidth / widthToHeight;
				$divCanvas.css("marginLeft",(window.innerWidth-newWidth)/2 + 'px');
				$divCanvas.css("marginTop", (window.innerHeight-newHeight)/2 + 'px');
			}
			$divCanvas.css("width",newWidth + 'px');
			$divCanvas.css("height",newHeight + 'px');
		}

	}
	function iniciaTutorial(_this){
		
		$(_this).closest('.objetoDigital').find('.telaInicio').hide();
		$(_this).closest('.objetoDigital').find('.telaTutorial').show();
	}
	function iniciaOd(_this){
		
		$(_this).closest('.objetoDigital').find('.telaTutorial').hide();
		$(_this).closest('.objetoDigital').find('.telaMenu').show();
		$(_this).closest('.objetoDigital').find('#divCanvas').show();
		if(_dentroModulo){
			//$btScroll.show();
		}

		inicio1 = true;
		montaFase();
		criaRelogio();
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
	$btConcluir.on('click', function() {
		confereAcertos();
	});

	window.addEventListener('resize', resizeGame, false);
	window.addEventListener('orientationchange', resizeGame, false);




	for (index in sons) {
		t = sons[index];
		sons[index] = new Audio(caminho + t);
	}

	stage = new createjs.Stage($canvas.get(0));
	stage.enableMouseOver();
	stage.mouseMoveOutside = true;
	createjs.Touch.enable(stage);
	contenthit = new createjs.Container();
	contentFixado = new createjs.Container();
	contentFundo = new createjs.Container();
	content = new createjs.Container();

	console.log($canvas.get(0).width);

	stage.addChild(contentFundo);

	stage.addChild(contenthit);
	stage.addChild(contentFixado);
	stage.addChild(content);



	if (modoEdicao) {
		var imgEditMode = new createjs.Bitmap(caminho + "modoEdicao.png");
		imgEditMode.image.onload = function () { };
		stage.addChild(imgEditMode);
		setInterval(function () { stage.removeChild(imgEditMode); }, 3000);

		var bt1 = new createjs.Bitmap(caminho + "modoEdicao_bt1.png");
		bt1.image.onload = function () { };
		stage.addChild(bt1);
		bt1.on("click", function () {
			if (fase > 0) {
				fase--;
				count = 0;
				_itens = _itensTemp[fase][10];
				montaFase();
			}
		});

		var bt2 = new createjs.Bitmap(caminho + "modoEdicao_bt2.png");
		bt2.image.onload = function () { };
		stage.addChild(bt2);
		bt2.x = 1180;
		bt2.on("click", function () {
			if (fase < _itensTemp.length - 1) {
				fase++;
				count = 0;
				_itens = _itensTemp[fase][10];
				montaFase();
			}
		});
	}

	createjs.Ticker.setFPS(30);
	createjs.Ticker.on("tick", ticker);

	function criaRelogio() {

		if (_contaTempo[0]) {
			$divTempo.show();
			countTempo = _contaTempo[1];
			$divTempo.html(countTempo + "s");
			calculaTempo = true;
		}

	}

	function montaFase(_orientacao=orientacao) {
		if(isNaN(_orientacao)){
			_orientacao=orientacao;
		}
		inicio1 = true;
		content.removeAllChildren();
		contenthit.removeAllChildren();
		contentFixado.removeAllChildren();
		contentFundo.removeAllChildren();
		if(_itensTemp[fase][0]){
			var fundo = new createjs.Bitmap(caminho + _itensTemp[fase][0][_orientacao]);
			fundo.image.onload = function () { };
			fundo.alpha = 0;
			contentFundo.addChild(fundo);
			createjs.Tween.get(fundo).to({ alpha: 1 }, 1000);
			if(_itens==null){
				/*se itens for vazio pula pra proxima fase*/
				console.log("tela feedback");
				fundo.on("mousedown", function (evt) {

					proximaFase(false);
				});

			}
		}

		if (_itensTemp[fase][1][0]) {
			/*monta botao de som no inicio da fase*/
			btSomFasePlay = new createjs.Bitmap(caminho + _itensTemp[fase][1][1]);
			btSomFasePlay.image.onload = function () { };
			contenthit.addChild(btSomFasePlay);
			btSomFasePlay.x = -500;
			btSomFasePlay.y = _itensTemp[fase][1][5];
			btSomFasePlay.visible = true;
			createjs.Tween.get(btSomFasePlay).to({ x: _itensTemp[fase][1][4] }, 550, createjs.Ease.backOut);

			btSomFasePause = new createjs.Bitmap(caminho + _itensTemp[fase][1][2]);
			btSomFasePause.image.onload = function () { };
			contenthit.addChild(btSomFasePause);
			btSomFasePause.x = -500;
			btSomFasePause.y = _itensTemp[fase][1][5];
			btSomFasePause.visible = false;
			createjs.Tween.get(btSomFasePause).to({ x: _itensTemp[fase][1][4] }, 550, createjs.Ease.backOut);



			btSomFasePlay.on("mousedown", function (evt) {
				tocaSom(fase, true);
				this.visible = false;
				btSomFasePause.visible = true;

			});
			btSomFasePause.on("mousedown", function (evt) {
				paraTodosSons();
				this.visible = false;
				btSomFasePlay.visible = true;
			});
			if (fase > 0) {
				tocaSom(fase, true);
				btSomFasePlay.visible = false;
				btSomFasePause.visible = true;
			}
		}


		pontosNecessarios = 0;
		hits = [];
		figuras = [];
		var i;
		if(_itens!=null){
			for (i = 0; i < _itens.length; i++) {
				if (_itensTemp[fase][4]) {
					pontosNecessarios = _itensTemp[fase][4];
				} else {
					if (_itens[i].respondivel) {
						pontosNecessarios++;
					}
				}
				var hit;
				if(_itens[i].resposta){
					hit = new createjs.Bitmap(caminho + _itens[i].resposta);
					hit.image.onload = function () { };
					contenthit.addChild(hit);
					hit.x = _itens[i].posicaoResposta[0+(_orientacao*2)];
					hit.y = _itens[i].posicaoResposta[1+(_orientacao*2)];
					hit.nome = _itens[i].resposta;
					hit.id = i;
					hit.cursor = "pointer";
					hit.pode = true;
					if (_itensTemp[fase][5]) {
						hit.visible = false;
					}
					hit.rotation = _itens[i].posicaoResposta[4];
					hit.on('mouseover', function() {
						if(_rollOverHit){
							var tname=_itens[this.id].resposta;
							tname=tname.substring(0,tname.length-4);
							tempOver = new createjs.Bitmap(caminho + tname+"_over.png");
							tempOver.image.onload = function () { };
							tempOver.x = _itens[this.id].posicaoResposta[0];
							tempOver.y = _itens[this.id].posicaoResposta[1];
							tempOver.regX = _itens[this.id].tamanhoResposta[0] / 2;
							tempOver.regY = _itens[this.id].tamanhoResposta[1] / 2;
							contenthit.addChild(tempOver);
						}

					});
					hit.on('mouseout', function() {
						if(_rollOverHit){
							contenthit.removeChild(tempOver);
						}

					});

					hit.regX = _itens[i].tamanhoResposta[0] / 2;
					hit.regY = _itens[i].tamanhoResposta[1] / 2;

					if (_itens[i].somResposta != null) {
						/*som nos hits e bts*/
						btsPlayPauseHits[i] = new createjs.Bitmap(caminho + _itens[i].somResposta[1]);
						btsPlayPauseHits[i].image.onload = function () { };
						contenthit.addChild(btsPlayPauseHits[i]);
						btsPlayPauseHits[i].x = _itens[i].posicaoResposta[0+(_orientacao*2)]+_itens[i].somResposta[4];
						btsPlayPauseHits[i].y = _itens[i].posicaoResposta[1+(_orientacao*2)]+_itens[i].somResposta[5];
						btsPlayPauseHits[i].id = i;
						btsPlayPauseHits[i].modo = 0;

						btsPlayPauseHits[i].on("mousedown", function (evt) {
							if(this.modo==0){
								var trocaimg = new Image();
								trocaimg.src = caminho+_itens[this.id].somResposta[2];
								this.image=trocaimg;
								tocaSomRetorno(this, true,caminho+_itens[this.id].somResposta[3]);
								this.modo=1;

							}else{
								var trocaimg = new Image();
								trocaimg.src = caminho+_itens[this.id].somResposta[1];
								this.image=trocaimg;
								tocaSomRetorno(this, false,caminho+_itens[this.id].somResposta[3]);
								this.modo=0;
							}

						});

					}else{
						btsPlayPauseHits[i]=false;
					}
				}else{
					/*se o botao nao é arrastavel adiciona um elemento vazio pra nao quebrar a contagem*/
					hit=null;
				}
				hits.push(hit);


				if (modoEdicao) {
					hit.visible = true;
					hit.alpha = 0.2;
					if (_itens[i].respondivel) {
						/*verifica se tem resposta senao nao faz o objeto nao ser arrastado*/
						if (_itens[i].resposta) {
							hit.on("mousedown", function (evt) {
								this.parent.addChild(this);
								var global = content.localToGlobal(this.x, this.y);
								this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
								this.regX = this.getBounds().width / 2;
								this.regY = this.getBounds().height / 2;
								criaLinha(this, figuras[this.id]);
								selecionado = this;
							});
							hit.on("pressmove", function (evt) {
								var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
								this.x = Math.floor(local.x);
								this.y = Math.floor(local.y);
								if(btsPlayPauseHits[this.id]){
									btsPlayPauseHits[this.id].x=this.x+_itens[this.id].somResposta[4];
									btsPlayPauseHits[this.id].y=this.y+_itens[this.id].somResposta[5];
								}
								criaLinha(this, figuras[this.id]);
							});
							hit.on("pressup", function (evt) {
								_itensTemp[fase][10][this.id].posicaoResposta[0+(_orientacao*2)] = this.x;
								_itensTemp[fase][10][this.id].posicaoResposta[1+(_orientacao*2)] = this.y;
								_itensTemp[fase][10][this.id].tamanhoResposta[0+(_orientacao*2)] = this.getBounds().width;
								_itensTemp[fase][10][this.id].tamanhoResposta[1+(_orientacao*2)] = this.getBounds().height;
								criaDebug();
							});

						}
					}
				}
			}

			for (i = 0; i < _itens.length; i++) {
				if(_itens[i].perguntaParada){
					figuras[i] = new createjs.Bitmap(caminho + _itens[i].perguntaParada);
					figuras[i].perguntaParada = true;
					figuras[i].nome = _itens[i].perguntaParada;
				}else{
					figuras[i] = new createjs.Bitmap(caminho + _itens[i].pergunta);
					figuras[i].perguntaParada = false;
					figuras[i].nome = _itens[i].pergunta;
				}

				figuras[i].image.onload = function () { };
				content.addChild(figuras[i]);
				figuras[i].cursor = "pointer";
				figuras[i].x = _itens[i].posicaoPergunta[0+(_orientacao*2)];
				figuras[i].y = _itens[i].posicaoPergunta[1+(_orientacao*2)];
				figuras[i].scaleX = figuras[i].scaleY=0.01;
				createjs.Tween.get(figuras[i]).to({ scaleX: 1, scaleY: 1 }, 500 + i * 80, createjs.Ease.backOut);
				figuras[i].px = _itens[i].posicaoPergunta[0+(_orientacao*2)];
				figuras[i].py = _itens[i].posicaoPergunta[1+(_orientacao*2)];
				figuras[i].id = i;
				figuras[i].pode = _itens[i].respondivel;
				figuras[i].respondivel = _itens[i].respondivel;
				figuras[i].arrastavel = false;
				figuras[i].resposta = _itens[i].resposta;
				figuras[i].regX = _itens[i].tamanhoPergunta[0] / 2;
				figuras[i].regY = _itens[i].tamanhoPergunta[1] / 2;
				if(_itens[i].respondivel){
					i_total++;
				}

				/*verifica se tem resposta senao nao faz o objeto nao ser arrastado*/

				figuras[i].arrastavel = true;
				if (_itens[i].somPergunta != null) {
					/*som nos hits e bts*/
					btsPlayPausePerguntas[i] = new createjs.Bitmap(caminho + _itens[i].somPergunta[1]);
					btsPlayPausePerguntas[i].image.onload = function () { };
					content.addChild(btsPlayPausePerguntas[i]);
					btsPlayPausePerguntas[i].x = _itens[i].posicaoPergunta[0+(_orientacao*2)]+_itens[i].somPergunta[4];
					btsPlayPausePerguntas[i].y = _itens[i].posicaoPergunta[1+(_orientacao*2)]+_itens[i].somPergunta[5];
					btsPlayPausePerguntas[i].id = i;
					btsPlayPausePerguntas[i].modo = 0;
					console.log("toca som:"+_itens[i].somPergunta[2]);

					btsPlayPausePerguntas[i].on("mousedown", function (evt) {
						if(this.modo==0){
							var trocaimg = new Image();
							trocaimg.src = caminho+_itens[this.id].somPergunta[2];
							this.image=trocaimg;
							tocaSomRetorno(this, true,caminho+_itens[this.id].somPergunta[3]);
							this.modo=1;

						}else{
							var trocaimg = new Image();
							trocaimg.src = caminho+_itens[this.id].somPergunta[1];
							this.image=trocaimg;
							tocaSomRetorno(this, false,caminho+_itens[this.id].somPergunta[3]);
							this.modo=0;
						}

					});

				}else{
					btsPlayPausePerguntas[i]=false;
				}

				if (modoEdicao) {
					figuras[i].on("mousedown", function (evt) {
						this.parent.addChild(this);
						var global = content.localToGlobal(this.x, this.y);
						this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
						this.regX = this.getBounds().width / 2;
						this.regY = this.getBounds().height / 2;
						if (this.pode) {

							criaLinha(this, hits[this.id]);

						}
						selecionado = this;
					});
					figuras[i].on("pressmove", function (evt) {
						var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
						this.x = Math.floor(local.x);
						this.y = Math.floor(local.y);
						if(btsPlayPausePerguntas[this.id]){
							btsPlayPausePerguntas[this.id].x=this.x+_itens[this.id].somPergunta[4];
							btsPlayPausePerguntas[this.id].y=this.y+_itens[this.id].somPergunta[5];
						}
						if (this.pode) {
							criaLinha(this, hits[this.id]);

						}
					});
					figuras[i].on("pressup", function (evt) {
						_itensTemp[fase][10][this.id].posicaoPergunta[0+(_orientacao*2)] = this.x;
						_itensTemp[fase][10][this.id].posicaoPergunta[1+(_orientacao*2)] = this.y;
						_itensTemp[fase][10][this.id].tamanhoPergunta[0+(_orientacao*2)] = this.getBounds().width;
						_itensTemp[fase][10][this.id].tamanhoPergunta[1+(_orientacao*2)] = this.getBounds().height;
						criaDebug();
					});
				} else {
					figuras[i].on("mousedown", function (evt) {
						if (this.arrastavel && inicio1) {
							this.parent.setChildIndex(this, this.parent.getNumChildren() - 1);
							var global = content.localToGlobal(this.x, this.y);
							this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
							this.scaleX = _itensTemp[fase][3];
							this.scaleY = _itensTemp[fase][3];

						}
						btsPlayPausePerguntas[this.id].visible=false;

					});

					figuras[i].on("pressmove", function (evt) {
						if(this.perguntaParada==false){
							if (this.arrastavel && inicio1) {
								var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
								this.x = local.x;
								this.y = local.y;
							}
						}
					});
					figuras[i].on("pressup", function (evt) {
						/*se for sonoro para o som*/


						if (this.arrastavel && inicio1) {
							if(this.perguntaParada){
								if(this.respondivel){
									if (_itensTemp[fase][10][this.id].imagemFinal != null) {
										var imgTemp = new createjs.Bitmap(caminho + _itensTemp[fase][10][this.id].imagemFinal);
										console.log("nome da imagem nova:" + caminho + _itensTemp[fase][10][this.id].imagemFinal)

										imgTemp.image.onload = function () { };
										contentFixado.addChild(imgTemp);
										contentFixado.setChildIndex(imgTemp, this.id);
										console.log("layer=" + this.id);
										imgTemp.x = this.x;
										imgTemp.y = this.y;
										imgTemp.regX = this.regX;
										imgTemp.regY = this.regY;
										content.removeChild(this);
										imgTemp.rotation = _itens[this.id].posicaoResposta[4];

										i_acertos++;
										animaIco(0, this.x, this.y);
										count++;
										if (count >= pontosNecessarios) {
											inicio1 = false;
											proximaFase(true);
										}

									}

								}else{
									this.scaleX = 1;
									this.scaleY = 1;

									contentFixado.addChild(this);

									i_erros++;
									animaIco(1, this.x, this.y);
									if (count >= pontosNecessarios) {
										inicio1 = false;
										proximaFase(true);
									}
								}

							}else{
								var volta = true;
								var colidiu = false;
								console.log(hits.length);
								var i;
								var colisao;
								for (i = 0; i < hits.length; i++) {
									if(hits[i]==null){
										/*se o botao nao é arrastavel continua loop*/
										continue;
									}
									if (_colisaoBox) {
										colisao = ndgmr.checkRectCollision(hits[i], this);
									} else {
										colisao = ndgmr.checkPixelCollision(hits[i], this, 0.1, true);
									}

									if (colisao) {
										colidiu = true;

										if (hits[i].pode && this.pode) {
											if(necessitaConclusao){
												$btConcluir.show();
												this.x = hits[i].x;
												this.y = hits[i].y;
												this.scaleX = 1;
												this.scaleY = 1;
												this.rotation = _itens[i].posicaoResposta[4];
												volta = false;
											}else{
												if (hits[i].nome == this.resposta) {
													volta = false;
													sons[0].play();
													this.pode = false;
													this.arrastavel = false;
													/* troca imagem*/
													if (_itensTemp[fase][10][i].imagemFinal != null) {
														var imgTemp = new createjs.Bitmap(caminho + _itensTemp[fase][10][i].imagemFinal);
														console.log("nome da imagem nova:" + caminho + _itensTemp[fase][10][i].imagemFinal)

														imgTemp.image.onload = function () { };
														contentFixado.addChild(imgTemp);
														contentFixado.setChildIndex(imgTemp, this.id);
														console.log("layer=" + this.id);
														imgTemp.x = hits[i].x;
														imgTemp.y = hits[i].y;
														imgTemp.regX = hits[i].regX;
														imgTemp.regY = hits[i].regY;
														content.removeChild(this);
														imgTemp.rotation = _itens[i].posicaoResposta[4];

													} else {
														this.x = hits[i].x;
														this.y = hits[i].y;
														this.scaleX = 1;
														this.scaleY = 1;
														this.rotation = _itens[i].posicaoResposta[4];

														contentFixado.addChild(this);
													}
													if (_itensTemp[fase][2]) {
														hits[i].visible=false;
													}

													btsPlayPauseHits[this.id].visible=false;
													/*se for sonoro para o som*/

													tocaSomRetorno(this.id, false);


													i_acertos++;
													animaIco(0, this.x, this.y);
													count++;
													if (count >= pontosNecessarios) {
														inicio1 = false;
														proximaFase(true);
													}
													break;

												}
											}
										}
									}

								}
								if (volta) {

									this.scaleX = 1;
									this.scaleY = 1;


									btsPlayPausePerguntas[this.id].visible=true;
									createjs.Tween.get(this).to({ x: this.px, y: this.py }, 500, createjs.Ease.backOut);
									if (colidiu) {
										i_erros++;

										animaIco(1, this.x, this.y);


										sons[1].play();
										if (i_erros > _errosPermitidos+1) {
											Fim();
										}
									}
								}
							}
						}
					});

}
}
}
}
function confereAcertos(){
	var i,j;

	$btConcluir.hide();

	for (j = 0; j < figuras.length; j++) {
		if( figuras[j].respondido){
			continue;
		}
		var volta = true;
		var colidiu = false;
		console.log(hits.length);
		var i;
		var colisao;
		for (i = 0; i < hits.length; i++) {
			if (_colisaoBox) {
				colisao = ndgmr.checkRectCollision(hits[i], figuras[j]);
			} else {
				colisao = ndgmr.checkPixelCollision(hits[i], figuras[j], 0.1, true);
			}
			if (colisao) {
				colidiu = true;
				if (hits[i].pode && figuras[j].pode) {
					if (hits[i].nome == figuras[j].resposta) {
						volta = false;
						sons[0].play();
						figuras[j].pode = false;
						figuras[j].arrastavel = false;
						figuras[j].respondido = true;
						/* troca imagem*/
						if (_itensTemp[fase][10][i].imagemFinal != null) {
							var imgTemp = new createjs.Bitmap(caminho + _itensTemp[fase][10][i].imagemFinal);
							console.log("nome da imagem nova:" + caminho + _itensTemp[fase][10][i].imagemFinal)

							imgTemp.image.onload = function () { };
							contentFixado.addChild(imgTemp);
							contentFixado.setChildIndex(imgTemp, figuras[j].id);
							console.log("layer=" + figuras[j].id);
							imgTemp.x = hits[i].x;
							imgTemp.y = hits[i].y;
							imgTemp.regX = hits[i].regX;
							imgTemp.regY = hits[i].regY;
							content.removeChild(figuras[j]);
							imgTemp.rotation = _itens[i].posicaoResposta[4];

						} else {
							figuras[j].x = hits[i].x;
							figuras[j].y = hits[i].y;
							figuras[j].scaleX = 1;
							figuras[j].scaleY = 1;
							figuras[j].rotation = _itens[i].posicaoResposta[4];

							contentFixado.addChild(figuras[j]);
						}

						contenthit.removeChild(hits[i]);




						btsPlayPauseHits[figuras[j].id].visible=false;
						/*se for sonoro para o som*/
						tocaSomRetorno(figuras[j].id, false);

						i_acertos++;
						animaIco(0, figuras[j].x, figuras[j].y);
						count++;
						if (count >= pontosNecessarios) {
							inicio1 = false;
							proximaFase(true);
						}
						break;
					}
				}
			}

		}
		if (volta) {

			figuras[j].scaleX = 1;
			figuras[j].scaleY = 1;

			createjs.Tween.get(figuras[j]).to({ x: figuras[j].px, y: figuras[j].py }, 500, createjs.Ease.backOut);
			if (colidiu) {
				i_erros++;

				animaIco(1, figuras[j].x, figuras[j].y);


				sons[1].play();
				if (i_erros > _errosPermitidos+1) {
					Fim();
				}
			}
		}
	}
}
function tocaSom(id, somInicio) {

	if (somInicio) {
		var sonzinho = new Audio(caminho + _itensTemp[id][1][3]);
		sonsHits.push(sonzinho);
		sonzinho.play();
		sonzinho.onended = function () {
			btSomFasePlay.visible = true;
			btSomFasePause.visible = false;
		}
	} else {
		if (_itens[id].som.length > 1) {
			var sonzinho = new Audio(caminho + _itens[id].som);
			sonsHits.push(sonzinho);
			sonzinho.play();
		}
	}
}
function tocaSomRetorno(_qual, toca,_som) {
	if (toca) {
        //paraTodosSons();
        var sonzinho = new Audio(_som);
        sonsHits.push(sonzinho);
        sonzinho.play();
        sonzinho.onended = function () {
        	var trocaimg = new Image();
        	trocaimg.src = caminho+_itens[_qual.id].somResposta[1];
        	_qual.image=trocaimg;
        	_qual.modo=0;
        }
        
    } else {
    	paraTodosSons();

    }
}
function paraTodosSons() {
	for (var i = 0, len = sonsHits.length; i < len; i++) {
		sonsHits[i].pause();
	}
}
function criaLinha(obj1, obj2) {
	if (obj1 && obj2) {
		stage.removeChild(line);
		line = new createjs.Shape();
		stage.addChild(line);
		line.graphics.setStrokeStyle(2);
		line.graphics.beginStroke('red');
		line.graphics.moveTo(obj1.x, obj1.y);
		line.graphics.lineTo(obj2.x, obj2.y);
		line.graphics.endStroke();
	}
}

function criaDebug() {
	var myJSON = JSON.stringify(_itensTemp);
    //document.getElementById("debugador").textContent="var _itens="+myJSON+";";
    console.clear();
    console.log(myJSON);
}
function reseta() {

	fase = 0
	_itens = _itensTemp[fase][10];

	inicio1 = true;
	i_total=0;
	i_erros = 0;
	i_acertos = 0;
	count = 0;
	var w = 0;
	content.removeAllChildren();
	contenthit.removeAllChildren();
	contentFixado.removeAllChildren();
	montaFase();
	criaRelogio();
}
function animaTitulo(texto) {
	var tit = new createjs.Container();
	stage.addChild(tit);

	var txt = new createjs.Text(texto, "bold 60px dT Jakob", "#ffffff");
	txt.regY = 60;
	txt.textAlign = "center";

	var contorno = new createjs.Text(texto, "bold 60px dT Jakob", "#000000");
	contorno.regY = 60;
	contorno.textAlign = "center";
	contorno.outline = 7;


	tit.addChild(contorno);
	tit.addChild(txt);

	tit.x = -640;
	tit.y = $canvas.get(0).height/2;
	createjs.Tween.get(tit).to({ x: $canvas.get(0).width/2 }, 300, createjs.Ease.backOut).wait(2000).call(apagaTitulo);
}
function apagaTitulo() {
	stage.removeChild(this);
}
function animaIco(qual, b, c) {
	var ico;
	ico = new createjs.Bitmap(caminho + _icones[qual][0]);
	console.log(caminho + _icones[qual]);
	stage.addChild(ico);
	ico.x = b;
	ico.y = c;
	ico.regX = _icones[qual][1]/2;
	ico.regY = _icones[qual][2];
	ico.scaleX = ico.scaleY = 0.1;
	createjs.Tween.get(ico).to({ scaleX: 1, scaleY: 1 }, 200, createjs.Ease.quadOut).wait(600).call(deleta);
}
function deleta() {
	stage.removeChild(this);
}
function proximaFase(_animatitulo) {
	paraTodosSons();

	if (fase < _itensTemp.length - 1) {
		fase++;
		count = 0;
		_itens = _itensTemp[fase][10];
		if (_idioma == "espanhol") {
			var mensagens = ["¡MUY BIEN!"];
		} else if (_idioma == "ingles") {
			var mensagens = ["CONGRATULATIONS"];
		} else {
			var mensagens = ["PARABÉNS"];
		}

		var msg = Math.floor(Math.random() * mensagens.length);
		if(_animatitulo){

			animaTitulo(mensagens[msg]);
			createjs.Tween.get(content).wait(2000).call(montaFase);
		}else{
			montaFase();
		}
	} else {
		Fim();
	}


}
function Fim() {
	calculaTempo = false;
	/*se for sonoro para o som*/

	var img;
	var bo;
	var continua = false;

	if (i_erros > _errosPermitidos) {
		img = caminho + "tentenovamente.png";
		continua = true;
		sons[3].play();
	} else {
		img = caminho + "positivo.png";
		continua = true;
		sons[2].play();
	}
	if (continua) {
		inicio1 = false;
		setTimeout(function(){
			$divGuiFinal.fadeIn("slow");

		},1000)
		var t=Math.abs(i_acertos-i_erros);
		var porc=((t/i_total) * 100).toFixed(3);
		console.log("final"+porc);
		$labelAcerto.html("Acertos:"+i_acertos);
		$labelErros.html("Erros:"+i_erros);
		firstProgressBar.set(porc);
		firstProgressBar.update();

		console.log(i_erros);
		console.log(i_acertos);
		$btReload.on('click', function() {
			$divGuiFinal.hide();
			content.removeAllChildren();
			contenthit.removeAllChildren();
			contentFixado.removeAllChildren();
			stage.removeChild(this);
			reseta();
		});
	}
}

function shuffle(a) {
	var j, x, i;
	for (i = a.length; i; i -= 1) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
}

function ticker(event) {
	if(update){
		stage.update();
		if (calculaTempo) {
			if (rate > 60) {
				rate = 0;
				countTempo -= 1;
				$divTempo.html(countTempo + "s");
				rate = 0;
				if (countTempo < 1) {
					calculaTempo = false;
					i_erros = _errosPermitidos+1;
					Fim();
				}
			}
			rate++;
		}
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