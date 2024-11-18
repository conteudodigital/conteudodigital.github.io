/*
	Carregamento de arquivos css e js para jogos
*/
var loader = new function() {

	var main = null;
	main = {
		_delay : 50,
		_timeout : null,
		_index : 0,
		_files : [
			// geral
			'gameconfig.js',
			'js/helper.js',
			'js/utils.js',
			'levelconfig.js',
			'levelmenu.js',
			'offline.js',

			'js/sound.js',
			'js/scores.js',

			// gamificacao
			'css/levelbox.css',
			'js/levelbox.js',
			'js/atividade.js',
			'js/levelhandler.js',
			'js/StageWebViewBridge.js',

			// estouro de objetos
			'js/engines/balloon.js',
			'js/engines/burst.js',
			'css/style-burst.css',

			//quem sou eu
			'js/engines/who.js',
			'css/style-who.css',

			// associacao
			'js/engines/association.js',
			'css/style-association.css',

			// memoria com deck
			'js/engines/memory_deck.js',
			// memoria simples
			'js/engines/memory.js',
			'css/style-memory.css',

			// quebra cabeca
			'js/engines/puzzle.js',
			'css/style-puzzle.css',

			//cruzadinha
			'js/engines/crossword.js',
			'css/style-crossword.css',

			'css/animations.css',
			// tela inicial do jogo com niveis
			'css/menu.css',
			// definicoes gerais de css desktop
			'css/style-desktop.css',
			'css/fonts.css',
			
			//botao i
			'js/info.js',			

			'js/main.js'
		],

		loadCss: function(filename, identifier) {
			if (gameConfig.cache === false) {
				var dt = new Date();
				filename = filename + '?rand=' + dt.getTime();
			}
			var elem = document.createElement('link');
			elem.setAttribute('rel', 'stylesheet');
			elem.setAttribute('type', 'text/css');
			elem.setAttribute('href', filename);

			if (identifier) elem.setAttribute('class', identifier);

			if (typeof elem != 'undefined') {
				setTimeout(function() {
					document.getElementsByTagName('head')[0].appendChild(elem);
				}, 100);
			}
		},

		unloadCss: function(identifier) {
			if (identifier) $('.'+identifier).remove();
		},

		/*
		 *	Inclui arquivos do jogo com opcao de forcar limpeza de cache
		 */
		includeFiles: function(completeCallback) {
			// se nao existir mais linhas a serem carregadas para e retorna como completo
			if (loader._index == loader._files.length) {
				clearTimeout(loader._timeout);
				completeCallback();
				return;
			}

			var filename = loader._files[loader._index];
			var ext = filename.split('.').pop();

			if (gameConfig.cache === false) {
				var dt = new Date();
				filename = filename + '?v=' + dt.getTime();
			}

			var elem = null;

			if (ext == 'js') {
				elem = document.createElement('script');
                elem.setAttribute('type', 'text/javascript');
                elem.setAttribute('src', filename);
			}

			if (ext == 'css') {
				elem = document.createElement('link');
                elem.setAttribute('rel', 'stylesheet');
                elem.setAttribute('type', 'text/css');
                elem.setAttribute('href', filename);
			}

			if (typeof elem != 'undefined') {
				document.getElementsByTagName('head')[0].appendChild(elem);
				loader._index++;
				loader._timeout = setTimeout(function() {
					loader.includeFiles(completeCallback);
				}, loader._delay);
			}
		},
	};

	return main;
}

$(function() {
	$('#game_container').hide();
	
	if (!isOfflineBook) {
		if (loader._files.indexOf("js/StageWebViewBridge.js") > -1) {
			loader._files.splice(loader._files.indexOf("js/StageWebViewBridge.js"), 1);
		}
	}
	
	loader.includeFiles(function() {
		$('#game_container').show();
	});
});