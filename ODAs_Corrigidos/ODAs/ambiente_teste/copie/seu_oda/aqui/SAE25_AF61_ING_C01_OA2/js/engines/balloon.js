var balloon = function(options){
	var b = {
		/**
		 * Onde vai ser adicionado
		 *
		 */
		_toAppend 		: options.toAppend?options.toAppend:'body',

		/**
		 * Altura do elemento
		 *
		 */
		_height 		: options.height?options.height:50,

		/**
		 * Largura do elemento
		 *
		 */
		_width 			: options.width?options.width:50,

		/**
		 * Altura da tela
		 *
		 */
		_heightSreen 	: $(window).height(),

		/**
		 * Largura da tela
		 *
		 */
		_widthSreen 	: options.widthSreen?options.widthSreen:$(window).width(),

		/**
		 * Velocidade da animação
		 *
		 */
		_speed 			: options.speed?options.speed:'normal',//slow, normal, fast,

		/**
		 * Objeto
		 *
		 */
		_o 				: null,

		/**
		 * Radio limite que o objeto tem q ficar aparti do centro da tela
		 *
		 */
		_radius 		: options.radius?options.radius:$(window).width()/2,

		/**
		 * Evento acionado ao clicar na peça
		 *
		 */
		_onClick 		: options.onClick?options.onClick:null,

		/**
		 * Evento acionado ao terminar a animação
		 *
		 */
		_onEnd 			: options.onEnd?options.onEnd:null,

		/**
		 * Html da peça
		 *
		 */
		_html 			: options.html?options.html:null,

		/**
		 * Dados
		 *
		 */
		_data 			: options.data?options.data:null,

		/**
		 * Id do tempo inicial para a peça aparecer
		 *
		 */
		_idTimeout 		: null,

		/**
		 * Número de divisões do balão
		 *
		 */
		_screenDivision : options.screenDivision ? options.screenDivision : 0,

		/**
		 * Coluna da posição do balão
		 *
		 */
		_column 		: null,

		/**
		 * Direção do balão
		 *
		 */
		_direction 		: options.direction?options.direction:'down',

		/**
		 * Inicialiação
		 *
		 */
		init : function() {
			// Se forem diferentes os tamanhos de baloes vai dar problema!
			if (b._screenDivision == 0) {
				var window_width = $(window).width() - b._width;
				b._screenDivision = Math.ceil(window_width / burst.getLargestWidth());
			}
			
			b.createBalloon();
			
			$(window).resize(function() {
				b._heightSreen = $(window).height();
				$(b._o).css({
					left 	: b.getLeft(b._column),
					top 	:((b._direction == 'up')?b._heightSreen:-b._height)
				});
			});
		},

		/**
		 * Cria o objeto
		 *
		 */
		createBalloon : function() {
			var c;
			b._o = $('<div></div>').css({
				height: b._height,
				width: b._width,
				position: 'absolute',
				zIndex: 0,
				display: "none"
			}).bind('click touchstart', c = function(){
				for(var j in lastsRandomLeft){
					if(lastsRandomLeft[j] == b._column){
						lastsRandomLeft.splice(j, 1);
					}
				}

				if(b._onClick && typeof b._onClick == 'function'){
					b._onClick.call(b._o);
				}
			})
			.addClass('balloon')
			.html(b._html)
			.data({
				column : b._column
			});
			
			// debug?
			if (gameConfig.debug) {
				if (burst._game.type == 'order')
					b._o.append('Item index: ' + b._data.idIndex)

				if (b._data.correct == true) {
					b._o.css('border', '2px solid blue')
				} else {
					b._o.css('border', '2px solid red')
				}
			}
			
			$(b._o).children('*').click(c);
			
			if(b._data){
				$(b._o).data(b._data);
			}
			
			$(b._toAppend).append(b._o);
		},

		/**
		 * Pega a velocidade
		 *
		 */
		getSpeed : function() {
			var s = 0;
			switch (b._speed) {
				case 'slow':
					s = (Math.random() * 50) + 50;
					break;
				case 'normal':
					s = (Math.random() * 70) + 100;
					break;
				case 'fast':
					s = (Math.random() * 90) + 150;
					break;
			}
			return parseInt(s);
		},
		
		/**
		 * Calcula o left randomico
		 *
		 */
		getLeft : function(column) {
			var l, arrayAux = new Array();
			i = 0;
			if (column == null) {
				do {
					d = Math.floor(Math.random()*(b._screenDivision));
					i++;
				} while(inArray(d, lastsRandomLeft) && i<100); // se travar aqui provavelmente é pq num teim coluna sô

				b._column = d;
				lastsRandomLeft[lastsRandomLeft.length] = d;
			} else {
				d = column;
			}

			l = Math.floor(((b._radius * 2) / b._screenDivision) * d);
			l = l + ($(window).width() / 2) - b._radius;

			return l;
		},

		/**
		 * Inicia a animação do balloon
		 *
		 */
		animate : function(direction){
			var yVel = b.getSpeed(),
				endY = 0,
				animationDuration,
				heightMax = b._heightSreen,
				topBalloon = 0;

			//verificando a direção
			direction = inArray(direction, ['up', 'down'])?direction:'down';
			//calculando o tempo da velocidade
			animationDuration = isMobile()?((heightMax / yVel).toFixed(2)):(parseInt((((heightMax / yVel).toFixed(2))*1000)/heightMax));
			//posicionado o objeto conforme a direção
			topBalloon = (direction == 'up') ? b._heightSreen : -b._height;
			
			$(b._o).css({
				top: topBalloon,
				left: b.getLeft(),
				display: "block"
			});
			
			if(!isMobile()) {//'Safari\/531'
				//inicio da animação
				$(b._o).data().idAnimation = setTimeout(function(){
					clearTimeout($(b._o).data().idAnimation);
					endY = endY + ((direction == 'up') ? -1 : 1);
					
					$(b._o).css({
						'-webkit-transform' : 'translateY(' + endY + 'px)',
						'-moz-transform' 	: 'translateY(' + endY + 'px)',
						'-o-transform' 		: 'translateY(' + endY + 'px)',
						'transform' 		: 'translateY(' + endY + 'px)',
						'-ms-transform' 	: 'translateY(' + endY + 'px)',
					});

					if ((endY > (b._heightSreen+b._height) && direction=='down') || (endY < -(b._heightSreen+b._height) && direction=='up')){

						for (var j in lastsRandomLeft) {
							if(lastsRandomLeft[j] == b._column){
								lastsRandomLeft.splice(j, 1);
							}
						}

						if (b._onEnd && typeof b._onEnd == 'function'){
							b._onEnd.call($(b._o));
						}
						else {
							// Remove elemento anterior
							$(b._o).css({
								'-ms-animation-play-state':'paused',
								'-o-animation-play-state':'paused',
								'-moz-animation-play-state':'paused',
								'-webkit-animation-play-state':'paused',
								'animation-play-state':'paused'
							})
							.stop()
							.data('idIndex', -1)
							.unbind('click touchstart')
							.remove();
							
							burst.createItem(burst._items[burst.getNewBalloonIndex()])
						}
					} else {
						$(b._o).data().idAnimation = setTimeout(arguments.callee, animationDuration);
					}
				}, animationDuration);
			}
			else {
				endY = (heightMax+b._height)*((direction=='up')?-1:1);

				var
				cssRule  = '@-webkit-keyframes fallingAnimation { 0% { -webkit-transform: translateY(0); } 100% { -webkit-transform: translateY(' + endY + 'px); }}';
				cssRule += '@-moz-keyframes fallingAnimation { 0% { -moz-transform: translateY(0); } 100% { -moz-transform: translateY(' + endY + 'px); }}';
				cssRule += '@-o-keyframes fallingAnimation { 0% { -o-transform: translateY(0); } 100% { -o-transform: translateY(' + endY + 'px); }}';
				cssRule += '@keyframes fallingAnimation { 0% { transform: translateY(0); } 100% { transform: translateY(' + endY + 'px); }}';

				$('head').find('style[isTemporary=true]').remove();
				$('head').append($('<style isTemporary="true" type="text/css">' + cssRule + '</style>'));
				
				$(b._o).css({
					'animation-name': 'fallingAnimation',
					'animation-duration': animationDuration + 's',
					'animation-timing-function':'linear',
					'animation-fill-mode': 'both'
				});

				$(b._o).data().idAnimation = setTimeout(function() {
					for (var j in lastsRandomLeft) {
						if (lastsRandomLeft[j] == b._column){
							lastsRandomLeft.splice(j, 1);
						}
					}

					if (b._onEnd && typeof b._onEnd == 'function'){
						b._onEnd.call($(b._o));
					}
					else {
						// Remove elemento anterior
						$(b._o).css({
							'-ms-animation-play-state':'paused',
							'-o-animation-play-state':'paused',
							'-moz-animation-play-state':'paused',
							'-webkit-animation-play-state':'paused',
							'animation-play-state':'paused'
						})
						.stop()
						.data('idIndex', -1)
						.unbind('click touchstart')
						.remove();
						
						burst.createItem(burst._items[burst.getNewBalloonIndex()]);
					}
				}, animationDuration * 1000);
			}
		},

		/**
		 * Reinicia
		 *
		 */
		restart : function(direction){
			$(b._o).css({
				'animation-name' 			: '',
				'animation-duration' 		: '',
				'animation-timing-function' : '',
				'animation-fill-mode' 		: ''
			});

			b.animate(direction);
		}
	};

	b.init();
	return b;
};

var lastsRandomLeft = new Array();