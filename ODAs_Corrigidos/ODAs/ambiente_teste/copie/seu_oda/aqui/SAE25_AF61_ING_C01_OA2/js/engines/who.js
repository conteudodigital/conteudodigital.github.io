WhoEngine = function() {
	this.hTiles = 0;
	this.vTiles = 0;

	this.actualHint = 1;
	this.imageEl;
	this.levelConfig;
	this.audioCount = 0;
	this.audioArray = [];

	this.tempo_audio_enunciado;

	this.hasBindedEvents = false;

	this.secCount = 0;
	this.timeTicker;

	this.secToShow = 0;
	this.minToShow = 0;

	this.actualScore = 0;
	this.scoreDecrement = 0;

	this.currentLevel = 0;

	this.audioEnunciado = null;
	this.audioErro = null;
	this.audioAcerto = null;

	this.acentosMapping = [
		["ç", "c"],
		["á", "a"],
		["ã", "a"],
		["é", "e"],
		["í", "i"],
		["ó", "o"],
		["õ", "o"],
		["ú", "u"]
	]
	
	this.getHintsCount = function() {
		return 8;
	};
	
	this.startNew = function() {
		config = system.getConfig();
		
		$(".bt_home").click(function() {
			for (i in audioArray) {
				audioArray[i].stop();
			}
		});

		$("body").on("click", ".hints li a, .current a",  function() {
			for (i in audioArray) {
				audioArray[i].stop();
			}

			audioArray[$(this).attr("audio-data")].play();
		});

		$(".div_area_who").show();
		$(".topo .introbox-container").hide();

		$(".tuto_content").hide();
		$(".left .pergunta span").html(config.title);

		_self.showFeedbackMessage("Pronto para arriscar uma resposta?");

		_self.setLevelTo();

		$("a.audio").click(function() {
			if ($(this).find("img").attr("src").indexOf("off") == -1) {
				$(this).find("img").attr("src", "img/bt_audio_off.png");
				Howler.mute();
			}
			else {
				$(this).find("img").attr("src", "img/bt_audio.png");
				Howler.unmute();
			}

			return false;
		});

		$("body").off("keyup", ".fields input");
		$("body").on("keyup", ".fields input", function(e) {
			if (!$(this).hasClass("special")) {
				setTimeout(function() {
					_self.areAllFieldsClean = true;

					$(".fields input[disabled!='disabled']").each(function() {
						if ($(this).val().killWhiteSpace() != "") {
							_self.areAllFieldsClean = false;
						}
					});

					if (_self.areAllFieldsClean) {
						$("a.btnNext").show();
						$("a.btnCheck").hide();
						_self.showFeedbackMessage("");
					}
					else {
						_self.showFeedbackMessage("Pronto para arriscar uma resposta?");
						$("a.btnNext").hide();
						$("a.btnCheck").show();
					}
				}, 50);
			}
		});

		_self.nPodeDigitar = false;

		$("body").off("keydown", ".fields input.special");
		$("body").on("keydown", ".fields input.special", function(e) {
			if (_self.nPodeDigitar === true) return false;
			if (e.which >= 37 && e.which <= 40) return false;

			if (e.which >= 96 && e.which <= 105) {
				pressedChar = String.fromCharCode(e.which - 48);
			}
			else {
				pressedChar = String.fromCharCode(e.which);
			}

			if ($(this).val().length >= 1 && e.which != 8) {
				$(this).val(pressedChar);
				e.preventDefault();
				return false;
			}

			el = $(this);
			or_el = $(this);

			window.setTimeout(function() {
				while (el.prev().length != 0 && el.prev().attr("disabled") == "disabled") {
					el = el.prev();
				}

				if (e.which == 8 && or_el.val().length == 0 && el.prev().length != 0) {
					el.prev("input").val("");
					el.prev("input").trigger("focus");
					return false;
				}
			}, 50);

			setTimeout(function() {
				areAllFieldsClean = true;

				$(".fields input[disabled!='disabled']").each(function() {
					if ($(this).val().killWhiteSpace() != "") {
						areAllFieldsClean = false;
					}
				});

				if (areAllFieldsClean) {
					$("a.btnNext").show();
					$("a.btnCheck").hide();
					_self.showFeedbackMessage("");
				}
				else {
					_self.showFeedbackMessage("Pronto para arriscar uma resposta?");
					$("a.btnNext").hide();
					$("a.btnCheck").show();
				}
			}, 100);

			_self.nPodeDigitar = true;
		});

		$(".current a img").css("visibility", "hidden");

		$("body").off("keyup", ".fields input.special");
		$("body").on("keyup", ".fields input.special", function(e) {
			el = $(this);

			if (el.val().killWhiteSpace() != "") {
				el.nextAll("input[disabled!='disabled']:first").focus();
			}
			else {
				el.focus();
			}

			_self.nPodeDigitar = false;
		});

		this.hasBindedEvents = false;
	};

	this.setLevelTo = function() {
		_self.actualHint = 1;
		currentLevel = 3;
		levelConfig = jQuery.extend(true, {}, system.getConfig());

		actualScore = 0;
		secCount = 0;
		group = hint = 0;

		audioCount = 0;
		audioArray = [];

		levelHandler.isShowingMenu = false;

		$(".fundo input").remove();
		$("<input type='text' name='char1'/>").css("user-select", "text").appendTo($(".fundo"));
		
		$(".fundo input").focus();

		$(".btn-ajuda").hide();

		$(".btnCheck").attr("onclick", "who.replyCheck(); return false;");

		$('.logo').hide();
		setTimeout(function() {
			$(".time_points, .buttons").show();
		}, 500);

		$(".hints ul li").not("li:first").remove();
		$(".hints .current span").html("");

		$(".height-correction").removeClass("height-correction");

		$("a.close").show();
		$("a.close").find("img").attr("src", "img/bt_home.png");

		scores.timeHandler();
		hintCount = 0;

		for (this.group in levelConfig.groups) {
			for (this.hint in levelConfig.groups[group]) {
				if (group != levelConfig.groups.length) {
					++hintCount;
				}
			}
		}
		actualScore += levelConfig.score_decrement;

		initialScore = levelConfig.initialScore ? levelConfig.initialScore : 10;
		rightIncrement = levelConfig.rightIncrement ? levelConfig.rightIncrement : 2;
		wrongIncrement = levelConfig.wrongIncrement ? levelConfig.wrongIncrement : -1;

		scores.setInitialScore(initialScore);
		scores.setRightIncrement(rightIncrement);
		scores.setWrongIncrement(wrongIncrement);
		scores.displayInfo();

		levelBox.point_inc = 0;
		levelBox.total_drag_items = hintCount;

		$("a.btnNext").show();
		$("a.btnCheck").hide();

		scoreDecrement = levelConfig.score_decrement;

		$(".wrongAnswer").removeClass("wrongAnswer");
		actualScore += (scoreDecrement);

		$(".points .value").html(actualScore);
		$(".content .pergunta span").html(levelConfig.title);

		titleAudio = levelConfig.audio ? levelConfig.audio : levelConfig.soundMessage

		if (titleAudio) {
			// para audio de introducao
			if (levelHandler.introSound) {
				levelHandler.introSound.stop();
			}
			if (levelHandler.introSoundClick) {
				levelHandler.introSoundClick.stop();
			}

			var	oggAudio = titleAudio.substr(0, titleAudio.length - 4) + ".ogg";

			$(".content .pergunta").find("a").attr("audio-data", audioCount);
			audioArray.push(new Howl({
				urls: [titleAudio, oggAudio],
				onload: function() {
					sound.stopAllSound();
					this.play();

					setTimeout(function() {
						tempo_audio_enunciado = (audioArray[0]._duration * 1000) + 300;
						setTimeout(function() {
							_self.showHint();
						}, tempo_audio_enunciado);
					}, 10);
				}
			}));
			
			$(".pergunta a").click(function() {
				for (i in audioArray) {
					audioArray[i].stop();
				}
				audioArray[0].play();
			});

			audioCount++;
		}
		else {
			window.setTimeout(function() {
				_self.showHint();
			}, 100);
		}

		_self.audioAcerto = new Howl({
				urls: ["mp3/acerto.mp3", "mp3/acerto.ogg"],
				autoplay: false
		});

		_self.audioErro = new Howl({
				urls: ["mp3/erro.mp3", "mp3/erro.ogg"],
				autoplay: false
		});

		_self.hintPosition();

		$(".image").css("background-image", "url('" + levelConfig.image + "')");

		hTiles = levelConfig.imageWidth;
		vTiles = levelConfig.imageHeight;
		_self.fillImageWithTiles();

		$(".container-content *").css("visibility", "visible");

		$("#menu_markup").remove();

		// GAMBI
		if (levelConfig.imageHeight == 2) {
			$('.image_wrapper').removeClass('image_tree_lines').addClass('image_two_lines');
		}
		else if (levelConfig.imageHeight == 3) {
			$('.image_wrapper').removeClass('image_two_lines').addClass('image_tree_lines');
		}
		else if (levelConfig.imageHeight == 4) {
			$('.image_wrapper').removeClass('image_two_lines').addClass('image_tree_lines');
		}

		_self.nPodeDigitar = false;
	}

	this.nextHint = function() {
		_self.actualHint++;
		_self.showHint(_self.actualHint);
	}

	this.showImageTile = function(position, audio) {
		var x = position[0];
		var y = position[1];

		var elementIndex = hTiles * (y - 1) + x - 1;

		imageEl.find("div").eq(elementIndex).css({"background": "transparent"});
		_self.showTextHint ("Observe a imagem.", audio);
	}

	this.showTextHint = function(text, audio) {
		var newOldHint = $(".hints ul li:first").clone();
		var delayOnAudio;
		var oggAudio;
		var currentHint = $(".current");

		if (currentHint.find("span").html() != "") {
			newOldHint.html(currentHint.html());
			newOldHint.appendTo($(".hints ul"));
		}

		if (audio) {
			oggAudio = audio.substr(0, audio.length - 4) + ".ogg";

			currentHint.find("a").attr("audio-data", audioCount);
			currentHint.find("img").css("visibility", "visible");

			for (i in audioArray) {
				audioArray[i].stop();
			}

			audioArray.push(new Howl({
				urls: [audio, oggAudio],
				autoplay: true
			}));

			audioCount++;
		}
		else {
			currentHint.find("img").css("visibility", "hidden");
		}

		currentHint.find("span").html(text.toUpperCase());

		_self.hintPosition();

		// /**************************************/
		// /                                      /
		// /		DESCULPA MUNDO                /
		// /		SORRY WORLD                   /
		// /                                      /
		// /***************************************/

		$('.current_wrapper').hide();
		setTimeout(function() {
			$(".current_wrapper").fadeIn("fast");
		}, 1);
	}

	this.showLettersCountHint = function(text, audio) {
		textToShow = text.replace("?", levelConfig.word.length);
		$(".fields input").css("border-bottom", "2px solid black");

		$(".fields input").remove();
		for (var u = 1; u <= levelConfig.word.length; u++) {
			$('<input type="text"/>').css("user-select", "text").addClass("special").appendTo($(".fields .fundo"));
		}

		//Ajusta o tamanho do container, caso não seja suficiente
		var outer = 0;
		$("input[disabled!='disabled']").each(function(index, value) {
			outer += $(value).outerWidth(true);
		});
		if ($(".fundo").width() < outer) {
			$(".fundo").css("width", outer);
		}

		$("input.special:first").focus();

		_self.showTextHint(textToShow, audio);
	};

	this.showLettersHint = function(text, positions, audio) {
		var countIndex = 0;
		var lettersCount = objectLength(positions);
		var textToShow = "";

		var isSilaba = false;
		var silabaToShow = "";

		for (var index in positions) {
			if (positions[index].length > 1) {
				isSilaba = true;
			}
		}

		if (isSilaba) {
			for (this.index in positions) {
				for (this.i = 0; i < positions[index].length; i++) {
					$(".fields input").eq(index - 1 + i).val(positions[index].substr(i, 1)).attr("disabled", "disabled").addClass("filledInput");
				}

				silabaToShow = positions[index];
			}

			textToShow = text.replace("?", silabaToShow);
		}
		else {
			for (var index in positions) {
				$(".fields input").eq(index - 1).val(positions[index]).attr("disabled", "disabled").addClass("filledInput");

				if (countIndex < lettersCount - 2) {
					textToShow += positions[index] + ", ";
				}
				else if(countIndex == lettersCount - 2) {
					textToShow += positions[index] + " e ";
				}
				else if (countIndex == lettersCount - 1) {
					textToShow += positions[index];
				}

				countIndex++;
			}

			textToShow = text.replace("?", textToShow);
		}

		_self.showTextHint(textToShow, audio);
	}

	this.showHint = function() {
		scores.wrongCount();

		if (levelConfig.groups == 0) {
			if (levelConfig.final_feedback) {
				_self.showTextHint(levelConfig.final_feedback[0], levelConfig.audioanswer);
				_self.showFeedbackMessage(levelConfig.final_feedback[1]);
			}
			else {
				_self.showFeedbackMessage("Digite corretamente o nome do animal.");
				_self.showTextHint("O animal é: " + levelConfig.word + "", levelConfig.audioanswer);
			}

			$("a.btnNext").hide();
			$("a.btnCheck").show();
			$("input[disabled!='disabled']").eq(0).focus();

			return false;
		}

		if (levelConfig.groups[0].length == 0) {
			levelConfig.groups.splice(0, 1);
		}

		var possibleHints = levelConfig.groups[0];

		thisHint = possibleHints.splice(possibleHints.length * Math.random(), 1)[0];

		switch(thisHint.type) {
			case "image":
				_self.showImageTile(thisHint.attributes.tile, thisHint.attributes.audio);
				break;
			case "text":
				_self.showTextHint(thisHint.attributes.text, thisHint.attributes.audio);
				break;
			case "count":
				_self.showLettersCountHint(thisHint.attributes.text, thisHint.attributes.audio);
				break;
			case "letters":
				_self.showLettersHint(thisHint.attributes.text, thisHint.attributes.positions, thisHint.attributes.audio);
				break;
		}

		_self.showFeedbackMessage("PRONTO PARA ARRISCAR UMA RESPOSTA?");
		$("input[disabled!='disabled']").eq(0).focus();
	}

	this.replyCheck = function() {
		var enteredValue = "";

		$(".fields input").each(function() {
			enteredValue += $(this).val();
		});

		if (levelConfig.word.toLowerCase() == enteredValue.toLowerCase()) {
			$(".btnCheck").attr("onclick", "");

			$(".tileImage").remove();

			_self.audioAcerto.play();

			if (levelConfig.groups.length == 0) {
				_self.showFeedbackMessage("");
			}
			else {
				_self.showFeedbackMessage("Parabéns, você acertou!");
			}

			window.setTimeout(function() {
				system.scoreboard();
			}, 2500);
		}
		else if (_self.clearString(levelConfig.word.toLowerCase()) == enteredValue.toLowerCase()) {
			var isSinalGrafico = false, correctAnswerChars, thisAnswerChars;

			if (actualScore != 0) {
				actualScore -= scoreDecrement;
			}

			$(".points .value").html(actualScore);

			_self.audioErro.play();
			scores.wrongCount();

			$(".fields input[disabled!='disabled']").each(function() {
				$(this).val("");
			});

			$(".fundo").addClass("wrongAnswer");
			setTimeout(function() {
				$(".fundo").removeClass("wrongAnswer");
			}, 2200);

			if (!(enteredValue == "" || levelConfig.groups[0].length == 0)) {
				$("a.btnNext").show();
				$("a.btnCheck").hide();
			}

			_self.showFeedbackMessage("");

			correctAnswerChars = levelConfig.word.toLowerCase().split("");
			thisAnswerChars = enteredValue.toLowerCase().split("");

			for (u in correctAnswerChars) {
				for (k in _self.acentosMapping) {
					if (correctAnswerChars[u] != thisAnswerChars[u] && _self.acentosMapping[k][0] == correctAnswerChars[u] && k == 0) {
						isSinalGrafico = true;
					}
				}
			}

			if (isSinalGrafico) {
				_self.showFeedbackMessage("Ops, falta apenas um sinal gráfico! Tente novamente!", "");
			}
			else {
				_self.showFeedbackMessage("Ops, falta apenas um acento! Tente novamente!", "");
			}
		}
		else {
			if (actualScore != 0) {
				actualScore -= scoreDecrement;
			}

			_self.audioErro.play();
			scores.wrongCount();

			$(".points .value").html(actualScore);

			$(".fields input[disabled!='disabled']").each(function() {
				$(this).val("");
			});

			if (levelConfig.groups[0].length == 0) {
				_self.showFeedbackMessage("Você ainda não conseguiu. :( ");
			}
			else {
				_self.showFeedbackMessage("Você ainda não conseguiu, veja mais dicas. :(");
				$("a.btnNext").show();
				$("a.btnCheck").hide();
			}

			$(".fundo").addClass("wrongAnswer");
			setTimeout(function() {
				$(".fundo").removeClass("wrongAnswer");
			}, 2200);
		}
	}

	this.showFeedbackMessage = function(message) {
		$(".feedbackMessage").html(message.toUpperCase());
	}

	this.fillImageWithTiles = function() {
		imageEl = $(".image");
		this.imageWidth = imageEl.width();
		this.imageHeight = imageEl.height();

		this.newTile;

		$(".tileImage").remove();

		for (y = 1; y <= vTiles; y++) {
			for (x = 1; x <= hTiles; x++) {
				newTile = $("<div>").addClass("tileImage");

				if (x == 1) {
					newTile.css("border-left", "0px");
				}
				if (x == hTiles) {
					newTile.css("border-right", "0px");
				}
				if (y == 1) {
					newTile.css("border-top", "0px");
				}
				if (y == vTiles) {
					newTile.css("border-bottom", "0px");
				}

				newTile.appendTo(imageEl);
			}
		}
	}

	this.clearString = function(string) {
		var originalCharArray = string.split("");
		var modifiedCharArray = Array();
		var hasToBeModifiedTo;

		for (var u in originalCharArray) {
			hasToBeModifiedTo = false;
			for (w in _self.acentosMapping) {
				if (_self.acentosMapping[w][0] == originalCharArray[u]) {
					hasToBeModifiedTo = _self.acentosMapping[w][1];
				}
			}

			if (hasToBeModifiedTo) {
				modifiedCharArray.push(hasToBeModifiedTo);
			}
			else {
				modifiedCharArray.push(originalCharArray[u]);
			}
		}

		return modifiedCharArray.join("");
	}

	this.timeTick = function() {
		var timeToShow;

		minToShow = secToShow = 0;
		secToShow = secCount++;

		while (secToShow >= 60) {
			secToShow -= 60;
			minToShow++;
		}

		secToShow += "";
		minToShow += "";

		if (secToShow.length == 1) {
			secToShow = "0" + secToShow;
		}

		if (minToShow.length == 1) {
			minToShow = "0" + minToShow;
		}

		timeToShow = minToShow + ":" + secToShow;
	}

	String.prototype.killWhiteSpace = function() {
	    return this.replace(/\s/g, '');
	};

	this.hintPosition = function() {
		var totalHints = $(".hints ul li").length;

		$(".hints ul li").each(function(i) {
			if (i == 1) {
				if ((130 - totalHints * 20) < 0) {
					$(this).css("margin-top", 0);
				}
				else {
					$(this).css("margin-top", 130 - totalHints * 20);
				}
			}
			else if (i > 1) {
				$(this).css("margin-top", 5);
			}
		});

		$('.hints ul').scrollTop(500000);
		$(".current_wrapper").height($(".current").outerHeight(false));

		$(".fundo_wrapper").width($(".fundo").width() + 45);
	}

	this.scoreboard = function () {
	    this.min = (minToShow.toString().length == 1 ? '0' + minToShow.toString() : minToShow);
	    this.sec = (secToShow.toString().length == 1 ? '0' + secToShow.toString() : secToShow);

	    // numero atual do nivel desconsiderando seus grupos
	    this.curr_level_index = currentLevel;
	    // numero atual do nivel dentro do grupo
	    this.curr_level = currentLevel;

	    this.w = 0;
	    this.thisGroupLevelCount;
	    for (this.k in levels) {
	    	for (this.l in levels[k].levels) {
	    		if (w == curr_level) {
	    			thisGroupLevelCount = levels[k].levels.length;
				}

				w++;
	    	}
		}

	    // mostra janela de nivel concluido
	    levelBox.type = "points";
	    levelBox.curr_level = curr_level;
	    levelBox.num_level = thisGroupLevelCount;
	    levelBox.total_time = min + ":" + sec;
	    levelBox.total_points = actualScore;
	    levelBox.total_drag_items = 9;
	    levelBox.bonus_multi = 2.2;

	    levelBox.bonus_min = 10;

	    levelBox.buttons.next_page = function() {
	        // transicao para outro nivel ja eh implementado
	        // pela engine da FPF, somente remove a janela de level!
	        levelBox.remove();

	        // se for o ultimo nivel de um grupo volta para menu inicial
	        if (levelHandler.isLastLevelInGroup()) {
	            levelHandler.showInitialMenu();
	        }
			else {
	        	currentLevel++;
	        	setLevelTo(currentLevel);
	        }
	    };
	    levelBox.buttons.reload = function() {
			levelBox.remove();
			setLevelTo(currentLevel);
	    };
	    levelBox.buttons.home = function() {
	        levelBox.remove();
	        levelHandler.showInitialMenu();
	    };
	    levelBox.create();
	}

	_self = this;
}

var clone = (function() {
	return function (obj) {
		Clone.prototype = obj;
		return new Clone();
	};
	function Clone() {}
}());

objectLength = function(obj) {
	count = 0;
	for (var a in obj) {
		count++;
	}
	return count;
}

var who = new WhoEngine();