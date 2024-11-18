
var burst = new function(){
	var main = null;

	main = {

		/**
		 * Níveis do jogo
		 *
		 */
		_levels				: null,

		/**
		 * Itens do jogo
		 *
		 */
		_items 				: null,

		/**
		 * Intes corretos
		 *
		 */
		_itemsCorrect 		: null,

		/**
		 * Configurações específica
		 *
		 */
		_game 				: null,

		/**
		 * Indice de controle dos não corretos
		 *
		 */
		_indexBalloon 		: 0,

		/**
		 * Indice de controle dos corretos
		 *
		 */
		_indexBalloonCorrect : 0,

		/**
		 * Id do balao certo atual
		 *
		 */
		_idIndexBalloon 	: null,

		/**
		 * Quantas vezes acertou o item atual
		 */
		_acertosItemCorrente: 0,

		// controle de acerto e erro
		_errorCount : 0,
		_successCount : 0,

		_totalItemsConfig : 0,
		_totalItems : 0,

		_preloadImages : new Array(),
		_preloadImagesIndex : 0,

		_isGameRunning: false,

		_balloons: new Array(),
		_enunciadoTocou: false,

		/**
		 * Iniciação de uma nova fase
		 *
		 */
		startNew : function() {
			main.setInitialization();
			main.clearStage();
			main.createStage();
		},
		
		preloadImage : function(item) {
			main._preloadImages[main._preloadImagesIndex] = new Image();
			main._preloadImages[main._preloadImagesIndex].src = item;
			main._preloadImagesIndex++;
		},
		
		/**
		 * Definições iniciais
		 *
		 */
		setInitialization : function() {
			main._isGameRunning = true;
			
			var config = system.getConfig();
			var n = 0;
			var m = 0;
			var items = [];
			
			main._itemsCorrect = [];
			main._indexCorrectItens = []
			main._indexNotCorrectItens = [];
			main._items = config.items;
			main._game = config.game;
			
			cfg = config;
			
			initialScore = cfg.initialScore ? cfg.initialScore : 10;
			rightIncrement = cfg.rightIncrement ? cfg.rightIncrement : 2;
			wrongIncrement = cfg.wrongIncrement ? cfg.wrongIncrement : -1;
			
			scores.setInitialScore(initialScore);
			scores.setRightIncrement(rightIncrement);
			scores.setWrongIncrement(wrongIncrement);
			
			// cria uma lista dos items que sao corretos
			for (var i in main._items) {
				// Faz um regex para pegar o caminho da imagem
				var image_url = main._items[i].html;
				if (image_url) {
					var regex = /<img.*?src='(.*?)'/;
					var result = regex.exec(image_url);
					if (result) {
						var image_src = result[1];
						if (image_src) {
							// Faz preload de imagens
							main.preloadImage(image_src);
						}
					}
				}
				
				main._items[i].id = i;
				if (main._items[i].correct) {
					main._itemsCorrect[n++] = main._items[i];
					main._indexCorrectItens.push(i);
				}
				else {
					main._indexNotCorrectItens.push(i);
				}
			}
			
			// Se for order, na verdade apenas o item cujo indice é 0 sera correto (pois estamos na iniciliazacao)
			if (main._game.type == "order") {
				main._indexCorrectItens = [];
				main._indexNotCorrectItens = [];
				
				for (var w = 0; w < main._items.length; w++) {
					if (w == 0) {
						main._indexCorrectItens.push(w);
					}
					else {
						main._indexNotCorrectItens.push(w);
					}
				}
			}
			
			// verifica quantidade que deve ser considerada para passar de fase
			main._totalItemsConfig = (config.game.totalCorrectToNextLevel > 0) ? config.game.totalCorrectToNextLevel : main._itemsCorrect.length;
			main._totalItems = 0;
			
			main._game = config.game;
			
			// tempo inicial
			scores._secCount = 0;
			scores._minCount = 0;
			scores.displayInfo();
			main._indexBalloon = 0;
			main._indexBalloonCorrect = 0;
			main._successCount = 0;
			main._errorCount = 0;
			
			// esconde o enunciado novo
			$('.topo .introbox-container').hide();
			
			// remove todos os elementos de erro anteriores
			$('.quick_feedback').empty();
			
			// Toca audio introdutorio somente se for do tipo "default"
			if (main._game.type == 'default') {
				sound.setMessageSound(config.soundMessage, function() {
					main._enunciadoTocou = true;
					if (main._game.terminarEnunciadoAntesDeIniciar && main._game.terminarEnunciadoAntesDeIniciar == true) {
						scores.timeHandler();
						for (var i = 0; i < main._balloons.length; i++) {
							main._balloons[i].animate(main._balloons[i]._direction);
						}
					}
				});
			}
			// Define enunciado geral do nivel ao iniciar
			$('.tuto_content').show();
			$('.t_text').show();
			$('.t_text').html(config.message);
			
			// calcula tamanho do botao de audio dentro do enunciado
			$('.bt_voice').css('height', ($('.tuto_bar').height() - 10) + 'px');
			$('.bt_voice').css('width', $('.bt_voice').height() + 'px');
			
			$('body').on('touchmove', function(e) {
				e.preventDefault();
			});
		},
		
		/**
		 *	Obtem o elemento que possui a maior largura para
		 *  usar ao computar quantos cabem na tela
		 */
		getLargestWidth : function() {
			var largest = 0;
			for (var i = 0; i < burst._items.length; i++) {
				if (burst._items[i].width > largest)
					largest = burst._items[i].width
			}
			return largest;
		},
		
		/**
		 *	Ajusta items de configuracao que nao cabem na tela
		 */
		adjusteLargeItems: function() {
			var extraSpace = 50;
			var bestWidth = Math.ceil(($(window).width() - extraSpace) / main._game.visibleItems);
			var largestWidth = main.getLargestWidth();
			if (largestWidth > bestWidth) {
				$.each(main._items, function(i, v) {
					if (v.width > bestWidth) {
						var r = v.width / v.height;
						v.width = bestWidth;
						v.height = v.width / r;
						v.html = $(v.html)
								 .attr('width', bestWidth + 'px')
								 .attr('height', v.height + 'px')
								 .get(0)
								 .outerHTML;
					}
				});
			}
		},
		
		/**
		 * Criação de uma fase
		 */
		createStage : function() {
			$('#div_area_burst').show();
			
			lastsRandomLeft = new Array();
			var correct = false;
			
			// Ajusta dimensoes de elementos que ultrapassam a largura
			// que melhor se adapta a tela do usuario
			main.adjusteLargeItems();
			
			for (var i in main._items) {
				if (i < main._game.visibleItems) {
					main.createItem(main._items[burst.getNewBalloonIndex()]);
					if (!correct && main._items[i].correct) {
						correct = true;
						var question = main._items[i].question;
						
						// Toca o audio do primeiro elemento sorteado (No tipo order)
						if (main._game.type == "order") {
							var soundMessage = main._items[i].soundMessage;
							if (soundMessage) {
								sound.setMessageSound(soundMessage, function() {
									if (main._game.terminarEnunciadoAntesDeIniciar && main._game.terminarEnunciadoAntesDeIniciar == true) {
										scores.timeHandler();
										main._enunciadoTocou = true;
										for (var i = 0; i < main._balloons.length; i++) {
											main._balloons[i].animate(main._balloons[i]._direction);
										}
									}
								});
							}
						}
						
						if (main._game.appendMessage) {
							$('.t_text p.t_text_sub').remove();
							if (gameConfig.debug && main._game.type == 'order') {
								$('.t_text').append('<p class="t_text_sub">' + question + '(Correct index: ' + i + ')' + '</p>');
							}
							else {
								$('.t_text').append('<p class="t_text_sub">' + question + '</p>');
							}
						}
						else {
							if (gameConfig.debug && main._game.type == 'order') {
								$('.t_text').html(question + ' (Correct index: '+i+')');
							}
							else {
								$('.t_text').html(question);
							}
						}

						main._idIndexBalloon = main._items[i].id;
					}
					main._indexBalloon++;
				}
			}
			
			if (typeof main._game.terminarEnunciadoAntesDeIniciar == "undefined" || !main._game.terminarEnunciadoAntesDeIniciar) {
				scores.timeHandler();
			}
			
			$('body').css({ overflow : 'hidden' });
		},
		
		/**
		 * Criando um item
		 *
		 * @param item
		 */
		createItem : function(item) {
			if (!main._isGameRunning) return;
			
			var b = new balloon({
				toAppend	: '#div_area_burst',
				direction   : (main._game.direction) ? main._game.direction : "down",
				radius		: $(window).width() / 2,
				height		: item.height,
				width		: item.width,
				speed		: main._game.speed,
				onClick		: function() {
					main.checkAcceptObject(this);
				},
				html 		: item.html,
				data 		: {
					feedback: ((item.feedback) ? item.feedback : null),
					correct: ((item.correct) ? item.correct : false),
					acertosNecessarios: ((item.acertosNecessarios) ? item.acertosNecessarios : 1),
					idIndex: item.id,
					question: item.question,
					audio: item.audio
				}
			});
			
			main._balloons.push(b);
			
			if ((typeof main._game.terminarEnunciadoAntesDeIniciar == "undefined" || !main._game.terminarEnunciadoAntesDeIniciar) ||
				main._enunciadoTocou || !sound.soundOn) {

				b.animate(b._direction);
			}
		},
		
		getNewBalloonIndex: function() {
			var newItemId;
			var correctItemProbability = typeof main._game.correctItemProbability == "number" ? main._game.correctItemProbability : .5;
			
			if (Math.random() < correctItemProbability) {
				newItemId = this._indexCorrectItens[~~(Math.random()*this._indexCorrectItens.length)];
			}
			else {
				newItemId = this._indexNotCorrectItens[~~(Math.random()*this._indexNotCorrectItens.length)];
			}

			return newItemId;
		},
		
		/**
		 * Verificação de uma peça em um local
		 */
		checkAcceptObject : function(balloon){
			var config = system.getConfig();
			var html = "";
			
			shouldShowOrderFeedback = false;
			
			// PADRAO
			if (config.game.type == "default") {
				if ($(balloon).data("correct")) {
					main._successCount++;
					sound.successSound();
					scores.correctCount();
					html = '<span class="pontoCorreto">+' + scores._rightIncrement  + '</span>';
					
					main._totalItems++;
					
					// se jogo ainda nao terminou
					if (main._totalItems <= main._totalItemsConfig) {
						// verifica se foi definido uma quantidade maxima de acertos
						if (main._game.totalCorrectToNextLevel > 0) {
							if (main._successCount == main._game.totalCorrectToNextLevel) {
								scores.setDied(false);
								main.checkFinish();
							}
						}
						
						// Randomiza e cria um novo item baseado em todos items configurados (certos/errados)
						if (config.game.random) {
							main._indexBalloonCorrect = this
						}
						else {
							main._indexBalloonCorrect = (main._successCount % main._items.length);
						}
						main.createItem(main._items[main.getNewBalloonIndex()]);
					}
					else {
						// termina jogo
						main.checkFinish();
					}
				}
				else {
					main._errorCount++;
					sound.errorSound();
					scores.wrongCount();
					main.hurt();
					html = '<span class="pontoErro">-1</span>';
					
					// verifica definicacao de numero maximo de erros
					if (main._game.totalErrorToGameOver > 0) {
						if (main._errorCount == main._game.totalErrorToGameOver) {
							scores.setDied(true);
							main.checkFinish();
						}
						else {
							// Randomiza e cria um novo item baseado em todos items configurados (certos/errados)
							if (config.game.random) {
								main._indexBalloonCorrect = (Math.round(Math.random() * (main._items.length - 1)));
							}
							else {
								main._indexBalloonCorrect = (main._successCount % main._items.length);
							}
							main.createItem(main._items[main.getNewBalloonIndex()]);
						}
					}
					else {
						// Randomiza e cria um novo item baseado em todos items configurados (certos/errados)
						if (config.game.random) {
							main._indexBalloonCorrect = (Math.round(Math.random() * (main._items.length - 1)));
						}
						else {
							main._indexBalloonCorrect = (main._successCount % main._items.length);
						}
						main.createItem(main._items[main.getNewBalloonIndex()]);
					}
				}
			}
			else {
				// ORDEM
				// acerto
				if ($(balloon).data('correct') && $(balloon).data('idIndex') == main._indexBalloonCorrect) {
					main._successCount++;
					sound.successSound();
					scores.correctCount();
					html = '<span class="pontoCorreto">+' + scores._rightIncrement  + '</span>';
					
					main._acertosItemCorrente++;
					if (main._acertosItemCorrente >= $(balloon).data('acertosNecessarios')) {
						main._totalItems++;
						main._acertosItemCorrente = 0;
						
						if (main._totalItems < main._itemsCorrect.length) {
							// muda o proximo item correto
							if (config.game.random) {
								// gerando proximo randomicamente
								main._indexBalloonCorrect = Math.round(Math.random() * (main._itemsCorrect.length - 1));
							}
							else {
								// mantem ordem no config
								main._indexBalloonCorrect++;
							}
							
							main.changeQuestion();
							main.createItem(main._items[main.getNewBalloonIndex()]);
						}
						else {
							// fim de jogo!
							scores.setDied(false);
							main.checkFinish();
						}
					}
					else {
						main.createItem(main._items[main.getNewBalloonIndex()]);
					}
				}
				else {
					shouldShowOrderFeedback = true;
					
					main._errorCount++;
					sound.errorSound();
					scores.wrongCount();
					main.hurt();
					html = '<span class="pontoErro">-1</span>';
					
					// verifica definicacao de numero maximo de erros
					if (main._game.totalErrorToGameOver > 0) {
						if (main._errorCount == main._game.totalErrorToGameOver) {
							// Ao finalizar desliga todos os sons
							sound.stopAllSound();
							
							// define que usuario nao conseguiu passar de nivel
							scores.setDied(true);
							
							main.checkFinish();
						}
						else {
							main.createItem(main._items[main.getNewBalloonIndex()]);
						}
					}
					else {
						main.createItem(main._items[main.getNewBalloonIndex()]);
					}
				}
			}
			
			$(balloon).css({
				'-ms-animation-play-state':'paused',
				'-o-animation-play-state':'paused',
				'-moz-animation-play-state':'paused',
				'-webkit-animation-play-state':'paused',
				'animation-play-state':'paused'
			})
			.stop()
			.html(html)
			.data('idIndex', -1)
			.unbind('click touchstart')
			.animate({opacity: 0}, 'slow', function(){
				$(this).remove();
			});
			
			// tem feedback configurado para acerto/erro?
			var feedbackImage = $(balloon).data('feedback');
			if (feedbackImage) {
				// Se em modo "default" sempre mostra feedback configurado
				if (config.game.type == 'default') {
					$(balloon).css({
						'background': 'url(' + feedbackImage + ') no-repeat center center'
					});
				} else {
					// Se em modo "order" somente mostra feedback ao errar
					if (shouldShowOrderFeedback) {
						$(balloon).css({
							'background': 'url(' + feedbackImage + ') no-repeat center center'
						});
					}
				}
			}
			
			clearTimeout($(balloon).data().idAnimation);
			scores.displayInfo();
		},
		
		/**
		 * Mostra erro para usuario
		 */
		hurt: function() {
			setTimeout(function() {
				$('.quick_feedback')
				.css('visibility', 'visible')
				.append('<div class="hurt">&#x2718;</div>');
			}, 100);
		},
		
		/**
		 *	Muda questao atual do jogo
		 */
		changeQuestion: function() {
			var question = main._itemsCorrect[main._indexBalloonCorrect].question;
			
			//se for order, na verdade apenas o item cujo indice é igual a _indexBalloonCorrect sera correto
			if (main._game.type == 'order') {
				main._indexCorrectItens = [];
				main._indexNotCorrectItens = [];
				for (var w = 0; w < main._items.length; w++) {
					if (w == main._indexBalloonCorrect) {
						main._indexCorrectItens.push(w);
					}
					else {
						main._indexNotCorrectItens.push(w);
					}
				}
			}
			
			// muda texto do enunciado
			if (main._game.appendMessage) {
				$('.t_text p.t_text_sub').remove();
				if (gameConfig.debug && main._game.type == 'order') {
					$('.t_text').append('<p class="t_text_sub">' + question + ' (Correct index: ' + main._indexBalloonCorrect + ')' + '</p>');
				}
				else {
					$('.t_text').append('<p class="t_text_sub">' + question + '</p>');
				}
			}
			else {
				if (gameConfig.debug && main._game.type == 'order') {
					$('.t_text').html(question + ' (Correct index: '+ main._indexBalloonCorrect + ')');
				}
				else {
					$('.t_text').html(question);
				}
			}
			
			// Toca enunciado da proxima questao
			var nextQuestionSoundMessage = main._itemsCorrect[main._indexBalloonCorrect].soundMessage;
			if (nextQuestionSoundMessage) {
				sound.setMessageSound(nextQuestionSoundMessage);
			}
		},

		/**
		 * Cria um novo item que nao seja o certo
		 *
		 */
		createNewItem : function() {
			var not_found = true;
			do {
				if (!main._items[main._indexBalloon]) {
					main._indexBalloon = 0;
				}

				if (main._items[main._indexBalloon].id != main._idIndexBalloon) {
					main.createItem(main._items[main._indexBalloon]);
					not_found = false;
				}
				main._indexBalloon++;
			} while(not_found);
		},
		
		/**
		 * Verificação do fim do jogo
		 *
		 */
		checkFinish : function() {
			main._isGameRunning = false

			$('body').find('*').stop();

			main.clearStage();
			scores.pauseTime();

			setTimeout(function(){ system.scoreboard() }, 500);
		},
		
		/**
		 * Limpa as informações antiga
		 *
		 */
		clearStage : function(){
			$('body').find('*').stop();

			$('.balloon').each(function() {
				clearTimeout($(this).data('idAnimation'));
				clearTimeout($(this).data('idTimeout'));
			});

			$('.balloon').remove();

			main._acertosItemCorrente = 0;
			main._balloons = new Array();
			main._enunciadoTocou = false;
		}
	};
	
	return main;
};