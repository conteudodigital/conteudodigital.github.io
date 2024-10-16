/**
 * Classe de gerenciamento da pontuação
 *
 */
var scores = new function() {
	var main = null;

	return main = {
		_died : false,

		/**
		 * Auxilia a contagem de acertos
		 *
		 */
		_corrects: 0,

		/**
		 * Auxilia a contagem de erros
		 *
		 */
		_wrongs: 0,

		/**
		 * Auxilia a contagem de segundos
		 *
		 */
		_secCount: 0,
		
		/**
		 * Numero de pontos subtraidos ao errar
		 *
		 */

		_wrongIncrement: -10,
		
		/**
		 * Auxilia a contagem de minutos
		 *
		 */
		_minCount: 0,
		
		_initialScore: 10,

		_rightIncrement: 10,
		
		/**
		 * Auxilia a contagem de horas
		 *
		 */
		_hourCount: 0,

		/**
		 * Armazena a pontucao na mudanca de etapas
		 *
		 */
		_acertosEtapas : new Array(),

		/**
		 * Armazena os erros das etapas
		 *
		 */
		_errosEtapas : new Array(),

		/**
		 * Id to timer
		 *
		 */
		_timeHandlerId : null,

		/**
		 * Objeto de data inicial
		 *
		 */
		_startObjDate : null,

		/**
		 *
		 * Exibe a tabela de pontos
		 *
		 */
		displayInfo : function() {
			main._secCount = (main._secCount.toString().length == 1 ? '0' + main._secCount.toString() : main._secCount);
			main._minCount = (main._minCount.toString().length == 1 ? '0' + main._minCount.toString() : main._minCount);
			
			$('.t_time').html(
				main._minCount + ':' + main._secCount
			);

			$('.div_score').html('0'.repeat(3 - main._corrects.toString().length) + main._corrects);
			
			return main;
		},

		/**
		 * Contabiliza os acertos
		 *
		 */
		correctCount : function() {
			main._corrects += main._rightIncrement;
		},

		/**
		 * Contabiliza os erros
		 *
		 */
		wrongCount : function() {
			main._corrects += main._wrongIncrement;
			if (main._corrects < 0) {
				main._corrects = 0;
			}
		},
		
		setItensCount: function(m) {
			levelBox.total_drag_items = m;
		},
		
		setRightIncrement: function(i) {
			main._rightIncrement = i;
			levelBox.point_inc = i;
			return true;
		},
		
		getRightIncrement: function() {
			return main._rightIncrement;
		},
		
		setWrongIncrement: function(i) {
			main._wrongIncrement = i;
			return true;
		},
		
		getWrongIncrement: function() {
			return main._wrongIncrement;
		},
		
		setInitialScore: function(i) {
			main._initialScore = i;
			main._corrects = main._initialScore
			levelBox.initial_points = i;
			return true;
		},
		
		getInitialScore: function() {
			return main._initialScore;
		},
		
		/**
		 * Cronometro
		 *
		 */
		timeHandler : function () {
			clearInterval(main._timeHandlerId);
			main._startObjDate = new Date();
			main._timeHandlerId = setInterval(function() {
				var objDate;
				
                objDate = new Date();
                var dif = Math.floor((objDate.getTime() - main._startObjDate.getTime()) / 1000);
				
                main._secCount  = Math.floor(dif % 60);
                main._minCount  = Math.floor(dif / 60);
				
				main.displayInfo();
			}, 200);
			
			return main;
		},

		/**
		 * Pausar o cronometro
		 *
		 */
		pauseTime: function() {
			clearInterval(main._timeHandlerId);
			return main;
		},

		/**
		 * Zerar contador erros, acertos, tempo
		 *
		 */
		counterRestart : function() {
			//guarda a pontuação da etapa no array
			main._acertosEtapas[associacao._etapaAtual] = main._corrects;
			main._errosEtapas[associacao._etapaAtual]   = main._wrongs;
			main._corrects = 0;
			main._wrongs = 0;

			main.displayInfo();

			return main;
		},

		/**
		 * Reinicia as pontuações
		 *
		 */
		counterReset : function() {
			main._acertosEtapas = new Array();
			main._errosEtapas = new Array();
			main._corrects = 0;
			main._wrongs   = 0;
			main._secCount  = 0;
			main._minCount  = 0;
			main._hourCount = 0;
			main.displayInfo();
		},
		
		/*
		 *	Define se usuario morreu
		 */
		setDied : function(died) {
			main._died = died;
		},

		getDied: function() {
			return main._died;
		}
	};
};