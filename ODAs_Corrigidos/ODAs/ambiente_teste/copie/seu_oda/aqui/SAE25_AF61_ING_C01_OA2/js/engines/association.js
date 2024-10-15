var association = new function() {
	var main = null;

	return main = {
		/**
		 * Id da área de arraste
		 *
		 */
		_droppableItemsId: '',

		/**
		 * Array de itens de arraste
		 *
		 */
		_droppableItems: null,

		/**
		 * Id da área de arrastáveis
		 *
		 */
		_draggableItemsId: '',

		// transicao de tela ao finalizar nivel (apresentado antes de gamificacao)
		_transition: null,

		/**
		 * Array de itens arrastáveis
		 *
		 */
		_draggableItems: null,

		/**
		 * Contador de drops com over
		 *
		 */
		_countDrop: 0,

		/**
		 * Contador de drops com erro
		 *
		 */
		_countDropError: 0,

		/**
		 * Flag q identifica se o elemento de drag foi aceito no drop
		 *
		 */
		_dropFind: false,

		/**
		 * Drag selecionado
		 *
		 */
		_dragSelected: null,

		_timeoutIntroBox: null,
		_isPlayingFeedbackSound: false,
		
		/**
		 * Iniciação de uma nova fase
		 *
		 */
		startNew : function() {
			main.setInitialization();
			main.clearStage();
			main.createStage();
			scores.timeHandler();
		},

		/**
		 * Definições iniciais
		 *
		 */
		setInitialization : function() {
			var config = system.getConfig();
			if (typeof config.draggableItems.randomItem != 'undefined') {
				config.draggableItems.items = shuffle(config.draggableItems.items);
			}

			main._droppableItems = config.droppableItems;
			main._droppableItemsId = '#div_area_association #droppableItems';
			main._draggableItems = config.draggableItems;
			main._draggableItemsId = '#div_area_association #draggableItems';
			main._transition = config.transition;

			// esconde o enunciado padrao
			$('.tuto_content').hide();
			$('#div_area_association #association-feedback').remove();
			$('.jcarousel-wrapper').show();
			$(main._droppableItemsId).show();
			$(main._draggableItemsId).show();

			// define novo intro
			$('.topo .introbox-container').show();
			$('.introbox .content p').html(config.message);
			$('.introbox .btn_audio').unbind("click").click(function(e) {
				sound.setMessageSound(config.soundMessage, function() {
					setTimeout(function() {
						system.hideIntroBox();
						$("#secondary-audio").click();
					}, 1000);
				});
				e.stopPropagation();
			}).trigger('click');
			system.showIntroBox(false, false);

			//pontuação inicial
			cfg = config;
			
			initialScore = cfg.initialScore ? cfg.initialScore : 10;
			rightIncrement = cfg.rightIncrement ? cfg.rightIncrement : 2;
			wrongIncrement = cfg.wrongIncrement ? cfg.wrongIncrement : -1;

			scores.setInitialScore(initialScore);
			scores.setRightIncrement(rightIncrement);
			scores.setWrongIncrement(wrongIncrement);

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
			$('#div_area_association').show();

			config = system.getConfig();
			
			levelClassName = "level" + system._stageIndex;
			$('#div_area_association').removeClass().addClass(levelClassName);
			
			$(main._draggableItemsId).removeClass().addClass(main._draggableItems.areaClass);

			if (typeof config.secondaryAudio != "undefined") {
				$("#secondary-audio").css("display", "block")
				$("#secondary-audio").click(function() {
					sound.sounds(config.secondaryAudio);
				})
			}
			
			var l = 0;
			//criando os itens draggables
			for (var i in main._draggableItems.items) {
				main.createDraggableItem(main._draggableItems.items[i]);
				l += main._draggableItems.items[i].width + 2 * 2;
			}
			
			$(main._droppableItemsId).removeClass().addClass(main._droppableItems.areaClass);
			
			//criando os itens droppable
			for (var i in main._droppableItems.items) {
				main.createDroppableItem(main._droppableItems.items[i]);
			}
			
			setTimeout(function() {
				main.createCarousel();
			}, 100);
		},

		/**
		 * Criando um item draggalbe
		 *
		 * @param item
		 */
		createDraggableItem : function(item) {
			var img;
			$(main._draggableItemsId).append(
				$('<div></div>')
					.addClass(item.classItem)
					.css({
						width: item.width,
						height: item.height,
						float: 'left'
					})
					.append(
						img = $('<img/>').draggable({
							containment: 'body',
							appendTo: 'body',
							helper: 'clone',
							zIndex: 9999999,
							revert: function(dropped) {
								if (main._dropFind)	{
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
									main.animationOnWrong(this);
								}
							},
							opacity:main._draggableItems.opacity,
							start: function(event, ui) {
								$('.selectedElement').removeClass('selectedElement');
								main._dropFind = false;
							}
						}).data({
							'index': item.index,
							'sound': item.sound,
							'clickSound': item.clickSound,
							'dimension': {height:item.height, width:item.width},
						}).attr({
							src: item.img,
							item: 'drag'
						}).click(function() {
							main._dropFind = false;
							$('.selectedElement').removeClass('selectedElement');
							$(this).addClass('selectedElement');

							// Se possui som no toque da peca
							if ($(this).data('clickSound')) {
								sound.sounds($(this).data('clickSound'));
							}
						})
					)
			);

			if (main._droppableItems.withImage || main._draggableItems.withImage) {
				$(img).css({
					width: item.width,
					height: item.height
				});
			}
		},

		/**
		 * Criando um item droppable
		 *
		 * @param item
		 */
		createDroppableItem : function(item) {
			if (typeof item.points == "undefined") {
				cTop = item.top;
				cLeft = item.left;
				cWidth = item.width
				cHeight = item.height
				bbox = [[cLeft, cTop], [cLeft+cWidth, cTop+cHeight]];

				points = [[cLeft, -cTop], [cLeft+cWidth, -cTop], [cLeft+cWidth, -(cTop + cHeight)], [cLeft, -(cTop + cHeight)], [cLeft, -cTop]];
			}
			else {
				bbox = main.computeBoundingBox(item.points);

				points = main.negateYCoordinates(item.points);

				cLeft = bbox[0][0];
				cTop = bbox[0][1];
				cWidth = bbox[1][0] - cLeft;
				cHeight = bbox[1][1] - cTop;
			}

			$(main._droppableItemsId).append(
				$('<div></div>')
					.attr('item', 'drop')
					.attr('points', JSON.stringify(points))
					.attr('bbox', JSON.stringify(bbox))
					.addClass(item.classItem)
					.css({
						zIndex: 1,
						width: cWidth,
						height: cHeight,
						top: cTop,
						left: cLeft,
						opacity: main._droppableItems.opacity
					})
					.droppable({
						drop: function(event, ui) {
							main.feedbackDropArea($(this), main._droppableItems.opacity, 'none');
							main.checkAcceptObject($(ui.draggable), $(this), ui);
							if (typeof item.hoverImage != "undefined") {
								$(this).find("img:first").css("visibility", "hidden");
							}
						},
						over: function(event, ui) {
							if (typeof main._draggableItems.removeAfterDrop == "undefined" || main._draggableItems.removeAfterDrop == true) {
								if (main.dropUsed($(this))) {
									return 0;
								}
							}
							
							main._countDrop++;
							
							if (!(typeof main._droppableItems.showAreaOnHover != "undefined" && main._droppableItems.showAreaOnHover == false)) {
								if (typeof item.hoverImage != "undefined") {
									$(this).find("img").css("visibility", "visible");
								}
								else {
									main.feedbackDropArea($(this), '0.5', '#DFA366');
								}
							}

							$(ui.draggable).data('wrong', false);
							$(this).data('accept', true);
						},
						out: function(event, ui) {
							if (main.dropUsed($(this))) {
								return 0;
							}
							
							main._countDrop--;
							
							if (typeof item.hoverImage != "undefined") {
								$(this).find("img").css("visibility", "hidden");
							}
							else {
								main.feedbackDropArea($(this), main._droppableItems.opacity, 'none');
							}
						},
						tolerance : (main._droppableItems.tolerance || 'pointer') + '|polygon'
					})
					.data({
						acceptableItems : item.acceptableItems,
						dimension 		: {height:item.height, width:item.width},
						img 			: item.img,
						clickSound		: item.clickSound
					}).click(function() {
						var selectedElement = $('.selectedElement');
						if(selectedElement.is('.ui-draggable')) {
							main.checkAcceptObject(selectedElement, $(this), null);
						}

						$('.selectedElement').removeClass('selectedElement');
						if (selectedElement.data('wrong')) {
						    selectedElement.data('wrong', false);
						    main.animationOnWrong(selectedElement);
						}

						// Se possui som no toque da peca
						if ($(this).data('clickSound')) {
							sound.sounds($(this).data('clickSound'));
						}
					}).append(
						(typeof item.hoverImage != "undefined" ? $("<img>").attr("src", item.hoverImage) : "")
					)
			);

			// se estiver em modo debug marca em vermelho a
			// area de aceite para facilitar visualizacao
			if (gameConfig.debug) {
				$('.pecadrop')
					.css('background', 'red')
					.css('opacity', '0.7');
			}

			if(item.feedArea) {
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
		 * Creating carousel animation
		 *
		 */
		createCarousel : function(w) {
			var config = system.getConfig();

			$('.jcarousel').jcarousel({
				'wrap'     : ((config.carousel.circular) ? 'circular' : null),
				'vertical' : ((config.carousel.orientation == 'vertical') ? true : false)
			});

			// Atribui uma classe para controle da posicao do menu
			if (config.carousel.orientation == 'vertical') {
				if (config.carousel.width > config.carousel.height) {
					alert('AVISO: Carrossel esta configurado como "vertical" mas sua largura é maior que altura.');
				}

				$('.jcarousel-wrapper')
				.removeClass('jcarousel-horizontal')
				.addClass('jcarousel-vertical');

				$('.jcarousel').css({
					'height': config.carousel.height
				});
				// Calcula posicoes para setas
				$('.jcarousel-control-prev').css({
					'top': (-config.carousel.arrowSize),
					'width' : config.carousel.arrowSize,
					'height' : config.carousel.arrowSize
				});
				$('.jcarousel-control-next').css({
					'top': config.carousel.height + 20,
					'width' : config.carousel.arrowSize,
					'height' : config.carousel.arrowSize
				});
			}
			else {
				if (config.carousel.width < config.carousel.height) {
					alert('AVISO: Carrossel esta configurado como "horizontal" mas sua largura é menor que altura.');
				}
				
				$('.jcarousel-wrapper')
					.removeClass('jcarousel-vertical')
					.addClass('jcarousel-horizontal');
			}

			// define altura e largura do carousel do jogo
			var carousel_width = (config.carousel.width) ? config.carousel.width : 0;
			var carousel_height = (config.carousel.height) ? config.carousel.height : 0;
			if (carousel_width > 0) {
				$('.jcarousel-wrapper').css('width', carousel_width + 'px');
			}
			if (carousel_height > 0) {
				$('.jcarousel-wrapper').css('height', carousel_height + 'px');
			}

			// controle de seta voltar
        	$('.jcarousel-control-prev')
            .on('active.jcarouselcontrol', function() {
				$(this).removeClass('inactive');
			})
            .on('inactive.jcarouselcontrol', function() {
				$(this).addClass('inactive');
			})
            .jcarouselControl({
				target: '-=1'
			});

			// controle de seta proximo
        	$('.jcarousel-control-next')
            .on('active.jcarouselcontrol', function() {
				$(this).removeClass('inactive');
			})
            .on('inactive.jcarouselcontrol', function() {
				$(this).addClass('inactive');
			})
            .jcarouselControl({
				target: '+=1'
			});

			// percorre todos os items do menu verificando se eh necessario mostrar setas
			var total = 0;
			$.each(config.draggableItems.items, function(key, value) {
				if (value.width) {
					total += parseInt(value.width);
				}
			});

			// Verifica se eh necessario mostrar o menu verificando o tamanho dos elementos internos
			// ou se no momento da configuracao foram escondidas as setas
			$('.jcarousel-control-prev, .jcarousel-control-next').css('visibility', 'visible');
			if (!config.carousel.showArrows) {
				$('.jcarousel-control-prev, .jcarousel-control-next').css('visibility', 'hidden');
			}
		},

		/**
		 * Faz dá um feedback na área de aceite ao arrastar a peça
		 *
		 */
		feedbackDropArea : function(drop, opacity, back) {
			areaFeed = false;
			$(main._droppableItemsId).children('div').each(function() {
				if ($(this).data('itemFeed') == drop.data('acceptableItems')) {
					areaFeed = true;
					$(this).css({'opacity': opacity, 'background':back});
				}
			});

			if(!areaFeed) {
				$(drop).css({'opacity': opacity, 'background':back});
			}
		},

		/**
		 * Verifica se já foi usada a área
		 *
		 * @param drop
		 * @returns {Boolean}
		 */
		dropUsed : function(drop){
			var used = false;
			if (main._droppableItems.withImage) {
				if (drop.children('img[item="exemple"]').length) {
					used = true;
				}
			}
			else {
				if(!drop.children('img[item="exemple"]').length) {
					used = true;
				}
			}
			drop.data('accept', false);
			
			return used;
		},

		/**
		 * Verificação de uma peça em um local
		 *
		 * @param drag
		 * @param drop
		 */
		checkAcceptObject : function(drag, drop, ui) {
			if (main.dropUsed(drop)) {
				return 0;
			}
			if (main._dropFind) {
				return 0;
			}

			if (!inArray(drag.data('index'), drop.data('acceptableItems'))) {
				main._countDropError++;
				if(main._countDropError < main._countDrop) {
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
				//desabilitar a ação do drag assim que dropar
				if (typeof main._draggableItems.removeAfterDrop == "undefined" || main._draggableItems.removeAfterDrop) {
					$(drag).off();
				}

				drag.data('wrong', false);
				drop.data('accept', true);

				main._dropFind = true;
				
				// faz reload do carrossel
				setTimeout(function() {
					$('.jcarousel').jcarousel('reload');
				}, 1000);
				
				main._isPlayingFeedbackSound = true;
				if (drag.data('sound')) {
					sound.sounds(drag.data('sound'), function() {
						main._isPlayingFeedbackSound = false;
					});
				}
				else {
					sound.successSound(function() {
						main._isPlayingFeedbackSound = false;
					});
				}
				
				if (main._droppableItems.withImage) {
					var config = system.getConfig();

					// Calcula aspect ratio para imagem depois de aceita (fit)
					var dragWidth = drag.data('dimension').width;
					var dragHeight = drag.data('dimension').height;
					var dropWidth = drop.data('dimension').width;
					var dropHeight =  drop.data('dimension').height;

					var newWidth = dropWidth;
					var newHeight = dropHeight;
					var ratio = dragWidth / dragHeight;
					if (dropWidth > dropHeight) {
						newWidth = dropWidth;
						newHeight = Math.floor(dropWidth / ratio);
					}

					// Obtem a posicao que o elemento foi dropado
					var pos = 0;
					if ($('.selectedElement').length == 0) {
						pos = $(ui.helper).position();
					}

					var drop_pos = $(drop).offset();

					// Define qual dimensao deve ser usada
					var draggableResizeRule = (config.draggableResizeRule) ? config.draggableResizeRule : 'fit';
					var width = 0;
					var height = 0;
					switch (draggableResizeRule) {
						case 'drag_size':
							width = dragWidth; height = dragHeight;
							break;
						case 'drop_size':
							width = dropWidth; height = dropHeight;
							break;
						case 'fit':
						default:
							width = newWidth; height = newHeight;
							break;
					}

					var img = $('<img>');
					$(img).css({
						width   : width,
						height  : height,
						visibility: "visible",
						opacity : 1,
						position: ((config.draggablePositionRule=='fixed') ? 'absolute' : 'static'),
						left    : ((config.draggablePositionRule=='fixed') ? pos.left-drop_pos.left : 0),
						top     : ((config.draggablePositionRule=='fixed') ? pos.top-drop_pos.top : 0),
					}).attr({
						item 	: 'exemple',
						src 	: drop.data('img') ? drop.data('img')[drag.data('index')] : $(drag).attr('src')
					});
					drop.css('opacity', 1);
					drop.append(img);

					main.animationOnCorrect(img);
					main.checkFinish();
				}
				else {
					$(drop.children('img[item="exemple"]').get(0)).animate({opacity:0}, 1000, function() {
						$(this).remove();
						main.checkFinish();
					});
				}
				
				if (typeof main._draggableItems.removeAfterDrop == "undefined" || main._draggableItems.removeAfterDrop) {
					$(drag.parent()).animate({opacity:0},'slow', function() {
						$(this).hide('fast', function() {
							$(this).remove();
						});
					});
				}

				scores.correctCount();
			}

			main._countDrop = 0;
			main._countDropError = 0;
			scores.displayInfo();
		},

		/**
		 * Animação de retorno de erro
		 *
		 * @param drag
		 */
		animationOnWrong : function(drag) {
			$(drag).animate({rotate:-10}, 125, function() {
				$(this).animate({rotate:10}, 125, function() {
					$(this).animate({rotate:-10}, 125, function() {
						$(this).animate({rotate:10}, 125, function() {
							$(this).animate({rotate:0}, 125);
						});
					});
				});
			});
		},
		
		/**
		 * Animação quando uma peça é colocada no local correto
		 *
		 */
		animationOnCorrect : function(drag) {
			$(drag).animate({rotate:360}, 400);
		},

		/**
		 * Verificação do fim do jogo
		 *
		 */
		checkFinish : function() {
			var gameOver = true;
			
			// Obtem o total de items que desem ser prenchidos
			var totalAcceptDrop = 0;
			$.each(main._droppableItems.items, function(index, value) {
				// Foi configurada uma peca de aceite?
				if (value.acceptableItems.length > 0) {
					totalAcceptDrop++;
				}
			});
			
			// Obtem o total de areas preenchidas
			var totalFilledDrop = 0;
			$(main._droppableItemsId).children('div[item="drop"]').each(function(index, value) {
				// Verifica se item possui um elemento imagem dentro do drop (ja foi preenchido!)
				if ( $(value).children('img[item="exemple"]').length > 0) {
					totalFilledDrop++;
				}
			});
			
			// Se nem todos os elementos nao foram preenchido jogo ainda nao terminou
			if (totalFilledDrop < totalAcceptDrop) {
				gameOver = false;
			}
			
			if (gameOver) {
				scores.pauseTime();
				
				// se foi definido um som de final de nivel toca
				var config = system.getConfig();
				if (config.soundFinish) {
					//E nesse caso, pára o som de feedback
					sound.stopAllSound();
					sound.sounds(config.soundFinish, function() {
						if (main._transition) {
							main.transitionScreen();
						}
						else {
							system.scoreboard();
						}
					});
				}
				else {
					//Espera o som de feedback acabar de tocar
					var gameOverInterval = setInterval(function() {
						if (!main._isPlayingFeedbackSound) {
							clearInterval(gameOverInterval);
							
							if (main._transition) {
								main.transitionScreen();
							}
							else {
								system.scoreboard();
							}
						}
					}, 50);
				}
			}
			
			return gameOver;
		},
		
		/**
		 * Exibe a tela de transição após término do level, se houver essa tela
		 *
		 */
		transitionScreen : function() {
			// esconde menu carrossel
			$('#droppableItems, #draggableItems, .jcarousel-wrapper').hide();

			$('#div_area_association')
			.append(
				$('<div id="association-feedback">').html(
					'<img class="associationFeedbackImage" src="' + main._transition.img + '">' +
	                '<div class="associationFeedbackText">' + main._transition.text + '</div>' +
					'<div class="associationFeedbackButton">Continuar</div>'
				)
			);

			// ao clicar no botao de continuar dentro da tela de transicao
			// sera chamada a tela de gamificacao
			$('#div_area_association #association-feedback .associationFeedbackButton').click(function() {
				sound.stopAllSound();
				system.scoreboard();
			});
		},

		/**
		 * Verificando se o jogo terminou
		 *
		 */
		isGameOver : function() {
			return main._config[main._stageIndex + 1] ? false : true;
		},

		/**
		 * Limpa as informações antiga
		 *
		 */
		clearStage : function() {
			$('#div_area_memory').hide();
			$('#div_area_burst').hide();

			$(main._draggableItemsId).empty();
			$(main._droppableItemsId).empty();
			
			levelClassName = "level" + system._stageIndex
			$('#div_area_association').removeClass(levelClassName);
		},

		computeBoundingBox: function(v) {
			//need positive y coords here - damn hippies who didnt choose to use cartesian coords
			//negateYCoordinates(polygon);

			var sx = v[0][0]; //smallest x and y
			var sy = v[0][1];
			var lx = 0; //largest x and y
			var ly = 0;

			l = v.length;
			for (var i = 0; i < l; i++) {
				if (v[i][0] < sx) {
					sx = v[i][0];
				}
				
				if (v[i][0] > lx) {
					lx = v[i][0];
				}

				if (v[i][1] < sy) {
					sy = v[i][1];
				}

				if (v[i][1] > ly) {
					ly = v[i][1];
				}
			}

			return [[sx, sy], [lx, ly]];
		},
		
		negateYCoordinates: function(p) {
			l = p.length;
			a = []
			for (var i = 0; i<l; i++) {
				a.push([p[i][0], -p[i][1]])
			}
			
			return a;
		}
	};
};