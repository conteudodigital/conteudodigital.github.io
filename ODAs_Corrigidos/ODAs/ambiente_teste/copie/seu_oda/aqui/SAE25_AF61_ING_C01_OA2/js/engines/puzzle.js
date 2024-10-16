var puzzle = new function() {

	var main = null;

	main = {

		_droppableItemsId 	: '',
		_droppableItems 	: null,
		_draggableItemsId 	: '',
		_draggableItems 	: null,
		_config 			: null,

		/**
		 * Indice da fase
		 *
		 */
		_stageIndex 		: 0,

		/**
		 * Identificacao da etapa atual
		 *
		 * var int
		 */
		_stageNumber 		: 0,
		
		_totalDraggableImagesCount: 0,
		
		/**
		 * Identificacao do grupo de etapas
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
		 * Informacoes da popup about
		 *
		 */
		_configAbout 		: null,

		/**
		 * Pontuacoes
		 *
		 */
		_userScores 		: null,

		/**
		 * Main menu
		 *
		 */
		_menuMarkup 		: null,

		/**
		 * Niveis do jogo
		 *
		 */
		_levels				: null,

		/**
		 * Informacoes de transicao
		 *
		 */
		_transition 		: null,

		/**
		 * Controle interno para uso de bloqueio de qualquer coisa
		 *
		 */
		_blocked 			: false,

		/**
		 * Inicia um nivel conforme parametros
		 *
		 */
		setLevel: function (group, level, num){
			main._currentGroup 	= group;
			main._stageNumber 	= num;
			main._stageIndex 	= level;

			if(main._stageNumber == 1) {
			  document.getElementById("container_menu").style.left = "52px";
			}
			else if(main._stageNumber == 2) {
			  document.getElementById("container_menu").style.left = "-8px";
			}
			else if(main._stageNumber == 3) {
			   document.getElementById("container_menu").style.left = "48px";
			}
			else if(main._stageNumber == 4) {
			  document.getElementById("container_menu").style.left = "17px";
			}
			else {
			  document.getElementById("container_menu").style.left = "67px";
			}
			
			$('.barra_principal').show();
			$('.barra_principal2').hide();
			$('.bt_home').show();
			$('.bt_close').hide();
			$('.points_time').css('visibility', 'visible');
			$('.game_area_all').show();
			
			$('.openInfo').hide();
			
			main.getMenuMarkup().hide();
			main.startNew();
		},

		/**
		 * Inicializacao do jogo
		 *
		 */
		start : function() {
			sound.turnOnBackground();
			main.setControlButton();
		},

		/**
		 * Iniciacao de uma nova fase
		 *
		 */
		startNew : function() {
			$('.tuto_content').css('visibility', 'visible');

			main.setInitialization();
			main.clearStage();
			main.createStage();

			scores.timeHandler();
		},

		/**
		 * Definicoes iniciais
		 *
		 */
		setInitialization : function() {
			var config = system.getConfig();

			// randomizar?
			if (config.draggableItems.randomItem) {
				config.draggableItems.items = shuffle(config.draggableItems.items);
			}
			
			main._droppableItems 	= config.droppableItems;
			main._droppableItemsId 	= '#div_area_puzzle #droppableItems';
			main._draggableItems 	= config.draggableItems;
			main._draggableItemsId 	= '#div_area_puzzle #draggableItems';
			main._transition 		= config.transition;
			
			// esconde o enunciado padrao
			$('.tuto_content').hide();
			$('#div_area_puzzle #puzzle-feedback').remove();
			
			// define novo intro
			$('.topo .introbox-container').show();
			
			// define novo intro
			$('.topo .btn_intro').show();
			$('.introbox .content p').html(config.message);
			$('.introbox .btn_audio').unbind("click").click(function(e) {
				sound.setMessageSound(config.soundMessage, function() {
					setTimeout(function(){
						system.hideIntroBox();
					}, 1000);
				});
				e.stopPropagation();
			}).trigger('click');
			system.showIntroBox(false, false);
			
			// esconde a janela de introducao apos alguns segundos
			var timeToHideIntroBox = (config.timeToHideIntroBox) ? config.timeToHideIntroBox : 0;
			if (timeToHideIntroBox > 0) {
				setTimeout(function(){ system.hideIntroBox() }, timeToHideIntroBox);
			}
			
			cfg = system.getConfig()
			
			initialScore = cfg.initialScore ? cfg.initialScore : 10;
			rightIncrement = cfg.rightIncrement ? cfg.rightIncrement : 2;
			wrongIncrement = cfg.wrongIncrement ? cfg.wrongIncrement : -1;
			
			scores.setInitialScore(initialScore);
			scores.setRightIncrement(rightIncrement);
			scores.setWrongIncrement(wrongIncrement);
			
			// tempo inicial
			scores._secCount = 0;
			scores._minCount = 0;
			scores.displayInfo();
			
			$('.bt_home').click(function() {
				puzzle.clearStage();
			});
		},

		/**
		 * Botoes de controle
		 *
		 */
		setControlButton : function() {
			$('.bt_voice').click(function() {
				sound.messageSound();
			}).bind('mousedown touchstart ', function() {
				$(this).addClass('bt_voice_press').removeClass('bt_voice');
			}).bind('mouseup touchend mouseleave', function() {
				$(this).addClass('bt_voice').removeClass('bt_voice_press');
			});
			
			$('.bt_info').click(function() {
				main.about();
			}).bind('mousedown touchstart ', function() {
				$(this).addClass('bt_info_press').removeClass('bt_info');
			}).bind('mouseup touchend mouseleave', function() {
				$(this).addClass('bt_info').removeClass('bt_info_press');
			});
			
			$('.bt_som_on').data('sound', true).click(function() {
				if ($(this).data('sound')) {
					$(this).data('sound', false);
					sound.turnOff();
					$(this).addClass('bt_som_off').removeClass('bt_som_on');
				}
				else {
					$(this).data('sound', true);
					sound.turnOn();
					$(this).addClass('bt_som_on').removeClass('bt_som_off');
				}
			}).bind('mousedown touchstart ', function() {
				if ($(this).data('sound')) {
					$(this).addClass('bt_som_on_press').removeClass('bt_som_on');
				}
				else {
					$(this).addClass('bt_som_off_press').removeClass('bt_som_off');
				}
			}).bind('mouseup touchend mouseleave', function() {
				if ($(this).data('sound')) {
					$(this).addClass('bt_som_on').removeClass('bt_som_on_press');
				}
				else {
					$(this).addClass('bt_som_off').removeClass('bt_som_off_press');
				}
			});

			$('.bt_music_on').data('sound', true).click(function() {
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
			}).bind('mouseup touchend mouseleave', function() {
				if ($(this).data('sound')) {
					$(this).addClass('bt_music_on').removeClass('bt_music_on_press');
				}
				else {
					$(this).addClass('bt_music_off').removeClass('bt_music_off_press');
				}
			});
			
			$('.bt_close').click(function() {
			}).bind('mousedown touchstart ', function() {
				$(this).addClass('bt_close_press').removeClass('bt_close');
			}).bind('mouseup touchend mouseleave', function() {
				$(this).addClass('bt_close').removeClass('bt_close_press');
			});
			
			$('.bt_home').click(function() {
				if (main.isBlocked()) {
					return 0;
				}
				$('body').find('*').stop(true, true);
				puzzle.clearStage()
				
				main.showInitialMenu();
			}).bind('mousedown touchstart ', function() {
				$(this).addClass('bt_home_press').removeClass('bt_home');
			}).bind('mouseup touchend mouseleave', function() {
				$(this).addClass('bt_home').removeClass('bt_home_press');
			});
		},
		
		/**
		 * Criacao de uma fase
		 */
		createStage : function() {
			$('#div_area_puzzle').show();
			$('#div_area_puzzle .left_side').show();
			$('#div_area_puzzle .right_side').show();
			
			$(main._draggableItemsId).removeClass().addClass(main._draggableItems.areaClass);
			
			var l = 0;
			//criando os itens draggables
			
			main._totalDraggableImagesCount = main._draggableItems.items.length;
			
			loaded_one_callback = function() {
				main._totalDraggableImagesCount--;
				if (main._totalDraggableImagesCount == 0) {
					loaded_all_callback();
				}
			}
			
			loaded_all_callback = function() {
				main.createCarousel();
				$(".pecasDrag").css("visibility", "visible");
			}
			
			tmpImages = [];
			
			for (var i in main._draggableItems.items) {
				main.createDraggableItem(main._draggableItems.items[i]);
				
				tmpImage = new Image();
				tmpImage.src = main._draggableItems.items[i].img;
				tmpImage.onload = loaded_one_callback;
				
				l += main._draggableItems.items[i].height + 20;
			}
			
			levelClassName = "level" + system._stageIndex;
			$('#div_area_puzzle, body').removeClass().addClass(levelClassName);
			
			$(main._draggableItemsId).css({height:l});
			$('#menu_area').removeClass().addClass(main._draggableItems.menuClass);

			$(main._droppableItemsId).removeClass().addClass(main._droppableItems.areaClass);
			//criando os itens droppable
			for(var i in main._droppableItems.items) {
				main.createDroppableItem(main._droppableItems.items[i]);
			}
		},
		
		/**
		 * Criando um item draggalbe
		 *
		 * @param item
		 */
		createDraggableItem : function(item) {
			var img = $('<img/>').draggable({
				containment 	:'body',
				appendTo 		:'body',
				helper 			:'clone',
				zIndex 			: 9999999,
				scroll 			: false,
				revert 			: function(dropped) {
					if (main._dropFind) {
						return false;
					}

					if ($(dropped).data('accept')) {
						$(dropped).data('accept', false);
						return false;
					}
					else {
						$(dropped).data('accept', false);
						return true;
					}
				},
				cursor :'pointer',
				stop : function(event, ui) {
					if ($(this).data('wrong')) {
						$(this).data('wrong', false);
						$(this).draggable("disable");
						main.animationOnWrong(this);
					}
					main._blocked = false;
				},
				opacity:main._draggableItems.opacity,
				start: function(event, ui) {
					$('.selectedElement').removeClass('selectedElement');
					$(this).addClass('selectedElement');
					main._dropFind = false;
					
					main._blocked = true;
					main._countDropError = 0;
				}
			}).data({
				'index' 	: item.index,
				'sound' 	: item.sound,
				'dimension' : {
					height:item.height,
					width:item.width
				}
			}).attr({
				src : item.img,
				item: 'drag'
			}).click(function() {
				main._dropFind = false;
				$('.selectedElement').removeClass('selectedElement');
				$(this).addClass('selectedElement');
				
				main._countDropError = 0;
			});
			
			$(main._draggableItemsId).append(
				$('<div></div>')
				.addClass(item.classItem)
				.css({
					visibility: "hidden" // Esconda todas as peças, pois elas serão mostradas apenas quando TODAS forem carregadas e posicionadas. O callback se encontra na createStage().
				})
				.append(img)
			);
		},

		/**
		 * Criando um item droppable
		 *
		 * @param item
		 */
		createDroppableItem : function(item) {
			$(main._droppableItemsId).append(
				$('<div></div>')
					.attr('item', 'drop')
					.addClass(item.classItem)
					.css({
						zIndex  : 1,
						width 	: item.width,
						height 	: item.height,
						top 	: item.top,
						left 	: item.left,
						opacity : 0
					})
					.droppable({
						drop: function(event, ui) {
							main.checkAcceptObject($(ui.draggable), $(this));
						},
						over: function (event, ui) {
							if (main.dropUsed($(this))) {
								return 0;
							}
							
							main._countDrop++;
							
							$(ui.draggable).data('wrong', false);
							$(this).data('accept', true);
						},
						out: function (event, ui) {
							if (main.dropUsed($(this))) {
								return 0;
							}
							
							main._countDrop--;
						},
						tolerance : 'intersect'
					})
					.data({
						acceptableItems : item.acceptableItems,
						dimension 		: {height:item.height, width:item.width},
						img 			: item.img
					})
					.click(function() {
						var selectedElement = $('.selectedElement');
						if (selectedElement.is('.ui-draggable')) {
							main.checkAcceptObject(selectedElement, $(this));
						}
						
						$('.selectedElement').removeClass('selectedElement');
						if (selectedElement.data('wrong')) {
						    selectedElement.data('wrong', false);

						    main.animationOnWrong(selectedElement);
						}
					})
					.append(
						!main._droppableItems.withImage?(
							item.img?$('<img>').css({
								width 	: item.width,
								height 	: item.height
							}).attr({
								src  : item.img,
								item : 'exemple'
							}):null
						):null
					)
			);
			
			if (item.feedArea) {
				$(main._droppableItemsId).append(
					$('<div id ="dvFeed"></div>').css({ //criado mais uma div pra fazer a animacao do feedback
						position:'absolute',
						height: item.feedArea.height,
						width: item.feedArea.width,
						top: item.feedArea.top,
						left: item.feedArea.left,
						borderRadius: item.feedArea.bordeRz
					}).data(
						'itemFeed', item.acceptableItems
					)
				);
			}
		},
		
		/**
		 * Faz dÃ¡ um feedback na Ã¡rea de aceite ao arrastar a peÃ§a
		 *
		 */
		feedbackDropArea : function(drop, opacity, back) {
			areaFeed = false;
			$(main._droppableItemsId).children('div').each(function() {
				if ($(this).data('itemFeed') == drop.data('acceptableItems')) {
					areaFeed = true;
					$(this).css({'opacity': .5, 'background':back});
				}
			});
			
			if (!areaFeed) {
				$(drop).css({'opacity': opacity, 'background':back});
			}
		},
		
		/**
		 * Verifica se jÃ¡ foi usada a Ã¡rea
		 *
		 * @param drop
		 * @returns {Boolean}
		 */
		dropUsed : function(drop) {
			var used = false;
			if (main._droppableItems.withImage) {
				if(drop.children('img[item="exemple"]').length) {
					used = true;
				}
			}
			else {
				if (!drop.children('img[item="exemple"]').length) {
					used = true;
				}
			}
			drop.data('accept', false);
			return used;
		},
		
		/**
		 * VerificaÃ§Ã£o de uma peÃ§a em um local
		 *
		 * @param drag
		 * @param drop
		 */
		checkAcceptObject : function(drag, drop) {
			if (main.dropUsed(drop)) {
				return 0;
			}
			if (main._dropFind) {
				return 0;
			}
			
			if (!inArray(drag.data('index'), drop.data('acceptableItems'))) {
				main._countDropError++;
				if (main._countDropError < main._countDrop) {
					return 0;
				}
				
				sound.errorSound();
				scores.wrongCount();
				drop.data('accept', false);
				drag.data({'wrong' : true});
				if (main._dragSelected) {
					main.animationOnWrong(drag);
				}
			}
			else {
				//desabilitar a acao do drag assim que dropar
				$(drag).off();
				
				drag.data('wrong', false);
				drop.data('accept', true);
				
				main._dropFind = true;
				
				// verifica se foi definido um som customizado senao toca um som padrao
				if (drag.data('sound')) {
					sound.sounds(drag.data('sound'));
				}
				else {
					sound.successSound();
				}
				
				if (main._droppableItems.withImage) {
					var img = $('<img>');
					$(img).css({
						width 	: drop.data('dimension').width,
						height 	: drop.data('dimension').height,
						opacity : 1
					}).attr({
						item 	: 'exemple',
						src 	: drop.data('img')
					});
					drop.css('opacity', 1);
					drop.append(img);
					
					main.animationOnCorrect(img);
					main.checkFinish();
				}
				else {
					drop.children('img[item="exemple"]').attr('item', 'teste');
					$(drop).animate({opacity:1}, 'fast', function(){
						main.checkFinish();
						
						//animacao do pointer
						main.showAnimatePoint(drop, '+' + scores._rightIncrement);
					});
				}
				
				//Some e depois diminui de tamanho para a peça do lado vir pra esquerda
				$(drag).parent().animate({ opacity: 0 }, "slow", function() {
					$(this).hide("fast", function() {
						var p = $(this).parent();
						$(this).remove();
						
						biggestFirstColumnWidth = 0
						
						allDrags = $(".pecasDrag");
						
						for (var i = 0; i < allDrags.length; ++i) {
							if (i%2 == 0 && allDrags.eq(i).width() > biggestFirstColumnWidth) {
								biggestFirstColumnWidth = allDrags.eq(i).width()
							}
						}
						
						for (var i=0; i<$(".pecasDrag").length; ++i) {
							thisDrag = $(".pecasDrag").eq(i);
							thisDragPrev = i > 0 ?  $(".pecasDrag").eq(i-1) : null;
							
							thisDragMarginTop = ~~((thisDrag.parent().height() - thisDrag.height()) / 2);
							
							if (i%2 == 1) {
								thisDragMarginLeft = biggestFirstColumnWidth - thisDragPrev.width() + 5;
							}
							else {
								thisDragMarginLeft = 5;
							}
							
							thisDrag.css({"margin-top": thisDragMarginTop})
							thisDrag.css({"margin-left": thisDragMarginLeft})
						}
						
						if ($(p).children("div").length == 0) {
							$(p).hide("fast", function(){
								$(this).remove();
							});
						}
						else if ($(p).next().children("div").length > 0) {
							//Traz as peças para cima, para ocupar o espaço que ele deixou
							var next = $(p).next();
							var chegouNoUltimo = false;
							while (!chegouNoUltimo) {
								$(next).children("div").first().appendTo($(p));
								
								p = next;
								next = $(p).next();
								
								if ($(next).children("div").length == 0) {
									chegouNoUltimo = true;
								}
							}
							
							if ($(p).children("div").length == 0) {
								$(p).remove();
							}
						}
					});
				});
				
				scores.correctCount();
			}
			
			main._countDrop = 0;
			main._countDropError = 0;
			scores.displayInfo();
		},
		
		/**
		 * Verificacao do fim do jogo
		 *
		 */
		checkFinish : function() {
			var gameOver = true;
			$(main._droppableItemsId).children('div[item="drop"]').each(function(i, v) {
				// com imagem?
				if (main._droppableItems.withImage) {
					if(!$(v).children('img[item="exemple"]').length){
						gameOver = false;
					}
				}
				else {
					if($(v).children('img[item="exemple"]').length){
						gameOver = false;
					}
				}
			});
			
			if (gameOver) {
				scores.pauseTime();
				setTimeout(function() {
					var config = system.getConfig();
					if(config.soundFinish){
						sound.stopAllSound();
						sound.sounds(config.soundFinish);
					}
					
					main.transitionScreen();
				}, 1000);
			}
		},
		
		/**
		 * Verificando se o jogo terminou
		 *
		 */
		isGameOver : function() {
			return main._config[main._stageIndex + 1] ? false : true;
		},
		
		/**
		 * Limpa as informaÃ§Ãµes antiga
		 *
		 */
		clearStage : function() {
			$(main._draggableItemsId).empty();
			$(main._droppableItemsId).empty();
			
			levelClassName = "level" + system._stageIndex
			$('#div_area_puzzle').removeClass(levelClassName);
		},
		
		/**
		 * AnimaÃ§Ã£o de retorno de erro
		 *
		 * @param drag
		 */
		animationOnWrong : function(drag) {
			$(drag).animate({rotate:-10}, 125, function() {
				$(this).animate({rotate:10}, 125, function() {
					$(this).animate({rotate:-10}, 125, function() {
						$(this).animate({rotate:10}, 125, function() {
							$(this).animate({rotate:0}, 125, function() {
								main._blocked = false;
								$('.ui-draggable').draggable("enable");
								$('.selectedElement').removeClass('selectedElement');
							});
						});
					});
				});
			});
		},
		
		/**
		 * Ajuste do conteudo do drag para alinha no centro
		 *
		 * @param drag
		 */
		fixDragContent : function(drag) {
			var l = 0, c = 0;
			
			$(main._draggableItemsId + ' div').each(function(){
				$(this).children('.pecasDrag').each(function(){
					l +=$($(this).children('img').get(0)).data('dimension').height + 20;
					c++;
				});
			});
			
			l -= drag.data('dimension').height;
			l = l/2;
			$(main._draggableItemsId).animate({height:l}, 'fast');
			
			if ($(main._draggableItemsId).children('div').length <= system.getConfig().carousel.totalItems) {
				$('.bt_left, .bt_right').unbind('click').css('visibility', 'hidden');
			}
		},
		
		/**
		 * Animacao quando uma peca eh colocada no local correto
		 *
		 */
		animationOnCorrect : function(drag) {
			$(drag).animate({rotate:360}, 400, function() {
				main._blocked = false;
			});
		},
		
		/**
		 * Creating carousel animation
		 *
		 */
		createCarousel : function(w) {
			var config = system.getConfig();
			$('#container_menu').css({
				width : config.carousel.width,
				height : config.carousel.height + 30
			});
			
			var newDiv = null;
			var biggestWidth = 0;
			
			if (typeof config.carousel.totalItems == "undefined") {
				config.carousel.totalItems = 2;
			}
			
			$(main._draggableItemsId).children('.pecasDrag').each(function(k, v) {
				if (k % config.carousel.totalItems === 0) {
					newDiv = $('<div></div>').css({
						margin 	: '10px 0 0 5px',
						height 	: $(this).height(),
						width 	: $("#container_menu").width()
					});
					
					lastHeight = $(this).height();
					$(main._draggableItemsId).append(newDiv);
				}
				else if ($(this).height() > lastHeight) {
					newDiv.height($(this).height());
				}
				
				if ($(this).width() > biggestWidth) {
					biggestWidth = $(this).width();
				}

				newDiv.append(this);
			});
			
			for (var i = 0; i < $(".pecasDrag").length; ++i) {
				thisDrag = $(".pecasDrag").eq(i);
				
				marginFromTop = ~~((thisDrag.parent().height() - thisDrag.height()) / 2);
				
				if (i % config.carousel.itemsShowing == 1) {
					marginFromLeft = biggestWidth - thisDrag.prev().width() + 5;
				}
				else {
					marginFromLeft = 5;
				}
				
				thisDrag.css('margin', marginFromTop + 'px 5px 0px ' + marginFromLeft + 'px');
			}
			
			if ($(main._draggableItemsId).children('div').length <= config.carousel.totalItems) {
				$('.bt_left, .bt_right').unbind('click').css('visibility', 'hidden');
			}
			else {
				$('.bt_left, .bt_right').unbind('click').css('visibility', 'visible');
				
				$('.bt_right').click(function() {
					$(main._draggableItemsId).css({
						position: 'relative',
						left: 0
					}).stop(true, true).animate({top:-config.carousel.sizeMove}, 'fast', function() {
						$(this).append($(this).children('div:first'));
						$(this).css({
							position:'',
							top:0
						});
					});
				});
				
				$('.bt_left').click(function() {
					$(main._draggableItemsId).css({
						position:'relative',
						top:-config.carousel.sizeMove
					});
					
					$(main._draggableItemsId).children('div:first').before($(main._draggableItemsId).children('div:last'));
					$(main._draggableItemsId).stop(true, true).animate({top:0}, 'fast', function() {
						$(this).css({
							position:''
						});
					});
				});
			}
		},
		
		/**
		 * AnimaÃ§Ã£o do movimento
		 * @param option
		 * - idFrom
		 * - html
		 * - topEnd
		 * - topEndOpcity
		 * - width
		 * - height
		 * - functionEnd
		 */
		animatePoint : function(option){
			var l = $(option.idFrom).position().left,
				t = $(option.idFrom).position().top,
				h = $(option.idFrom).height(),
				w = $(option.idFrom).width(),
				
				o = $('<div></div>').css({
					width: option.width,
					height: option.height,
					position: 'absolute',
					left: l + w / 2 - option.width / 2,
					top: t + h / 2 - option.height / 2,
					zIndex:9999
				}).html(option.html);
				
				$(main._droppableItemsId).append(o);
				$(o).data('option', option).animate({top:option.topEnd, left:option.leftEnd}, 1000, function() {
					if (!$(this).data('option')) {
						return 0;
					}
					var option = $(this).data('option');
					if (!this) {
						return 0;
					}
					
					$(this).animate({top:option.topEndOpcity, opacity:0}, 1000, function() {
						option.functionEnd();
						$(this).remove();
					});
				});
		},
		
		/**
		 * Animacoes de pontuacao
		 *
		 */
		showAnimatePoint : function(drop, point) {
			main.animatePoint({
				idFrom:drop,
				html: $('<div">'+point+'</div>').css({
					color 			: '#f1d1ae',
					background 		: '#66481f',
					width 			: 50,
					height 			: 50,
					textAlign 		: 'center',
					display 		: 'table-cell',
					verticalAlign 	: 'middle',
					fontWeight 		: 'bold',
					opacity 		: 0.8
				}),
				topEnd: -155,
				leftEnd: $(".div_score").offset().left - $("#droppableItems").offset().left - 20,
				topEndOpcity: -130,
				width: 50,
				height: 50,
				functionEnd:function(){}
			});
		},
		
		/**
		 * Exibe a tela de transiÃ§Ã£o apÃ³s tÃ©rmino do level, se houver essa tela
		 *
		 */
		transitionScreen : function() {
			$('.tuto_content').css('visibility', 'hidden');
			
			// Tem feedback de transicao?
			if (main._transition) {
				// Esconde area esquerda e direita do jogo
				$('#div_area_puzzle .left_side, #div_area_puzzle .right_side').hide();
				
				$('#div_area_puzzle')
				.append(
					$('<div id="puzzle-feedback">').html(
						'<img class="puzzleFeedbackImage" src="' + main._transition.img + '">' +
		                '<div class="puzzleFeedbackText">' + main._transition.text + '</div>' +
						'<div class="puzzleFeedbackButton">Continuar</div>'
					)
				);
				
				// Adiciona um botao para passar pra proximo nivel
				$('#div_area_puzzle #puzzle-feedback .puzzleFeedbackButton').click(function() {
					sound.stopAllSound();
					system.scoreboard();
				});
			}
			else {
				// Esconde area direita do jogo e mantem area que foi montada
				$('#div_area_puzzle .right_side').hide();
				
				sound.stopAllSound();
				system.scoreboard();
			}
		},

		/**
		 * Verifica se o _blocked esta ativo
		 *
		 */
		isBlocked : function() {
			return false;
			if (main._blocked || $('ui-draggable-dragging').lenght) {
				return true;
			}
			return false;
		}
	};
	
	return main;
}