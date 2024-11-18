// ESTRUTURA DO JS PARA MONTAR O QUIZ
$(document).ready(function () {

	var contQuiz = 0,
		sectionAtual = 0,
		valor = '',
		contPontos = 0
	quizTipo = '',
		tipoAcao = ''
	tipoResultado = '';

	for (var i = 0; i < (content.length); i++) {
		if (content[i].section == 'quiz') {
			if (content[i].randomQuestions == true) {
				$.shuffle(content[i].questions);
			}
			quizTipo = content[i].quizType;
			tipoAcao = content[i].actionType;
		}
	}

	console.log(quizTipo, tipoAcao);
	//console.log(content[sectionAtual].section);

	$('.section').css({
		'background-image': 'url(' + content[sectionAtual].bgImage + ')'
	}).attr("id", "title").children('.wrapper').html(content[0].html);

	$('.btn').addClass('is-active')

	$('body').on('click', '.btn-next, .btn-next-question', function () {

		if ($(this).hasClass("btn-next") == true) {
			sectionAtual++;
		} else if ($(this).hasClass("btn-next-question") == true) {
			contQuiz++;
		}


		$('.modal-close, .btn, .modal, .btn-check').removeClass('is-active');

		$('.modal').attr('style', '');

		$('html').animate({
			scrollTop: 0
		}, 1);
		$('.modal-content').animate({
			scrollTop: 0
		}, 1);

		if (content[sectionAtual].section == 'recurso') {

			contQuiz = 0;

			$('.section').css({
				'background-image': 'url(' + content[sectionAtual].bgImage + ')'
			}).attr("id", "recurso").children('.wrapper').html(content[sectionAtual].html);

			$('.btn').addClass('is-active');
		} else if (content[sectionAtual].section == 'quiz') {

			$('.feedback').fadeOut(1);

			$('.btn').addClass('btn-next-question').removeClass('btn-next');

			qtdeQuestoes = content[sectionAtual].questions.length;

			$('footer .level-left').html(contQuiz + 1 + ' | ' + qtdeQuestoes);

			var arrayAlternative = '';

			$('.section').css({
				'background-image': 'url(' + content[sectionAtual].bgImage + ')'
			}).attr("id", "quiz");

			if (contQuiz < qtdeQuestoes) {
				$('#quiz').children('.wrapper').html('	<div class="card-content ' + content[sectionAtual].questions[contQuiz].className + '">\
								<div class="enunciado">\
									<p>' + content[sectionAtual].questions[contQuiz].question + '</span>\
								</div>\
								<div class="columns context"></div>\
							</div>');

				if (content[sectionAtual].questions[contQuiz].append != '') {
					$('.context').html('<div id="append" class="column append is-half-tablet is-half-desktop">\
									' + content[sectionAtual].questions[contQuiz].append + '\
								</div>\
								<div class="alternativas column is-half-tablet is-half-desktop">\
								</div>');
				} else {
					$('.context').html('<div class="alternativas column"></div>');
				}

				if (quizTipo == 'slider') {
					for (var i = 0; i < (content[sectionAtual].questions[contQuiz].alternatives.length); i++) {
						arrayAlternative += '<span data-val="' + content[sectionAtual].questions[contQuiz].alternatives[i].answer + '" data-value="' + content[sectionAtual].questions[contQuiz].alternatives[i].value + '" class="marker ' + content[sectionAtual].questions[contQuiz].alternatives[i].value + '" data-pos=' + (i + 1) + '></span>';
					}
					$('.alternativas').html('<div class="container-range">\
							<h1>Deslize o marcador para escolher sua resposta</h1>\
							<div class="form-container-range">\
								<input id="ranger" class="form-range form-range-markers" type="range" min="0" max="' + (content[sectionAtual].questions[contQuiz].alternatives.length - 1) + '" step="1" value="0" />\
								<div class="range-markers">\
								' + arrayAlternative + '\
								</div>\
							</div>\
						</div>');
				} else {
					for (var i = 0; i < (content[sectionAtual].questions[contQuiz].alternatives.length); i++) {
						arrayAlternative += '<div class="alternativa box ' + content[sectionAtual].questions[contQuiz].alternatives[i].value + '" data-pos=' + (i + 1) + ' data-value=' + content[sectionAtual].questions[contQuiz].alternatives[i].value + '>\
											<article class="media">\
												' + content[sectionAtual].questions[contQuiz].alternatives[i].img + '\
												<div class="media-content">\
													<div class="content">\
														<p>' + content[sectionAtual].questions[contQuiz].alternatives[i].answer + '</p>\
													</div>\
												</div>\
											</article>\
										</div>';
					}
					$('.alternativas').html(arrayAlternative);
				}
			}
		} else if (content[sectionAtual].section == 'result') {
			$('.btn').removeClass('btn-next').addClass('btn-reload').addClass('is-active');

			console.log(content[sectionAtual].section);
			$('.section').css({
				'background-image': 'url(' + content[sectionAtual].bgImage + ')'
			}).attr("id", "result").children('.wrapper').html(content[sectionAtual].html);

			result(contPontos, qtdeQuestoes);
		}
		var carousels = bulmaCarousel.attach(); // carousels now contains an array of all Carousel instances

		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

	});


	/*ON CLICK ALTERNATIVA*/
	$('body').on('click', '.alternativa', function () {
		thisPos = $(this).data('pos');
		valor = $(this).data('value');
		if (quizTipo == 'simples') {
			$('.alternativa').removeClass('is-focused active');
			$(this).addClass('is-focused');
			action(thisPos);
		} else {
			if ($(this).hasClass("is-focused") == true) {
				$(this).removeClass('is-focused, active');
			} else {
				$(this).addClass('is-focused');
				action(thisPos);
			}
		}
	});


	/* SLIDER */
	$('body').on('input', 'input', function () {
		var val = $(this).val();
		var content = $('.marker').eq(val).data('val');
		$('.marker').removeClass('active-on');
		$('.marker').eq(val).addClass('active-on');
		if (content != '') {
			$('.container-range').children('h1').html(content);
		} else {
			$('.container-range').children('h1').html(val);
		}
		console.log(val);
		action();
	});



	/*ON CLICK CHECK*/
	$('body').on('click', '.btn-check', function () {
		feedback()
	});



	/* RELOAD */
	$('body').on('click', '.btn-reload', function () {
		window.location.reload();
	});


	/* ZOOM */
	$('body').on('click', '.lupa', function (event) {
		contentAppend = $(this).parent().html();
		console.log($(this).parent().attr('id'));
		$('.modal-image').children('.modal-content').html('<div class="media image">' + contentAppend + '</div>');
		$('.modal-image, .modal-close').addClass("is-active");
		event.stopPropagation();
	});




	/* CLOSE MODAL */
	$('body').on('click', '.modal-close', function () {
		$('.modal, .modal-close').removeClass("is-active");
	});


	/* ON SCROLL END SHOW BTN-NEXT - RECURSO DISPARADOR */
	/*$(window).on("scroll", function() {
		var scrollHeight = $(document).height();
		var scrollPosition = $(window).height() + $(window).scrollTop();
		
		console.log(scrollHeight,scrollPosition,(scrollHeight - scrollPosition));
		if($('section').attr('id')=='recurso'){
			if ((scrollHeight - scrollPosition) < 25) {
				$('.btn').addClass('is-active');
			}else{
				$('.btn').removeClass('is-active');
			}
		}
	});*/


	// carousels now contains an array of all Carousel instances	
	var carousels = bulmaCarousel.attach();


	function action(thisPos) {
		if (tipoAcao == 'next') {
			feedback();
		} else if (tipoAcao == 'check') {
			$('.btn-check').addClass('is-active');
		} else if (tipoAcao == 'again') {
			feedback();
			$('.modal-close').addClass("is-active");
		}
	}

	function feedback() {
		if (quizTipo == 'slider') {
			val = $('#ranger').val();
			valor = $('.active-on').data('value');
			thisPos = $('.active-on').data('pos');
			console.log(val, valor, thisPos);
			if (valor != '') {
				if (valor == 'true') {
					contPontos++;
				} else {
					contPontos += valor;
				}
				$('.modal-feedback').children('.modal-content').html('<h3 class="correto"><span class="pin-right"></span></h3>\
							<div class="feedback-box">\
								' + content[sectionAtual].questions[contQuiz].alternatives[thisPos - 1].feedback + content[sectionAtual].questions[contQuiz].generalFeedback + '\
							</div>');
				$('.modal-feedback').addClass("is-active");
				$('.btn').addClass("is-active");
			} else {
				$('.modal-feedback').children('.modal-content').html('	<h3 class="incorreto"><span class="pin-wrong"></span></h3>\
							<div class="feedback-box">\
								' + content[sectionAtual].questions[contQuiz].alternatives[thisPos - 1].feedback + content[sectionAtual].questions[contQuiz].generalFeedback + '\
							</div>');
				$('.modal-feedback').addClass("is-active");
				$('.btn').addClass("is-active");
			}
		} else {
			$(".is-focused").each(function () {
				valor = $(this).data('value');
				console.log(valor);
				if (valor != '') {
					if (valor == 'true') {
						contPontos++;
					} else {
						contPontos += valor;
					}
					if (quizTipo == 'simples') {
						$('.alternativa').removeClass('active right');
					}
					$(this).append('<span class="pin-right"></span>').addClass('active right');
					$('.modal-feedback').children('.modal-content').html('<h3 class="correto"><span class="pin-right"></span></h3>\
								<div class="feedback-box">\
									' + content[sectionAtual].questions[contQuiz].alternatives[thisPos - 1].feedback + content[sectionAtual].questions[contQuiz].generalFeedback + '\
								</div>');
					$('.modal-feedback').addClass("is-active");
					$('.btn').addClass("is-active");
				} else {
					$(this).append('<span class="pin-wrong"></span>').addClass('active wrong');
					$('.modal-feedback').children('.modal-content').html('	<h3 class="incorreto"><span class="pin-wrong"></span></h3>\
								<div class="feedback-box">\
									' + content[sectionAtual].questions[contQuiz].alternatives[thisPos - 1].feedback + content[sectionAtual].questions[contQuiz].generalFeedback + '\
								</div>');
					$('.modal-feedback').addClass("is-active");
					$('.btn').addClass("is-active");
				}

				console.log(this);
			});
		}
		console.log(contPontos, contQuiz, qtdeQuestoes)
		if (contQuiz + 1 == qtdeQuestoes) {
			$('.btn').addClass('btn-next').removeClass('btn-next-question');
		}
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
	}



	/*  SLIDER COMPARAR IMAGENS */
	$(document).on('input', '#range', function () {
		$('#slider_value').html($(this).val());
		$('.img2').css("width", $(this).val() + "%");
	});

});