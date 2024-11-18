
var memoryDeck = new function(){

	var main = null;

	return main = {

		_config: null,

		// deck
		_cartasDeck : new Array(),
		_cartasViradas : new Array(),
		_cartasCorretas : new Array(),
		_controleDeck : 0,
		_arrayDeck: [],
		_fimArrayDeck: 0,
		_elementos: new Array(),
		_controleCheck: 0,
		_atualizaCheck: 0,
		_tempCorrectItemsCount: 0,
		_vetor : new Array(),

		// lista com todos os elementos possiveis de escolha
		_cardFrontElementList : new Array(),

		/**
		 * Auxilia os timeouts
		 *
		 */
		_canClick : true,

		/**
		 * Quantidade de cartas para acertar
		 *
		 */
		_numberCardsCorrect : null,

		/**
		 * Quantidade de linhas para exibir
		 *
		 */
		_numberCardsLine : null,

		/**
		 * Imagem do verso da carta
		 *
		 */
		_imgCardBack : null,

		/**
		 * Array para guardar todas as cartas do nivel
		 *
		 */
		_arrayCards : new Array(),

		/**
		 * Id da área do jogo
		 *
		 * @string
		 */
		_areaGameId : '#div_area_memory #content',

		/**
		 * id das cartas viradas
		 *
		 */
		_cardsTurningTemp : new Array(),

		/**
		 * qtde das cartas corretas
		 *
		 */
		_countCardsCorrects : 0,

		/**
		 * guardas as cartas temporariamente corretas, solição para vira 3 cartas
		 *
		 */
		_correctsTemp : null,

		/**
		 * Auxilia os timeouts
		 *
		 */
		_timerIdFlip : null,

		// flag que indica se jogo ja comecou
		_gameStarted : false,


		/**
		 * Iniciação de uma nova fase
		 *
		 */
		startNew : function(){
			main._gameStarted = false;
			main.clearStage();
			main.setInitialization();
		},


		/**
		 * Definições iniciais
		 *
		 */
		setInitialization : function(){
			var config = system.getConfig();
			_config = config;

			main._arrayCards	 = config.cards;
			main._imgCardBack	 = config.imgCardBack;
			main._numberCardsCorrect = config.numberCardsCorrect;
			main._numberCardsLine    = config.numberCardsLine;

			// esconde o enunciado padrao
			$('.tuto_content').hide();

			// define novo intro
			$('.topo .introbox-container').show();

			cfg = system.getConfig()


			initialScore = cfg.initialScore ? cfg.initialScore : 10
			rightIncrement = cfg.rightIncrement ? cfg.rightIncrement : 2
			wrongIncrement = cfg.wrongIncrement ? cfg.wrongIncrement : -1

			scores.setInitialScore(initialScore);
			scores.setRightIncrement(rightIncrement);
			scores.setWrongIncrement(wrongIncrement);



			// define novo intro
			$('.topo .btn_intro').show();
			$('.introbox .content p').html(config.message);
			$('.introbox .btn_audio').unbind("click").click(function(e) {
				// Define som do enunciado e ao finalizar esconde janela
				sound.setMessageSound(config.soundMessage, function() {
					setTimeout(function(){ system.hideIntroBox() }, 1000);
				});
				e.stopPropagation();
			}).trigger('click');
			system.showIntroBox(false, false, function() {
				// somente inicializa o jogo apos
				// fechada a janela do enunciado
				if (!main._gameStarted) {
					main.createStage();
					scores.timeHandler();
					main._gameStarted = true;
				}
			});

			main._tempCorrectItemsCount = 0;

			//tempo inicial
			scores._secCount = 0;
			scores._minCount = 0;
			scores.displayInfo();

			// carrega as cartas do deck para jogo
			if (config.typeLevel == 'memory_deck') {
				main._arrayDeck		= config.cartaDeck;
				main._fimArrayDeck	= parseInt(config.cartaDeck.length);
				// carrega items do config em um array global
				for (var i in main._arrayDeck) {
					main._cartasDeck[i] = main._arrayDeck[i];
				}
			}
		},

		/**
		 * Criação de uma fase
		 *
		 */
		createStage : function(){
			$('#div_area_memory').show();
			$(main._areaGameId).empty();
			//carrega as cartas
			main.loadCards();
		},

		/**
		 * Carrega as cartas de acordo com o config
		 *
		 */
		loadCards: function () {




			// deck
			if (_config.typeLevel == 'memory_deck') {
               	main.createCardDeck();
               	var showCardDeckTimeout = (_config.showCardDeckTimeout) ? _config.showCardDeckTimeout : 3000;
               	setTimeout(function(){ main.changeCardDeck(main._controleDeck) }, showCardDeckTimeout);
            }

			//mistura as peças
			main._arrayCards = shuffle(main._arrayCards);

			//pega o tamanho das peças e calcula o tamanho da div que guarda todas as peças
			imgWidth = (main._arrayCards[0].width) ? main._arrayCards[0].width : 0;

			//soma com 10 porque é o tamanho do espaço entre as peças
			larguraDiv = (parseInt(imgWidth) + 10) * main._numberCardsLine;

			//cria as divs contendo a carta de frente e a carta de verso
			$(main._areaGameId)
			.append(
				$("<div id = 'dvCards'></div>").css({
					background:'none',
					width: 	larguraDiv,
					height: '415',
					margin: '0px auto auto'
				})
			);

			for (var i in main._arrayCards) {
				//faz quebrar a quantidade de acordo com o numero de repetição das peças
				clear = null;
				// quebrar linha?
				if (i == main._numberCardsLine) clear = "both";

				// pega as imagens do config
				images = main._arrayCards[i];

				// div da carta de frente
				var cardFront = $('<div class="cardFront"></div>').css({
									width: 	images.width,
									height: images.height
								}).append(
									$('<img>').css({
										width: 	images.width,
										height: images.height
									}).attr({
										src: images.src
									})
								);

				main._cardFrontElementList.push(cardFront);

				// div geral, guarda todas as
				$('#dvCards').append(
					// div de cada carta
					$("<div class='"+images.classe+"'></div>").css({
						background:'none',
						width: 	images.width,
						height: images.height,
						clear: clear
					}).data({
						'id': images.id,
						'feedback' : ((images.feedback) ? images.feedback : '')
					}).append(
						//div do verso da carta
						$("<div class='cardBack'></div>").css({
							width: 	images.width,
							height: images.height,
							cursor: 'pointer',
							display: 'none'
						}).append(
							// TODO: melhorar a forma como os dados sao passados
							$("<img id='"+images.id+"' alt='"+i+"'>").css({
								width: 	images.width,
								height: images.height
							}).attr({
								src: main._imgCardBack
							}).click(function() {
								if ($(this).attr('quickFlip')) {
									$(this).quickFlip();
									$(this).attr('quickFlip', true);

								}

								// no momento do clique verifica se item esta correto
								main.checkCards($(this).parent().parent(), $(this).attr('id'), $(this).attr('alt'));
							})
						)
					).append(cardFront)
				);
			}

			var flipStartCardsTimeout = (_config.flipStartCardsTimeout) ? _config.flipStartCardsTimeout : 2000;
            setTimeout(function() { main.flipStartCards(0) }, flipStartCardsTimeout);
		},

        /**
         * Faz com que todas as cartas desvirem no inicio da fase
         */
        flipStartCards: function(flipid) {
            $('.cardBack').each(function() {
				$($(this).parent()).quickFlipper({openSpeed:30, closeSpeed:350}, flipid, 1);
    		});
        },


		/**
		 * Verifica se virou as cartas iguais
		 *
		 */
		checkCards : function(elemento, imagem, alt) {
			//bloqueia o click das outras cartas até terminar as animações
			if(!main._canClick) return;



			//vira a carta
			main.flipObject(elemento, 1);

			//recebe o elemento e indice da imagem clicados
			main._cartasViradas[main._cartasViradas.length] = imagem;
			main._elementos[main._elementos.length] = elemento;

			if ( imagem == main._cartasDeck[main._controleDeck].id ) { //Acertou

				main._vetor[main._tempCorrectItemsCount] = alt;
				main._tempCorrectItemsCount++;

				// ja selecionou a quantidade de cartas que foi configurada, verifica se acertou o conjunto
				if ( main._tempCorrectItemsCount == _config.numberCardsCorrect ) {

					//trava as outras cartas até completar a ação
					main._canClick = false;

					//adiciona as cartas corretas
					for (var i in main._cartasViradas) {
						main._cartasCorretas[main._cartasCorretas.length] = main._cartasViradas[i];
					}

					//sons e pontuação
					sound.successSound();
					scores.correctCount();

					// verifica se deve voltar para primeira carta do deck
					if ( main._controleDeck == main._fimArrayDeck-1 ) {
						// volta para primeira carta do deck
						main._controleDeck = 0;
						for(var i = 0; i < main._fimArrayDeck - 1; i++) {
							main._cartasDeck[i] = main._cartasDeck[i];
						}
					} else {
						for(var i = main._controleDeck; i < main._fimArrayDeck; i++) {
							main._cartasDeck[i] = main._cartasDeck[i + 1];
						}
					}

					//limpa os arrays auxiliares
					main.clearCardsFlip();
					main._tempCorrectItemsCount = 0;
					main.verificaFimDeck();
					main._fimArrayDeck--;
					main._controleCheck = 0;

					// mostra feedback sobre as cartas corretas
					setTimeout(function(){ main.showFeedback() }, 800);

					if (main._fimArrayDeck == 0) {
						$('.deck').remove();
						scores.pauseTime();
                    	setTimeout(function(){
                    		main.finalizedLevel();
                    		main._canClick = true;
                    	}, 1000);
					} else
					{
						setTimeout(function() {
							main.changeCardDeck(main._controleDeck);
							main._canClick = true;
						}, 2000);
					}

				}
			} else { //errou
				//trava as outras cartas até completar a ação
				main._canClick = false;
				main._controleCheck = 0;

				//sons e pontuação
				scores.wrongCount();
				sound.errorSound();

				main._controleDeck++;
				main.verificaFimDeck();

				main._tempCorrectItemsCount = 0;

				//desvira as cartas
				main._timerIdFlip = setTimeout(function(){
					main.flipSeveralObjects(main._elementos);
					main.changeCardDeck(main._controleDeck);
				}, 1000);
			}
		},


		/**
		 *	Mostra feedback ao acertar carta
		 */
		showFeedback : function() {
			$.each(main._vetor, function(key, cardIndex) {
				var cardElement = main._cardFrontElementList[cardIndex];
				var cardObject  = main._arrayCards[cardIndex];
				if (cardObject && cardObject.feedback) {
					var feedbackHtml = '<div class="feedback"><img src="'+cardObject.feedback+'" /></div>';
					$(cardElement).append(feedbackHtml);
					setTimeout(function() {
						$(cardElement).find('div.feedback').remove();
					}, 2000);
				}
			});
		},


		/**
		 * Vira os objetos errados
		 *
		 */
		flipSeveralObjects: function() {
			for(var i in main._elementos){
				main.flipObject(main._elementos[i], 0);
			}
			main.clearCardsFlip();
			main._canClick = true;
		},

		/**
		 * limpa variaveis auxiliares
		 *
		 */
		clearCardsFlip: function() {
			main._controle 		= 0;
			main._cartasViradas = [];
			main._elementos     = [];
			main._acertosTemporarios = null;
		},


		/**
		 * Verifica se chegou no final do nível pra colocar as funções
		 */
		checkLevel : function(){
			main._nivelAtual++;
			var config = main._allConfig[main._nivelAtual];
			if(config){
				main.setConfig(config);
				return true;
			} else {
				return false;
			}
		},

		/**
		 * Funcao que realiza efeito de virar
		 *
		 */
		flipObject: function(o, flipid) {
			$(o).quickFlipper({openSpeed:30, closeSpeed:120}, flipid, 1);
		},

		/**
		 * Executar as ações relacionadas ao fim do nivel
		 */
		finalizedLevel : function() {
			scores.displayInfo();
			scores.pauseTime();
			window.setTimeout( function(){
				system.scoreboard();
			}, 800);
		},

		/**
		 * Limpa as configurações
		 *
		 */
		clearStage : function(){
			$('#div_area_association').hide();
			$('#div_area_burst').hide();

			$(main._areaGameId).empty();

			// limpa variaveis
			main._arrayCards = new Array();
			main._cardFrontElementList = new Array();
			main._countCardsCorrects = 0;
			main._cartasDeck = new Array();
			main._cartasViradas = new Array();
			main._cartasCorretas = new Array();
			main._controleDeck = 0;
			main._arrayDeck = [];
			main._fimArrayDeck = 0;
			main._elementos = new Array();
			main._controleCheck = 0;
			main._atualizaCheck = 0;
			main._tempCorrectItemsCount = 0;
			main._vetor = new Array();

			main.clearCardsFlip();

			if (main._timerIdFlip) {
				clearTimeout(main._timerIdFlip);
			}

			main._gameStarted = false;
			sound.stopAllSound();
		},


		/**
		 * Limpa as configurações
		 *
		 */
		clearLevel : function(){
			$(main._areaGameId).empty();
			main._arrayCards     = new Array();
			main._cartasCorretas = new Array();
			main.clearCardsFlip();
			if (main._timerIdFlip) {
				clearTimeout(main._timerIdFlip);
			}

			main._gameStarted = false;
		},

		// comeco: especifico para jogo dom deck de cartas

		changeCardDeck : function(id) {
			$('.imgDeck').attr({
				src: main._cartasDeck[id].src,
				id: main._cartasDeck[id].id,
				audio: main._cartasDeck[id].audio
			});

			if (main._cartasDeck[id].audio) {
				sound.sounds(main._cartasDeck[id].audio)
			}
		},

		/*
		 *	Se alcançou o máximo do indice do deck, reinicia
		 */
		verificaFimDeck : function() {
			if(main._controleDeck == main._fimArrayDeck){
				main._controleDeck = 0;
			}


		},

		createCardDeck : function() {
			$(main._areaGameId)
			.append(
				$('<div class="deck"></div>')
				.append(
					$('<img id="" class="imgDeck"/>')
					.attr({
						src: main._cardTurning
					})
				).click(function(){
					if ($(this).find("img").attr("audio") != "undefined")
						sound.sounds($(this).find("img").attr("audio"))
				})
			);
		},

		// fim: especifico para jogo dom deck de cartas

	};
};