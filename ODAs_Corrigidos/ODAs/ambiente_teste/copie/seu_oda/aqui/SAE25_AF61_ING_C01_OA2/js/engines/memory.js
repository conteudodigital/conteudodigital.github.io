
var memory = new function(){

	var main = null;

	return main = {

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
		_areaGameId : '#content',

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

		_config : null,


		/**
		 * Iniciação de uma nova fase
		 *
		 */
		startNew : function(){
			main.clearStage();
			main.setInitialization();
			// main.createStage();
			// scores.timeHandler();
		},

		/**
		 * Definições iniciais
		 *
		 */
		setInitialization : function() {
			var config = system.getConfig();
			_config = config;

			main._arrayCards = config.cards;
			main._imgCardBack = config.imgCardBack;
			main._numberCardsCorrect = config.numberCardsCorrect;
			main._numberCardsLine = config.numberCardsLine;

			// esconde o enunciado padrao
			$('.tuto_content').hide();

			// define novo intro
			$('.topo .introbox-container').show();

			//console.log('game started? ' + ((main._gameStarted) ? 'sim' : 'nao'))

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

			//pontuação inicial
			cfg = system.getConfig()


			initialScore = cfg.initialScore ? cfg.initialScore : 10
			rightIncrement = cfg.rightIncrement ? cfg.rightIncrement : 2
			wrongIncrement = cfg.wrongIncrement ? cfg.wrongIncrement : -1

			scores.setInitialScore(initialScore);
			scores.setRightIncrement(rightIncrement);
			scores.setWrongIncrement(wrongIncrement);

			scores.setItensCount(system.getConfig().cards.length / 2);

			//tempo inicial
			scores._secCount = 0;
			scores._minCount = 0;
			scores.displayInfo();
		},

		/**
		 * Criação de uma fase
		 *
		 */
		createStage : function() {
			//console.log('memory > createStage()')
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

			for (var i in main._arrayCards){
				//faz quebrar a quantidade de acordo com o numero de repetição das peças
				clearFloat = null;

				if (i == main._numberCardsLine){
					clearFloat = "both";
				}

				//pega as imagens do config
				images = main._arrayCards[i];

				// faz preload de audio a ser tocado quando uma carta eh verificada
				if (images.soundCheck) {
					sound.preloadCheckSound(images.soundCheck);
				}

				//div geral, guarda todas as
				$('#dvCards').append(
					//div de cada carta
					$("<div class = '"+images.classe +"'></div>").css({
						background:'none',
						width: 	images.width,
						height: images.height,
						clear: clearFloat
					}).data({
						'id': images.id,
						'soundCheck': ((images.soundCheck) ? images.soundCheck : ''),
						'soundCorrect': ((images.soundCorrect) ? images.soundCorrect : ''),
						'feedback' : ((images.feedback) ? images.feedback : '')
					}).append(
						//div do verso da carta
						$("<div class ='cardBack'></div>").css({
							width: 	images.width,
							height: images.height,
							cursor: 'pointer',
							display: 'none' //ajuste: carta agora é carregada virada em 2s
						}).append(
							$("<img>").css({
								width: 	images.width,
								height: images.height
							}).attr({
								src: main._imgCardBack
							}).click(function(){
								if($(this).attr("quickFlip")){
									$(this).quickFlip();
									$(this).attr("quickFlip", true);
								}
								main.checkCards($(this).parent().parent());
							})
						)
					).append(
						//div da frente da carta
						$('<div></div>').css({
							width: 	images.width,
							height: images.height
							//display: 'none'
						}).append(
							$('<img>').css({
								width: 	images.width,
								height: images.height
							}).attr({
								src: images.src
							})
						)
					)
				);
			}

			var flipStartCardsTimeout = (_config.flipStartCardsTimeout) ? _config.flipStartCardsTimeout : 2000;
            setTimeout(function() { main.flipStartCards(0) }, flipStartCardsTimeout);
		},

        /**
         * Faz com que todas as cartas desvirem no inicio da fase
         */
        flipStartCards: function(flipid){
            $('.cardBack').each(function(){
				$($(this).parent()).quickFlipper({openSpeed:30, closeSpeed:350}, flipid, 1);
    		});
        },

		/**
		 * Verifica se virou as cartas iguais
		 *
		 */
		checkCards : function(divCardParent){
			//bloqueia o click das outras cartas até terminar as animações
			if(!main._canClick) return;

			//vira a carta clicada
			main.flipObject(divCardParent, 1);

			// toca som de verificacao de carta (ao virar)
			sound.playCheckSound(divCardParent.data('soundCheck'));

			//verifica se é a primeira carta da jogada
			if (main._cardsTurningTemp.length == 0)
				main._correctsTemp = divCardParent.data('id');

			//recebe o elemento clicado
			main._cardsTurningTemp[main._cardsTurningTemp.length] = divCardParent;

			//verifica se desvirou a quantidade definida da fase
			if (main._cardsTurningTemp.length >= main._numberCardsCorrect) {

				//verifica se a carta desvirada é diferente da(s) anterior(es)
				if (divCardParent.data('id') != main._correctsTemp) {
					//trava as outras cartas até completar a ação
					main._canClick = false;

					//sons e pontuação
					scores.wrongCount();
					sound.errorSound();

					//desvira as cartas
					main._timerIdFlip = setTimeout(function(){
						main.flipSeveralObjects();
					}, 800);
				} else {
					//sons e pontuacao
					scores.correctCount();
					sound.successSound();

					if (divCardParent.data('soundCorrect'))
					{
						sound.sounds(divCardParent.data('soundCorrect'))
					}


					// bloqueia virar outras cartas ate mostrar feedback
					main._canClick = false;

					// verifica se deve ser mostrada um feedback sobre a cartao ao acertar
					setTimeout(function() {
						main.showFeedback();
						main._canClick = true;

						// soma as cartas corretas
						main._countCardsCorrects += main._cardsTurningTemp.length;

						// limpa os arrays auxiliares
						main.clearCardsFlip();

						//verifica se chegou ao final do nível (fase)
						if (main._countCardsCorrects == main._arrayCards.length) {
							main.finalizedLevel();
						}
					}, 800);
				}
			}

			//verifica se a carta atual é diferente da anterior
			if ( divCardParent.data('id') != main._correctsTemp ) main._correctsTemp = null;
		},

		/**
		 *	Mostra feedback ao acertar carta
		 */
		showFeedback : function() {
			$.each(main._cardsTurningTemp, function(key, card) {
				if (card) {
					var feedbackImagem = $(card).data('feedback');
					if (feedbackImagem) {
						var feedbackHtml = '<div class="feedback"><img src="'+feedbackImagem+'" /></div>';
						card.append(feedbackHtml);
						setTimeout(function() {
							$(card).find('div.feedback').remove();
						}, 2000);
					}
				}
			});
		},

		/**
		 * Vira os objetos errados
		 *
		 */
		flipSeveralObjects: function(){
			//vira mais de um objeto
			for(var i in main._cardsTurningTemp){
				main.flipObject(main._cardsTurningTemp[i], 0);
			}
			main.clearCardsFlip();
			main._canClick = true;
		},

		/**
		 * limpa variaveis auxiliares
		 *
		 */
		clearCardsFlip: function() {
			//limpar array
			main._cardsTurningTemp = [];
			main._correctsTemp = null;
		},

		/**
		 * Funcao que realiza efeito de virar
		 *
		 */
		flipObject: function(o, flipid){
			$(o).quickFlipper({openSpeed:30, closeSpeed:120}, flipid, 1);
		},

		/**
		 * Executar as ações relacionadas ao fim do nivel
		 */
		finalizedLevel : function(){
			scores.displayInfo();
			scores.pauseTime();
			levelBox.total_points = parseInt($(".div_score:first").html())

			setTimeout( function(){

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

			main._arrayCards         = new Array();
			main._countCardsCorrects = 0;

			main.clearCardsFlip();
			if (main._timerIdFlip) {
				clearTimeout(main._timerIdFlip);
			}

			main._gameStarted = false;
			sound.stopAllSound();
		}

	};
};