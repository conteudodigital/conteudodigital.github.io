var levelBox = {}

// Numeros de 1 a 10 para uso no cabecalho da janela
levelBox.levelNumbers = ['&#x2780;', '&#x2781;', '&#x2782;', '&#x2783;', '&#x2784;', '&#x2785;', '&#x2786;', '&#x2787;', '&#x2788;', '&#x2789;']

levelBox.overlay = ((gameConfig.bloquearJanelaGameficacao) ? gameConfig.bloquearJanelaGameficacao : true);
levelBox.width = ((gameConfig.larguraJanelaGameficacao) ? gameConfig.larguraJanelaGameficacao : 400);
levelBox.height = ((gameConfig.alturaJanelaGameficacao) ? gameConfig.alturaJanelaGameficacao : 400);
levelBox.title = '';

// "points", "feedback" e "congratulations"
levelBox.type = '';

levelBox.initial_points = 0;
levelBox.point_inc = 0;
levelBox.total_drag_items = 0;
levelBox.bonus_min = 0;
levelBox.bonus_multi = 0;

// nivel atual
levelBox.curr_level = 0;
// total de niveis
levelBox.num_level = 0;

// points
levelBox.total_time = '00:00';
levelBox.total_points = 0;
levelBox.total_stars = 0;
levelBox.total_bonus = 0;

// feedback
levelBox.feedback_image = '';
levelBox.feedback_content = '';

// congratulations
levelBox.congrat_content = '';

// quais botoes devem ser apresentados
levelBox.buttons = {
	'next_page': function() {},
	'home': function() {},
	'reload': function() {}
}

// Limpa a animação dos bonus
levelBox.animationInterval = null;
// Controle da animação inicial antes de começar
levelBox.showAnimationTimeout = null;

// Verifica se usuario nao conseguiu passar de nivel
levelBox.diedMessage = ((gameConfig.msgNaoConseguiu) ? gameConfig.msgNaoConseguiu :
													   'Suas vidas acabaram. Tente novamente.');

//__________________________________________________________________________


levelBox.timeToBonus = function(time)
{
	var ms = time.split(':');

	var initial_points = levelBox.initial_points;
	var point_inc = levelBox.point_inc;
	var total_drag_items = levelBox.total_drag_items > 0 ? levelBox.total_drag_items : 5;

	if (!levelBox.bonus_multi) levelBox.bonus_multi = 0;
	if (!levelBox.bonus_min) levelBox.bonus_min = 0;

	var bonus_range = [levelBox.bonus_min, levelBox.bonus_min*levelBox.bonus_multi];

	// total de pontos que o usuario pode alcançar (sem conta bonus)
	var max_points = (point_inc * total_drag_items) + initial_points;
	var max_bonus_points = Math.round( max_points / 3 );
	var max_total_points = max_points + max_bonus_points;




	time_to_secs = parseInt(ms[0]*60) + parseInt(ms[1]);

	if (time_to_secs < bonus_range[0]) time_to_secs = bonus_range[0];
	if (time_to_secs > bonus_range[1]) time_to_secs = bonus_range[1];

	var range_diff = bonus_range[1] - bonus_range[0];

	//var b = ((max_bonus_points * time_to_secs) - range_diff) / range_diff
	var b = (max_bonus_points * Math.abs(time_to_secs - bonus_range[0])) / range_diff;
	var bonus_points = Math.round((max_bonus_points) - b);
	//if (bonus_points < 0) bonus_points = 0;

	levelBox.total_bonus = bonus_points;
	var total_bonus_points = (bonus_points + levelBox.total_points);

	// soma os pontos de bonus com os pontos ganhos durante o jogo
	//levelBox.total_points = total_bonus_points;

	// calcula a quantidade de estrelas correspondente aos pontos ganhos
	var numStar = levelBox.pointsToStars(total_bonus_points, max_total_points);

	// Chama level handler para salvar dados na API
	levelHandler.setScoreData(levelBox.curr_level_index-1,
							  numStar,
							  time_to_secs,
							  levelBox.total_points,
							  bonus_points);
}

//__________________________________________________________________________

levelBox.pointsToStars = function(points, max_total_points)
{
	var star_inc = max_total_points / 4;

	var stars = 1;
	if ( points > star_inc*2 && points <= star_inc*3 ) stars = 2;
	if ( points > star_inc*3 && points <= star_inc*4 ) stars = 3;

	levelBox.total_stars = stars;
	return stars;
}

//__________________________________________________________________________

levelBox.animateBonus = function(bonus)
{
	var time_wait = 800;

	// concatena tempo + bonus
	setTimeout(function() {
		var total_time = $('div.level-box p.total_time').html();
		$('div.level-box p.total_time').html( total_time + ' = <span id="bonus_num">' + bonus + '</span> bônus' );
	}, time_wait);

	levelBox.showAnimationTimeout = setTimeout(function() {
		var bonus_dec = bonus;
		levelBox.animationInterval = setInterval(function() {
			// decrementa bonus
			var total_bonus = parseInt( $('#bonus_num').text() );
			var total_points = parseInt( $('#points_num').text() );

			// somente se tiver algum bonus faz animacao
			if (bonus > 0) {
				$('#bonus_num').html(total_bonus - 1);

				// animacao de conversao de bonus para pontos
				$('#one_num')
				.css('display', 'block')
				.css('top', $('#bonus_num').position().top)
				.css('left', $('#bonus_num').position().left);

				var left_pos = (total_points >= 10) ? $('#points_num').position().left+10 : $('#points_num').position().left;
			    $('#one_num').animate({
			    	'top': $('#points_num').position().top,
			    	'left': left_pos,
			    	'font-size': '50px'
				}, 200, function() {
					$('#one_num').css('display', 'none');
					// incrementa quantidade de pontos
					$('#points_num').html(total_points + 1);
				});
			}

			bonus_dec--;
			if (bonus_dec <= 0) {
				clearInterval(levelBox.animationInterval);
				setTimeout(function() {
					$('div.level-box p.total_time').hide();
					$('div.level-box p.total_stars').fadeIn();
				}, 1000);
			}
		}, 300);
	}, time_wait);
}

//__________________________________________________________________________

levelBox.create = function()
{
	var html = '';

	levelBox.timeToBonus(levelBox.total_time);

	if (levelBox.overlay)
		html += '<div class="level-box-overlay"></div>';

	html += '<div class="level-box">';

		html += '<div class="lbtop"><div class="left"></div>';
		if (levelBox.title) {
			html += '<div class="title"><h1>'+levelBox.title+'</h1></div>';
		} else {
			html += '<div class="title"><ul>';

			for (var i = 0; i < levelBox.num_level; i++) {
				var active = (i == levelBox.curr_level-1) ? 'active' : 'inactive';
				html += '<li class="n'+(i + 1)+' '+active+'">' + levelBox.levelNumbers[i] + '</li>';
			}

			html += '</ul></div>';
		}
		html += '<div class="right"></div></div>';

		// tipo de conteudo: points, feedback ou congratulations
		html += '<div class="lbcontent">';

		if (levelBox.type == 'points') {
			html += '<p class="total_time"><img src="img/level-box/relogio.fw.png" align="absmiddle" /> ' + levelBox.total_time + '</p>';
			html += '<p class="total_points"><span id="one_num">1</span><span id="points_num">' + levelBox.total_points + '</span><span class="small">pontos</span></p>';
			html += '<p class="total_stars" style="display: none">';
			for (var i=1; i <= 3; i++) {
				var star_image = (i <= levelBox.total_stars) ? 'estrela.fw.png' : 'fundo_estrela.fw.png';
				html += '<img src="img/level-box/' + star_image + '" />';
			}
			html += '</p>';
		}

		if (levelBox.type == 'feedback') {
			html += '<p class="feedback_image"><img src="' + levelBox.feedback_image + '" /></p>';
			html += '<p class="feedback_content">' + levelBox.feedback_content + '</p>';
		}

		if (levelBox.type == 'congratulations') {
			html += '<p class="congrat_stars">';
			for (var i=1; i <= 3; i++) {
				var star_image = (i <= levelBox.total_stars) ? 'estrela.fw.png' : 'fundo_estrela.fw.png';
				html += '<img src="img/level-box/' + star_image + '" width="25" height="25" />';
			}
			html += '<span class="small"><strong>' + levelBox.total_points + '</strong> pontos</span>';
			html += '</p>';

			html += '<p class="congrat_title">Parabéns Nome</p>';
			html += '<p class="congrat_content">' + levelBox.congrat_content + '</p>';
		}

		if (levelBox.type == 'died') {
			html += '<div class="died">';
				html += '<p class="message">' + levelBox.diedMessage + '</p>';
				html += '<p class="total_time"><img src="img/level-box/relogio.fw.png" align="absmiddle" /> ' + levelBox.total_time + '</p>';
				html += '<p class="total_points"><span id="one_num">1</span><span id="points_num">' + levelBox.total_points + '</span><span class="small">pontos</span></p>';
				html += '<p class="total_stars" style="display: none">';
				for (var i = 1; i <= 3; i++) {
					var star_image = ((i <= levelBox.total_stars) ? 'estrela.fw.png' : 'fundo_estrela.fw.png');
					html += '<img src="img/level-box/' + star_image + '" />';
				}
				html += '</p>';
			html += '</div>';
		}

		html += '</div>';

		html += '<div class="lbfooter"><div class="left"></div>';
		html += '<div class="center"><p>';

		if (levelBox.buttons.home)
			html += '<a href="javascript:;" class="home"><img src="img/level-box/home.fw.png" /></a>';

		if (levelBox.buttons.reload)
			html += '<a href="javascript:;" class="reload"><img src="img/level-box/refazer.fw.png" /></a>';

		if (levelBox.buttons.next_page)
			html += '<a href="javascript:;" class="next_page" id="bt_continuar"><img src="img/level-box/continuar.fw.png" /></a>';

		html += '</p></div>';
		html += '<div class="right"></div></div>';

	html += '</div>';

	$('body').append(html);

	if (levelBox.buttons.home)
		$('.level-box a.home').bind('click', levelBox.buttons.home);

	if (levelBox.buttons.reload)
		$('.level-box a.reload').bind('click', levelBox.buttons.reload);

	if (levelBox.buttons.next_page)
		$('.level-box a.next_page').bind('click', levelBox.buttons.next_page);

	// posiciona janela
	$('.level-box').css('left', $(window).width()/2 - $('.level-box').width()/2);
	$('.level-box').css('top', $(window).height()/2 - $('.level-box').height()/2);
	// reposiciona janela ao redimensionar tela
	$(window).resize(function() {
		$('.level-box').css('left', $(window).width()/2 - $('.level-box').width()/2);
		$('.level-box').css('top', $(window).height()/2 - $('.level-box').height()/2);
	});

	// animacao de bonus passando para pontos
	if (levelBox.type == 'points')
		levelBox.animateBonus(levelBox.total_bonus);

	if (levelBox.type == 'died')
		$('.level-box a.next_page').hide()
}

//__________________________________________________________________________

levelBox.remove = function()
{
	$('div.level-box-overlay').remove();
	$('div.level-box').remove();

	

	clearTimeout(levelBox.showAnimationTimeout);
	clearInterval(levelBox.animationInterval);
}

//__________________________________________________________________________

levelBox.show = function()
{
	$('div.level-box').show();
}

//__________________________________________________________________________

levelBox.hide = function()
{
	$('div.level-box').hide();
}

//__________________________________________________________________________