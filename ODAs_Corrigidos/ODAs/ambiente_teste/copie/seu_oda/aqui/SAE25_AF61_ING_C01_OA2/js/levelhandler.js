//Livro Tablet API
function LTSalvaAtividade(idAtividade, idTurma, bolOculta, bolSincroniza, dados) {
	JSON.stringify('SAVE => ' + dados);
	StageWebViewBridge.call("SaveGame", null, idAtividade, idTurma, bolOculta, bolSincroniza, dados);
}
function LTRetornaAtividade(idAtividade) {
	StageWebViewBridge.call("LoadGame", null, idAtividade);
}
function LoadGameCallback(LoadResponse) {
	var response = JSON.parse(LoadResponse);
	JSON.stringify('GET => ' + LoadResponse);
	JSON.stringify('obj => ' + response);

	levelHandler.userScore = (response.dados_Finalizados ? jQuery.parseJSON(response.dados_Finalizados) : []);
	levelHandler.getScoreData_callback(levelHandler.userScore);
}
//Fim do LT	API

isAprendeBrasil = (window.location.href.indexOf('aprendebrasil') > -1);

levelHandler = {
	idUsuario: 0,
	userScore: [],
	idAtividade: ((gameConfig.idAtividade > 0) ? gameConfig.idAtividade : 0),
	apiAtividade: null,
	apiUrl: ((!isAprendeBrasil) ? gameConfig.urlUsuarioSessao : gameConfig.urlUsuarioSessao.replace('educacional', 'aprendebrasil')),
	getScoreData_callback: null,

	getScoreData: function(callbackFunction) {
		levelHandler.getScoreData_callback = callbackFunction;
		if (isOfflineBook) {
			LTRetornaAtividade(levelHandler.idAtividade);
		}
		else if (!gameConfig.producao) {
			levelHandler.userScore = [];
			callbackFunction(levelHandler.userScore);
		}
		else {
			$.getJSON(levelHandler.apiUrl, function(idUser) {
				// Define um usuario fake para acesso se nao estiver me producao
				if (!gameConfig.producao) {
					idUser = 9620946;
				}

				if (idUser > 0) {
					levelHandler.apiAtividade = new Atividade();
					levelHandler.idUsuario = idUser;
					levelHandler.apiAtividade.retornaAtividade(levelHandler.idAtividade, levelHandler.idUsuario, function(scoresData){
						levelHandler.userScore = (scoresData.d.dados_Finalizados ? jQuery.parseJSON(scoresData.d.dados_Finalizados) : []);
						callbackFunction(levelHandler.userScore);
					});
				}
				else {
					$('div.loading').html('<p class="aviso">Você deve estar logado para jogar.<br/><br/><a href="javascript:void(0)" onclick="location.reload()">Tentar novamente</a></p>');
				}
			});
		}
	},

	setScoreData: function(levelIndex, starsCount, timeCount, score, bonusScore) {
		var alreadyPlayed = false;
		for (var k in levelHandler.userScore) {
			if (levelHandler.userScore[k].level_index == levelIndex) {
				postData = {
					"response_id": levelHandler.getLevelInfo(levelIndex).response_id,
					"level_index": levelIndex,
					"play_count": levelHandler.getLevelInfo(levelIndex).play_count + 1,
					"score": score,
					"bonus_score": bonusScore,
					"time": timeCount,
					"stars": starsCount
				}
				levelHandler.userScore[k] = postData;
				alreadyPlayed = true;
			}
		}

		if (!alreadyPlayed) {
			postData = {
				"response_id": 0,
				"level_index": levelIndex,
				"play_count": 1,
				"score": score,
				"bonus_score": bonusScore,
				"time": timeCount,
				"stars": starsCount
			}

			if (typeof levelHandler != 'object') {
				levelHandler.userScore = new Array();
			}

			levelHandler.userScore.push(postData);
		}

		if (isOfflineBook) {
			LTSalvaAtividade(levelHandler.idAtividade, 0, 0, 0, JSON.stringify(levelHandler.userScore));
		}
		else if (gameConfig.producao) {
			levelHandler.apiAtividade.salvaAtividade(levelHandler.idAtividade, levelHandler.idUsuario, 0, 0, JSON.stringify(levelHandler.userScore));
		}
	},
	
	getLevelInfo: function(level) {
		var u = levelHandler.userScore;
		for (var i in u) {
			if (u[i].level_index == level) {
				return u[i];
			}
		}
		return false;
	},
	
	hasPlayedLevel: function(level) {
		return Boolean(levelHandler.getLevelInfo(level));
	},
	
	isLevelLocked : function(dependency) {
		return (dependency.length > 0) ? true : false;
	},

	getStarsCount: function(level) {
		return levelHandler.getLevelInfo(level).stars;
	},

	getTotalStarsCount: function() {
		var totalStars = 0,
		u = levelHandler.userScore;
		for (var i in u) {
			totalStars += parseInt(u[i].stars);
		}
		return totalStars;
	},

	getScore: function(level) {
		if (!levelHandler.hasPlayedLevel(level)) {
			return 0;
		}
		return levelHandler.getLevelInfo(level).score + levelHandler.getLevelInfo(level).bonus_score
	},

	getTotalScore: function() {
		var totalScore = 0,
			u = levelHandler.userScore;

		for (var i in u) {
			totalScore += parseInt(u[i].score + u[i].bonus_score);
		}

		return totalScore;
	},

	isLastLevelInGroup: function() {
		var curr_level = 0;
		for (group in levels) {
			for (level in levels[group].levels) {
				level = parseInt(level);
				if (curr_level == main._stageIndex && (level + 1) == levels[group].levels.length) {
					return true;
				}
				curr_level++;
			}
		}
		return false;
	}
};