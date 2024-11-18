var system = new function(){
	var main = null;

	main = {

		/**
		 * Id da área de arraste
		 *
		 */
		_droppableItemsId 	: '',

		/**
		 * Array de itens de arraste
		 *
		 */
		_droppableItems 	: null,

		/**
		 * Id da área de arrastáveis
		 *
		 */
		_draggableItemsId 	: '',

		/**
		 * Array de itens arrastáveis
		 *
		 */
		_draggableItems 	: null,

		/**
		 * Arquivo de configurações
		 *
		 */
		_config 			: null,

		/**
		 * Indice da fase
		 *
		 */
		_stageIndex 		: 0,

		/**
		 * Identificação da etapa atual
		 *
		 * var int
		 */
		_stageNumber 		: 0,

		/**
		 * Identificação do grupo de etapas
		 *
		 *
		 */
		_currentGroup 		: 0,

		/**
		 * Contador de drops com over
		 *
		 */
		_countDrop 			: 0,

		/**
		 * Contador de drops com erro
		 *
		 */
		_countDropError 	: 0,

		/**
		 * Flag q identifica se o elemento de drag foi aceito no drop
		 *
		 */
		_dropFind 			: false,

		/**
		 * Drag selecionado
		 *
		 */
		_dragSelected 		: null,

		/**
		 * Informações da popup about
		 *
		 */
		_configAbout 		: null,

		/**
		 * Pontuações
		 *
		 */
		_userScores 		: null,

		/**
		 * Main menu
		 *
		 */
		_menuMarkup 		: null,

		/**
		 * Níveis do jogo
		 *
		 */
		_levels				: null,

		/**
		 * Configurações de transição
		 *
		 */
		_transition			: null,

		/**
		 * Controle interno para uso de bloqueio de qualquer coisa
		 *
		 */
		_blocked 			: false,


		_lockedScreen : null,
		_introBoxTimeout : null,

		_gameIntroLoaded : false,

		/**
		 * Obtem as informações do nivel
		 *
		 */
		getLevelInfo: function(level){
			var u = main.getUserScores();
			for (var i in u)
				if (u[i].level_index == level)
					return u[i];

			return false;
		},

		/**
		 * Verifica se o nivel eh jogável
		 *
		 */
		hasPlayedLevel: function(level){
			return Boolean(main.getLevelInfo(level));
		},

		/**
		 * Verifica se o nivel estar bloqueado
		 *
		 */
		isLevelLocked : function (dependency) {
			if (dependency.length > 0)
				return (!this.hasPlayedLevel(dependency[0]));
			else
				return false
		},

		/**
		 * Obtem o total de estralas de um nivel
		 *
		 */
		getStarsCount: function (level){
			return main.getLevelInfo(level).stars;
		},

		/**
		 * Obtem o total de estrelas
		 *
		 */
		getTotalStarsCount: function(){
			var totalStars = 0,
				u = main.getUserScores();

			for (var i in u)
				totalStars += parseInt(u[i].stars);

			return totalStars
		},

		/**
		 * Obtem a pontuação do nivel
		 *
		 */
		getScore: function(level){
			if (!main.hasPlayedLevel(level))
				return 0
			return main.getLevelInfo(level).score + main.getLevelInfo(level).bonus_score
		},

		/**
		 * Obtem o total de pontuação
		 *
		 */
		getTotalScore: function (){
			var totalScore = 0,
				u = main.getUserScores();

			for (var i in u)
				totalScore += parseInt(u[i].score + u[i].bonus_score);

			return totalScore
		},

		/**
		 *	Verifica se o nivel atual eh o ultimo dentro do grupo
		 *
		 */
		isLastLevelInGroup: function() {
			var curr_level = 0;
			for ( group in levels ) {
				for ( level in levels[group].levels ) {
					level = parseInt(level);
					if (curr_level == main._stageIndex && (level + 1) == levels[group].levels.length)
						return true;
					curr_level++;
				}
			}
			return false;
		},

		/*
		 *	Mostra mensagem de carregando no menu do jogo
		 */
		menuLoading: function(show) {
			var mensagem = ((gameConfig.msgCarregando) ? gameConfig.msgCarregando : 'Aguarde, carregando...');
			if (show) {
				$('#game_container').append(
					$('<div class="loading"></div>')
					.html('<img src="img/carregando.gif" /><p>' + mensagem + '</p>')
				)
			} else {
				$('.loading').remove()
			}
		},

		/**
		 * Exibe o menu inicial
		 *
		 */
		showInitialMenu: function () {
			scores.counterReset()
			scores.pauseTime();
			sound.stopAllSound();
			$("#btn-info").show();

			// esconde
			$('.time_score').css('visibility', 'hidden');
			$('.actions .bt_home').css('visibility', 'hidden');
			$('.btn_intro').css('visibility', 'hidden');
			$('.quick_feedback').css('visibility', 'hidden');
			$('.game_area_all').hide();
			$('#secondary-audio').hide();

			// mostra
			$('.logo').show();

			main.clearStage();
			system.menuLoading(true);

			levelHandler.getScoreData(function(data) {
				system.setUserScores(data);

				$('.actualMenu').remove();
				system.createMenuMarkup();

				$('.barra_principal').show();

				system.menuLoading(false);
				main.getMenuMarkup().show();
			});
		},

		/**
		 * Inicia um nivel conforme parâmetros
		 *
		 */
		setLevel: function (group, level, num) {
			main._currentGroup 	= group;
			main._stageNumber 	= num;
			main._stageIndex 	= level;

			$('.time_score').css('visibility', 'visible');
			$('.actions .bt_home').css('visibility', 'visible');
			$('.btn_intro').css('visibility', 'visible');

			$('.game_area_all').show();

			// esconde logo ao entrar em um nivel
			$('.logo').hide();
			$('.openInfo').hide();

			main.getMenuMarkup().hide();
			main.startLevel();
		},

		/**
		 *	Esconde todas as areas de jogos (estrutura html)
		 */
		hideAllGameAreas : function() {
			// remove a introducao do jogo se visivel
			if ($('.game_intro').length > 0)
				$('.game_intro').remove();

			$('#div_area_puzzle').hide();
			$('#div_area_association').hide();
			$('#div_area_memory').hide();
			$('#div_area_burst').hide();
			$('#div_area_crossword').hide();
			$('.div_area_who').hide();
		},

		/**
		 * Verifica qual o tipo da fase pra carregar a engine certa
		 *
		 */
		startLevel: function() {
			// esconde todos os jogos antes de iniciar novo nivel
			main.hideAllGameAreas();

			$("#btn-info").hide();
			var config = main.getConfig();

			switch (config.typeLevel) {
				// quebra cabeca
				case 'puzzle':
					main._itemsLength = config.droppableItems.items.length;
					return puzzle.startNew();

				// estouro de objetos
				case 'burst':
					main._itemsLength = config.items.length;
					return burst.startNew();

				// associacao
				case 'association':
					main._itemsLength = config.droppableItems.items.length;
					return association.startNew();

				// memoria
				case 'memory':
					main._itemsLength = (config.cards.length / config.numberCardsCorrect);
					return memory.startNew();

				// memoria com deck
				case 'memory_deck':
					main._itemsLength = (config.cards.length / config.numberCardsCorrect);
					return memoryDeck.startNew();

				// cruzadinha
				case 'crossword':
					main._itemsLength = (config.hints.length)
					return crossword.startNew();

				// quem sou eu
				case 'who':
					main._itemsLength = who.getHintsCount();
					return who.startNew();
			}
		},

		/**
		 * Inicialização do jogo
		 *
		 */
		start : function() {
			// No iOS e Android KitKat, a música não iniciará automaticamente
			if (!bowser.ios && !(bowser.android && versionCompare(bowser.osversion, "4.4") >= 0)) {
				sound.turnOnBackground();
			}
			main.setControlButton();
		},

		/**
		 * Definição do array config
		 *
		 * @param config
		 */
		setConfig : function(config){
			main._config = config;
		},

		/**
		 * Obtem o config da fase atual
		 *
		 * @returns
		 */
		getConfig : function(){
			return main._config[main._stageIndex];
		},

		/**
		 * Definição do teste de ajuda
		 *
		 */
		setConfigAbout : function(configAbout){
			main._configAbout = configAbout;
		},

		/**
		 * Obtem o teste de ajuda
		 *
		 */
		getConfigAbout : function(){
			return main._configAbout;
		},

		/**
		 * Definição das pontuações do usuário
		 *
		 */
		setUserScores : function(userScores){
			main._userScores = userScores;
		},

		/**
		 * Obtem as pontuações do usuário
		 *
		 */
		getUserScores : function(){
			return main._userScores ;
		},

		/**
		 * Definição do menuMarkup
		 *
		 */
		setMenuMarkup : function(menuMarkup){
			main._menuMarkup = menuMarkup;
			$('body').append(main._menuMarkup);
		},

		/**
		 * Obtem o menuMarkup
		 *
		 */
		getMenuMarkup : function(menuMarkup){
			return main._menuMarkup;
		},

		/**
		 * Definição dos níveis do jogo
		 *
		 */
		setLevels : function(levels){
			main._levels = levels;
		},

		/**
		 * Obtem os níveis do jogo
		 *
		 */
		getLevels : function(){
			return main._levels;
		},

		/**
		 * Iniciação de uma nova fase
		 *
		 */
		startNew : function(){
			//isso eh para caso tenha ido para a tela de transição
			$('.tuto_content, #menu_area').css('visibility', 'visible');

			main.setInitialization();
			main.clearStage();
			main.createStage();
			scores.timeHandler();
		},

		/**
		 * Definições iniciais
		 *
		 */
		setInitialization : function(){
			var config = main.getConfig();

			if(config.draggableItems.randomItem){
				config.draggableItems.items = shuffle(config.draggableItems.items);
			}

			main._droppableItems 	= config.droppableItems;
			main._droppableItemsId 	= '#droppableItems';
			main._draggableItems 	= config.draggableItems;
			main._draggableItemsId 	= '#draggableItems';
			main._transition 		= config.transition;
			sound.setMessageSound(config.soundMessage);

			$('.div_text div').html(config.message);

			//pontuação inicial
			scores._corrects = 10;

			//tempo inicial
			scores._secCount = 0;
			scores._minCount = 0;
			scores.displayInfo();
		},

		/**
		 * Botões de controle
		 *
		 */
		setControlButton : function(){
			$('.bt_voice').click(function(){
				sound.messageSound();
			}).bind('mousedown touchstart ', function(){
				$(this).addClass('bt_voice_press').removeClass('bt_voice');
			}).bind('mouseup touchend mouseleave', function(){
				$(this).addClass('bt_voice').removeClass('bt_voice_press');
			});

			$('.bt_info').click(function(){
				main.about();
			}).bind('mousedown touchstart ', function(){
				$(this).addClass('bt_info_press').removeClass('bt_info');
			}).bind('mouseup touchend mouseleave', function(){
				$(this).addClass('bt_info').removeClass('bt_info_press');
			});

			$('.bt_som_on').data('sound', true).click(function(){
				if($(this).data('sound')){
					$(this).data('sound', false);
					sound.turnOff();
					$(this).addClass('bt_som_off').removeClass('bt_som_on');
				}else{
					$(this).data('sound', true);
					sound.turnOn();
					$(this).addClass('bt_som_on').removeClass('bt_som_off');
				}
			}).bind('mousedown touchstart ', function(){
				if($(this).data('sound')){
					$(this).addClass('bt_som_on_press').removeClass('bt_som_on');
				}else{
					$(this).addClass('bt_som_off_press').removeClass('bt_som_off');
				}
			}).bind('mouseup touchend mouseleave', function(){
				if($(this).data('sound')){
					$(this).addClass('bt_som_on').removeClass('bt_som_on_press');
				}else{
					$(this).addClass('bt_som_off').removeClass('bt_som_off_press');
				}
			});
			
			var currentMusicButton = "bt_music_on";
			var hasSound = true;
			if (bowser.ios || (bowser.android && versionCompare(bowser.osversion, "4.4") >= 0)) {
				// No iOS e Android KitKat, a música não iniciará automaticamente
				currentMusicButton = "bt_music_off";
				hasSound = false;
				$(".bt_music_on").addClass("bt_music_off").removeClass("bt_music_on");
			}
			
			$("." + currentMusicButton).data("sound", hasSound).click(function() {
				if ($(this).data('sound')) {
					$(this).data('sound', false);
					sound.turnOffBackground();
					$(this).addClass('bt_music_off').removeClass('bt_music_on');
				}
				else {
					$(this).data('sound', true);
					sound.turnOnBackground();
					$(this).addClass('bt_music_on').removeClass('bt_music_off');
				}
			}).bind('mousedown touchstart ', function() {
				if ($(this).data('sound')) {
					$(this).addClass('bt_music_on_press').removeClass('bt_music_on');
				}
				else {
					$(this).addClass('bt_music_off_press').removeClass('bt_music_off');
				}
			}).bind('mouseup touchend mouseleave', function(){
				if ($(this).data('sound')) {
					$(this).addClass('bt_music_on').removeClass('bt_music_on_press');
				}
				else {
					$(this).addClass('bt_music_off').removeClass('bt_music_off_press');
				}
			});

			$('.bt_close').click(function(){
			}).bind('mousedown touchstart ', function(){
				$(this).addClass('bt_close_press').removeClass('bt_close');
			}).bind('mouseup touchend mouseleave', function(){
				$(this).addClass('bt_close').removeClass('bt_close_press');
			});

			$('.bt_home').click(function(){
				if (main.isBlocked()) return;

				$('body').find('*').stop(true, true);
				main.showInitialMenu()

			}).bind('mousedown touchstart ', function(){
				$(this).addClass('bt_home_press').removeClass('bt_home');
			}).bind('mouseup touchend mouseleave', function(){
				$(this).addClass('bt_home').removeClass('bt_home_press');
			});
		},

		/**
		 * Verificando se o jogo terminou
		 *
		 */
		isGameOver : function(){
			return main._config[main._stageIndex+1]?false:true;
		},

		/**
		 * Verifica se um objeto já foi instanciado para poder chamar a função de callback.
		 * Se o objeto ainda não existe, fica insistindo
		 */
		_checkForAssetsIntervals: [],
		checkForAssets: function(callback, objectName, interval) {
			try {
				callback();
			}
			catch (err) {


				main._checkForAssetsIntervals[objectName] = setInterval(function() {
					if (typeof window[objectName] != "undefined") {
						callback();
						clearInterval(main._checkForAssetsIntervals[objectName]);
					}
				}, interval);
			}
		},

		/**
		 * Limpa as informações antigas
		 *
		 */
		clearStage : function(){
			$(main._draggableItemsId).empty();
			$(main._droppableItemsId).empty();


			main.checkForAssets(function() {
				burst.clearStage();
			}, "burst", 100);

			main.checkForAssets(function() {
				association.clearStage();
			}, "association", 100);

			main.checkForAssets(function() {
				memory.clearStage();
			}, "memory", 100);

			main.checkForAssets(function() {
				memoryDeck.clearStage();
			}, "memoryDeck", 100);

			main.checkForAssets(function() {
				crossword.clearStage();
			}, "crossword", 100);

		},

		/**
		 * Exibe o ajuda
		 *
		 */
		about : function(hideBackground) {
			var _authorship = '', _design = '', _locution = '';

			//authorship
			_authorship = main.getConfigAbout().authorship.join('<br/>');

			//design and illustration
			_design = main.getConfigAbout().design.join('<br/>');

			//locution
			_locution = main.getConfigAbout().locution.join('<br/>');

			popup.lock = true;
			popup.backGroundShow(hideBackground).messageBoxShow(450,600,
				'<div class="header">'+
					'<div style="width: 100%; height: 60px;">'+
						'<div id="close'+(popup._indexPopupMessage+1)+'" class="close">'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="mainbody">'+
					'<div class="ContainerInfo">'+
						'<div class="iTxtHelp" style="font-size:12pt;">'+main.getConfigAbout().version+
						    '<p><b>Autoria</b><br/>'+_authorship+
							'<p><b>Design e Ilustração</b><br/>'+_design+
							'<p><b>Locução</b><br/>'+_locution+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="footer">'+
					'<div class="ContainerFooter"> '+
					'<div class="marcaPositivo">POSITIVO INFORMÁTICA</div>'+
					'</div>'+
				'</div>');

			$('#close'+popup._indexPopupMessage).data({
				indexB:popup._indexPopupBack,
				indexM:popup._indexPopupMessage
			}).click(function(){
				popup.lock = false;
				popup.close($(this).data('indexB'), $(this).data('indexM'));
				popup.lock = true;//como vai aparecer somente na tela inicial, quando fechar trancar novamente
			});

			$('.close').bind('mousedown touchstart', function(){
				$(this).removeClass('close').addClass('close-click');
			}).bind('mouseup touchend mouseleave', function(){
				$(this).removeClass('close-click').addClass('close');;
			});
		},

		/**
		 * Exibe a tela de transição de etapa - PLACAR
		 *
		 */
		scoreboard : function() {
			var min 	= (scores._minCount.toString().length == 1 ? '0' + scores._minCount.toString() : scores._minCount),
				sec 	= (scores._secCount.toString().length == 1 ? '0' + scores._secCount.toString() : scores._secCount),
				levels 	= main.getLevels();

			var config = main.getConfig();

			// numero atual do nivel desconsiderando seus grupos
			var curr_level_index = (main._stageIndex + 1);

			// numero atual do nivel dentro do grupo
			var curr_level = main._stageNumber;
			main._stageNumber++;

			// obtem o total de items de acordo com engine que foi usada
			var total_items = 0;
			if (config.typeLevel == 'burst') {
				if (config.game.type == 'default') {
					total_items = config.game.totalCorrectToNextLevel;
				}
				else {
					for (var i = 0; i < config.items.length; i++) {
						if (config.items[i].correct) {
							if (config.items[i].acertosNecessarios) {
								total_items += config.items[i].acertosNecessarios;
							}
							else {
								total_items += 1;
							}
						}
					}
				}
			}
			if (config.typeLevel == 'association')
				for (i in association._droppableItems.items)
					if (association._droppableItems.items[i].acceptableItems.length > 0)
						++total_items;
			if (config.typeLevel == 'puzzle')      total_items = puzzle._droppableItems.items.length;
			if (config.typeLevel == 'memory')      total_items = config.cards.length;
			if (config.typeLevel == 'memory_deck') total_items = config.cards.length;
			if (config.typeLevel == 'crossword')   total_items = config.hints.length;
			if (config.typeLevel == 'who') {
				for (i in config.groups)
					for (v in config.groups[i])
						total_items++;
			}

			// mostra janela de nivel concluido
			levelBox.type = (scores.getDied()) ? 'died' : 'points';

			// etapa atual
			levelBox.curr_level	= curr_level;

			//etapa atual desconsiderando grupos
			levelBox.curr_level_index = curr_level_index;

			// numero de etapas
			levelBox.num_level = levels[main._currentGroup].levels.length;

			// tempo de jogo
			levelBox.total_time = min + ':' + sec;

			// total de pontos maximos que o jogador pode fazer
			levelBox.total_points = scores._corrects;
			levelBox.total_drag_items = total_items;

			// multiplicador de bonus (pegando do config!)
			levelBox.bonus_min = ((config.bonusMinTime) ? config.bonusMinTime : 10);
			levelBox.bonus_multi = (config.bonusTimeMultiplier ? config.bonusTimeMultiplier : 5);

			// vai para proximo nivel
			levelBox.buttons.next_page = function() {
				// se for o ultimo nivel de um grupo volta para menu inicial
				if (main.isLastLevelInGroup()) {
					main.showInitialMenu();
				} else {
					main.clearStage()
					main._stageIndex++;
					//main.startNew();
					main.startLevel()
				}
				//popup.unlockScreen();
				levelBox.remove();
			};

			// recarregar etapa atual
			levelBox.buttons.reload = function() {

				main._stageNumber--;

				var config = main.getConfig();
				switch (config.typeLevel) {
					case 'puzzle':
						puzzle.startNew();
						main._itemsLength = main._stageIndex + 1;
						break;

					case 'burst':
						burst.startNew();
						main._itemsLength = config.items.length;
						break;

					case 'association':
						association.startNew();
						association._stageNumber = (main._stageIndex + 1);

						// mostra carrossel novamente caso tenha sido
						// escondido pela mensagem de transicao de pagina
						$('.jcarousel-wrapper').show();

						break;

					case 'memory':
						memory.startNew();
						memory._stageNumber = (main._stageIndex + 1);
						break;

					case 'memory_deck':
						memoryDeck.startNew();
						memoryDeck._stageNumber = (main._stageIndex + 1);
						break;

					case 'crossword':
						crossword.startNew();
						break;

					case 'who':
						who.startNew();
						break;
				}

				//popup.unlockScreen();
				levelBox.remove();
			};

			// volta para menu principal do jogo
			levelBox.buttons.home = function() {
				main.showInitialMenu();
				//popup.unlockScreen();
				levelBox.remove();
			};

			levelBox.create();
		},

		/**
		 * Criação do menu principal
		 *
		 */
		createMenuMarkup : function() {
			var levelCount = 0,
				menuMarkup,
				groupMarkup,
				thisGroupMarkup,
				levels = main.getLevels();

			menuMarkup = $('.container').clone();
			groupMarkup = $('.groupContainer');

			// verifica se sera mostrado introducao para jogo
			if (introAbout && (typeof introAbout != 'undefined')) {
				// introducao em formato de caixa com texto e som
				if (introAbout.type == 'box') {
					// remove a introducao do jogo
					if ($('.game_intro').length > 0)
						$('.game_intro').remove();

					$('.topo').after(
						$('<div></div>')
						.addClass('game_intro')
						.addClass('slideRight')
						.html('<p>' + introAbout.message + '</p>')
						.append(
							$('<a></a>')
							.attr('href', 'javascript:void(0)')
							.html('Tocar som')
							.click(function() {
								sound.setMessageSound(introAbout.sound);
							})
						)
					);
				}
				setTimeout(function() {
					// toca som de introducao automaticamente somente uma vez
					if (!system._gameIntroLoaded) {
						sound.setMessageSound(introAbout.sound);
						system._gameIntroLoaded = true;
					}
				}, 100);
			}

			// percorre grupos
			for (var group in levels) {
				thisGroupMarkup = groupMarkup.clone();
				thisGroupMarkup.css('display', 'inline-block')
				thisGroupMarkup.find('.title span').html(levels[group].title);

				if (levels[group].min_stars != 0) {
					if (main.getTotalStarsCount() >= levels[group].min_stars) {
						thisGroupMarkup.removeClass('content1').addClass('content4').find('.info').hide();
					} else {
						// Nivel do tipo extra
						thisGroupMarkup.removeClass('content1').addClass('content3').find('.info').hide()
						thisGroupMarkup.find('.title span').html('<h1>EXTRA</h1>');
						thisGroupMarkup.append('<strong>faltam ' + (levels[group].min_stars - main.getTotalStarsCount()) + '</strong>');
						thisGroupMarkup.append('<img src="img/main-menu/star2.png">');
					}
				} else {
					// Define texto de ajuda do nivel
					thisGroupMarkup.find('.openInfo h1').html(levels[group].help_title);
					thisGroupMarkup.find('.openInfo strong').html(levels[group].help_text);
				}

				// percorre niveis
				var totalLevelsInGroup = 0;
				for (var level in levels[group].levels) {
					level = parseInt(level);
					
					var levelMarkup = main.createLevelMarkup(group, levelCount, level);
					
					levelCount++;
					totalLevelsInGroup++;
					
					if (levels[group].levels.length % 2 == 0) {
						if (totalLevelsInGroup >= (levels[group].levels.length - 1)) {
							levelMarkup.css("margin-bottom", "0px");
						}
					}
					else {
						if (totalLevelsInGroup == levels[group].levels.length) {
							levelMarkup.css("margin-bottom", "0px");
						}
					}
					
					thisGroupMarkup
					.find('.levelWrapper')
					.append(levelMarkup);
				}

				// Verifica se nivel possui mais de 4 niveis de mostra mensagem indicativa
				if (totalLevelsInGroup > 4) {
					thisGroupMarkup
					.append('<div class="more-levels-available">&nbsp;</div>')
					.click(function() {
						var wrapper = $(this).find('.levelWrapper');
						wrapper.animate({ scrollTop: wrapper.height() }, 500);
					})
				}

				main._totalStars = (levelCount * 3);
				menuMarkup.find(".overview").append(thisGroupMarkup);
			}

			menuMarkup.addClass('actualMenu');

			// Ajuste para fazer scroll dos elementos horizontalmente caso necessario
			main.setMenuMarkup(menuMarkup);

			var totalGroupSize = levels.length * 330;
			var totalWindowSize = ~~ ($(window).width() * 0.95);
			if (totalGroupSize > totalWindowSize) {
				$(".actualMenu")
				.css('width', '95%')
				.tinyscrollbar({
					axis: "x",
					scrollInvert: true
				});

				setTimeout(function() {
					$(".actualMenu").data("plugin_tinyscrollbar").update();
				}, 1);
			}
			else {
				$(".actualMenu").find(".viewport").css("height", "472px");
				$(".actualMenu").find(".scrollbar").hide();
			}

			$('.icon').click(function(e){
				// Fecha todas as janelas de ajudas que estiverem abertas
				$('.openInfo').hide();
				// Mostra as informacoes de ajuda para este nivel
				$(this).find('.openInfo').show();
				e.stopPropagation();
			});

			$('.openInfo').click(function(){
				$(this).hide();
			});


		},

		/**
		 * Criação de um LevelMarkup
		 *
		 */
		createLevelMarkup : function(group, levelCount, level) {
			var levelMarkup 	= $('.levelContainer').clone(),
				levels 			= main.getLevels(),
				thisLevelScore 	= 0,
				thisLevelStars 	= 0;

			// Bloqueia o nivel caso ele dependa de algum outro
			if (main.isLevelLocked(levels[group].levels[level].depends_on)) {
				levelMarkup.addClass('lockedObject').find('.innerLockedObject').show();
			} else {
				levelMarkup.data({
					group 		: group,
					levelCount 	: levelCount,
					level 		: (level + 1)
				})
				.click(function(){
					main.setLevel($(this).data('group'), $(this).data('levelCount'), $(this).data('level'));
				});

				thisLevelScore = main.getScore(levelCount);
				thisLevelStars = main.getStarsCount(levelCount);

				//marque a quantidade de estrelas
				for (var i = 0; i < thisLevelStars; i++) {
					levelMarkup.find('.content_star .star2:first').removeClass('star2').addClass('star1');
				}

				//marque a quantidade de pontos
				levelMarkup.find('.score span').html(thisLevelScore);

				//mensagem de feedback
				levelMarkup.find('.text').show().find('strong').empty();
			}

			levelMarkup.find('.number').html(levels[group].levels[level].title);
			return levelMarkup;
		},

		/**
		 * Exibe a tela de transição após término do level, se houver essa tela
		 *
		 */
		transitionScreen : function(){
			$('.tuto_content, #menu_area').css('visibility', 'hidden');
			$(main._droppableItemsId).removeClass().html(
				'<div class="transBackContent">'+
	                '<div class="transTxtContent">'+main._transition.text+'</div> '+
				'</div>'+
				'<div class="transPic"><img src="'+main._transition.img+'"></div>'+
				'<div class="transBtNext"></div>'
			);
		},

		/**
		 * Verifica se o _blocked está ativo
		 *
		 */
		isBlocked : function(){
			if(main._blocked || $('ui-draggable-dragging').lenght){
				return true;
			}
			return false;
		},

		/**
		 *	Mostra janela de enunciado dentro do jogo
		 */
		showIntroBox: function(hide, blocked, closeCallback) {
			clearTimeout(main._introBoxTimeout);

			main._lockedScreen = $('<div></div>').css({
				background : ((blocked) ? '#000' : 'transparent'),
				opacity: ((blocked) ? 0.6 : 1),
				position:'fixed',
				height:'110%',
				width:'100%',
				top:0,
				left:0,
				zIndex:100
			}).click(function() {
				main.hideIntroBox();
				if (closeCallback) closeCallback();
			});
			$('body').append(main._lockedScreen);

			$('.introbox')
			.css({ zIndex: 101})
			.show('slow');

			// ao clicar em qualquer area da tela deve ser fechada
			$('.introbox .title, .introbox .content').click(function() {
				main.hideIntroBox();
				if (closeCallback) closeCallback();
			});

			// deve sumir depois de n segundos?
			if (hide) {
				main._introBoxTimeout = setTimeout(function() {
					main.hideIntroBox();
					if (closeCallback) closeCallback();
				}, 5000);
			}
		},

		/**
		 *	Esconde janela de enunciado dentro de um jogo
		 */
		hideIntroBox: function() {
			// desbloqueia tela
			if (main._lockedScreen)
				main._lockedScreen.remove();

			sound.stopAllSound();

			$('.introbox').hide('slow', function() {
				var config = main.getConfig();
				// memoria com deck inicia ao fechar enunciado
				if (config.typeLevel == 'memory_deck') {
					if (!memoryDeck._gameStarted) {
						memoryDeck.createStage();
						scores.timeHandler();
						memoryDeck._gameStarted = true;
					}
				}
				// memoria simples inicia ao fechar o enunciado
				if (config.typeLevel == 'memory') {
					if (!memory._gameStarted) {
						memory.createStage();
						scores.timeHandler();
						memory._gameStarted = true;
					}
				}
			});
		}

	};

	return main;
};

/**
 * Definições iniciais e o start para tudo, não deve ser desenvolvidado
 * código fonte nesse local, para manter a semântica do sistema
 *
 */
$(function(){
	//http://www.kendoui.com/blogs/teamblog/posts/11-10-03/using_cors_with_all_modern_browsers.aspx
	//https://github.com/dkastner/jquery.iecors
	$.support.cors = true;
	
	if (isChrome()) {
		$('body').bind('mousedown touchstart mouseup touchend mouseleave mousemove', function() {
		    hidden();
		});
	}
	
	// define nome do jogo
	var nome = ((gameConfig.nome) ? gameConfig.nome : '---');
	document.title = nome;

	/* esconde popups de "?" ao clicar na pagina */
	$('body').click(function() {
		if ($('div.openInfo').is(':visible')) {
			$('div.openInfo').hide();
		}
	});

	// definicoes e locals onde se encontra os arquivos de configuracoes
	system.setConfigAbout(configAbout); // gameconfig.js
	system.setConfig(config); // levelconfig.js
	system.setLevels(levels); // levelmenu.js
	system.start();

	system.showInitialMenu();
});