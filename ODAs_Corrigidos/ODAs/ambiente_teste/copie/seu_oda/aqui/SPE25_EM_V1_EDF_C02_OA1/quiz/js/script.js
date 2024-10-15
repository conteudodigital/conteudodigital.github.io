/* -- SCRIPTS NOVOS E ESPECIFICOS DO LAYOUT -- */
function result(pontos, questoes){
	
	if(pontos < 1){
		$('.wrapper')
			.html('<h2 class="hyphenate">Nenhuma das '+ questoes +' questões estavam corretas.</h2>');

	}
	else if(pontos == 1){
		$('.wrapper')
			.html('<h2 class="hyphenate">Você acertou '+ pontos +' questão de '+ questoes +'.</h2>');
	}
	else if(pontos > 1){
		$('.wrapper')
			.html('<h2 class="hyphenate">Você acertou '+ pontos +' questões de '+ questoes +'.</h2>');
	}

	console.log(pontos, questoes);
}


ready(function () {
		bulmaCarousel.attach('#carousel-demo', {
			slidesToScroll: 1,
			slidesToShow: 4
		});
});