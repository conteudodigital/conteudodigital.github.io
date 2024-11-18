/**
 * Classe de gerenciamento de sons
 *
 */
var sound = new function() {
	var main = null;
	return main = {
		_soundBg: null,
		_soundMessage: null,
		_soundError: null,
		_soundSuccess: null,
		_soundCheck: null,
		_howlerOnEndEvent: null,
		_noBuffer: false,
		
		soundOn : true,
		bgOn: true,

		/**
		 * Configurações
		 *
		 */
		start : function() {
			/*
			 * setando os sons padrões, se no config não existirem os arquivos a serem tocados
			 * serão executados os padrões...
			 */
			
			var suportaBufferBg = true;
			var suportaBufferSucErr = true;
			if (bowser.ios && versionCompare(bowser.osversion, "8") < 0) {
				suportaBufferBg = false;
			}
			if (bowser.ios) {
				suportaBufferSucErr = false;
			}
			
			if (bowser.ios && isOfflineBook) {
				main._noBuffer = true;
			}
			
			main._soundError = new Howl({
				urls: ["mp3/erro.mp3"],
				buffer: suportaBufferSucErr
			});
			
			main._soundSuccess = new Howl({
				urls: ["mp3/acerto.mp3"],
				buffer: suportaBufferSucErr
			});
			
			main._soundBg = new Howl({
				urls: ["mp3/bg.mp3"],
				buffer: suportaBufferBg,
				loop: true,
				volume: 0.3
			});
			
			return main;
		},

		/**
		 * Habilita o som
		 *
		 */
		turnOn : function() {
			main.soundOn = true;
			
			if (main._soundMessage != null) {
				main._soundMessage.play();
			}
			
			Howler.unmute()
			return main;
		},
		
		/**
		 * Desabilita o som
		 *
		 */
		turnOff : function() {
			if (main._soundMessage != null) {
				main._soundMessage.stop();
			}
			if (main._soundSuccess != null) {
				main._soundSuccess.stop();
			}
			if (main._soundError != null) {
				main._soundError.stop();
			}
			main.soundOn = false;
			
			Howler.mute();
			
			return main;
		},
		
		/**
		 * Habilita o som de backgorund
		 *
		 */
		turnOnBackground : function(){
			main._soundBg.play();
			main.bgOn = true;
		},
		
		/**
		 * Desabilita o som de backgorund
		 *
		 */
		turnOffBackground : function(){
			main._soundBg.stop();
			main.bgOn = false;
		},
		
		/**
		 * Toca qualquer som
		 *
		 */
		sounds : function(sound, callback) {
			if (!main.isAudioNameValid(sound)) {
				alert('AVISO: Nome do arquivo de aúdio não segue os padrões necessários para funcionamento no iOS. Use minúsculas, sem acentos e espaços.');
				return false;
			}
			
			if (!main.soundOn) {
				if (callback) {
					callback();
				}
				return false;
			}
			
			if (main.bgOn && bowser.android && versionCompare(bowser.osversion, "4.4") < 0) {
				main._soundBg.pause();
			}
			new Howl({
				urls: [sound],
				autoplay: true,
				buffer: !main._noBuffer,
				onend: function() {
					if (main.bgOn && bowser.android && versionCompare(bowser.osversion, "4.4") < 0) {
						main._soundBg.play();
					}
					if (callback) {
						callback();
					}
					this._onend = new function(){};
				}
			});
			
			return main;
		},
		
		/**
		 * Toca o som de acerto
		 *
		 */
		successSound : function(callback) {
			if (!main.soundOn) {
				if (callback) {
					callback();
				}
				return false;
			}
			
			if (main._soundSuccess != null) {
				if (main.bgOn && bowser.android && versionCompare(bowser.osversion, "4.4") < 0) {
					main._soundBg.pause();
				}
				
				if (bowser.android && isOfflineBook) {
					new Howl({
						urls: ["mp3/acerto.mp3"],
						autoplay: true,
						buffer: true,
						onend: function() {
							if (main.bgOn && bowser.android && versionCompare(bowser.osversion, "4.4") < 0) {
								main._soundBg.play();
							}
							if (callback) {
								callback();
							}
						}
					});
				}
				else {
					main._soundSuccess.play(function() {
						if (main.bgOn && bowser.android && versionCompare(bowser.osversion, "4.4") < 0) {
							main._soundBg.play();
						}
						if (callback) {
							callback();
						}
					});
				}
			}
			
			return main;
		},
		
		/**
		 * Toca o som de erro
		 *
		 */
		errorSound : function() {
			if(!main.soundOn) return false;
			
			if (main._soundError != null) {
				if (main.bgOn && bowser.android && versionCompare(bowser.osversion, "4.4") < 0) {
					main._soundBg.pause();
				}
				
				if (bowser.android && isOfflineBook) {
					new Howl({
						urls: ["mp3/erro.mp3"],
						autoplay: true,
						buffer: true,
						onend: function() {
							if (main.bgOn && bowser.android && versionCompare(bowser.osversion, "4.4") < 0) {
								main._soundBg.play();
							}
						}
					});
				}
				else {
					main._soundError.play(function() {
						if (main.bgOn && bowser.android && versionCompare(bowser.osversion, "4.4") < 0) {
							main._soundBg.play();
						}
					});
				}
			}
			
			return main;
		},
		
		/**
		 * Executa o som da mensagem
		 *
		 */
		messageSound : function(){
			if(!main.soundOn) return false;
			
			if (main._soundMessage != null) {
				main._soundMessage.stop();
				main._soundMessage.play();
			}
			return main;
		},
		
		preloadCheckSound: function(sound) {
			if (!main.isAudioNameValid(sound)) {
				alert('AVISO: Nome do arquivo de aúdio não segue os padrões necessários para funcionamento no iOS. Use minúsculas, sem acentos e espaços.');
				return false;
			}
			
			main._soundCheck = new Howl({
				urls: [sound],
				buffer: !main._noBuffer
			});
		},
		
		playCheckSound : function(sound) {
			if (!main.isAudioNameValid(sound)) {
				alert('AVISO: Nome do arquivo de aúdio não segue os padrões necessários para funcionamento no iOS. Use minúsculas, sem acentos e espaços.');
				return false;
			}
			
			if(!main.soundOn) return false;
			
			if (main.bgOn && bowser.android && versionCompare(bowser.osversion, "4.4") < 0) {
				main._soundBg.pause();
			}
			if (main._soundCheck) {
				main._soundCheck.play(function () {
					if (main.bgOn && bowser.android && versionCompare(bowser.osversion, "4.4") < 0) {
						main._soundBg.play();
					}
					main._soundCheck = null;
				});
			}
			else {
				new Howl({
					urls: [sound],
					autoplay: true,
					buffer: !main._noBuffer
				});
			}
			
			return main;
		},
		
		/**
		 * Definição do som de mensagem
		 *
		 * @param sound
		 */
		setMessageSound : function(sound, endedCallback) {
			if (!main.isAudioNameValid(sound)) {
				alert('AVISO: Nome do arquivo de aúdio não segue os padrões necessários para funcionamento no iOS. Use minúsculas, sem acentos e espaços.');
				return false;
			}
			
			if (main._soundMessage != null) {
				main._soundMessage.stop();
			}
			main._soundMessage = new Howl({
				urls: [sound],
				buffer: !main._noBuffer,
				onend: function() {
					if (main.bgOn && bowser.android && versionCompare(bowser.osversion, "4.4") < 0) {
						main._soundBg.play();
					}
					if (endedCallback) {
						endedCallback();
					}
				}
			});
			
			if (main.soundOn) {
				if (main.bgOn && bowser.android && versionCompare(bowser.osversion, "4.4") < 0) {
					main._soundBg.pause();
				}
				main._soundMessage.play();
			}
		},
		
		/**
		 * Pausa os sons quando retorna para a tela de menu
		 *
		 */
		stopAllSound : function() {
			if (main._soundMessage != null) {
				main._soundMessage.stop();
			}
			
			if (main._soundError != null) {
				main._soundError.stop();
			}
			
			if (main._soundSuccess != null) {
				main._soundSuccess.stop();
			}
			
			if (main._soundCheck != null) {
				main._soundCheck.stop();
			}
		},

		/*
			Valida se o arquivo de audio informado segue o padrao
			necessario para evitar problemas no iOS.
		 */
		isAudioNameValid : function(value) {
			if (/^[a-z0-9-_\.]+$/.test(value)) return false;
			return true;
		}
	};
};

/**
 * Inicializações
 *
 */
$(document).ready(function() {
	sound.start();
});