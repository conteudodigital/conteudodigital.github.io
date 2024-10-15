

$('.creditos').on('click', function () {
    $('.modal').toggleClass('is-active');
    $('html').css('overflow', 'hidden');
});

$('.modal-close').on('click', function () {
    $('.modal').toggleClass('is-active');
    $('html').css('overflow', 'auto');
});


$(".bt00").on('click', function(){
	$(".quadro").addClass('hidden');
	$(".quadro.cor01").removeClass('hidden');
	$('html, body').animate({
    	scrollTop: $(".quadro.cor01").offset().top
	}, 1000)
})

$(".bt01").on('click', function(){
	$(".quadro").addClass('hidden');
	$(".quadro.cor02").removeClass('hidden');
	$('html, body').animate({
    	scrollTop: $(".quadro.cor02").offset().top
	}, 1000)
})

$(".bt02").on('click', function(){
	$(".quadro").addClass('hidden');
	$(".quadro.cor03").removeClass('hidden');
	$('html, body').animate({
    	scrollTop: $(".quadro.cor03").offset().top
	}, 1000)
})

$(".bt03").on('click', function(){
	$(".quadro").addClass('hidden');
	$(".quadro.cor04").removeClass('hidden');
	$('html, body').animate({
    	scrollTop: $(".quadro.cor04").offset().top
	}, 1000)
})

$(".bt04").on('click', function(){
	$(".quadro").addClass('hidden');
	$(".quadro.cor05").removeClass('hidden');
	$('html, body').animate({
    	scrollTop: $(".quadro.cor05").offset().top
	}, 1000)
})

$(".bt05").on('click', function(){
	$(".quadro").addClass('hidden');
	$(".quadro.cor06").removeClass('hidden');
	$('html, body').animate({
    	scrollTop: $(".quadro.cor06").offset().top
	}, 1000)
})

$(".bt06").on('click', function(){
	$(".quadro").addClass('hidden');
	$(".quadro.cor07").removeClass('hidden');
	$('html, body').animate({
    	scrollTop: $(".quadro.cor07").offset().top
	}, 1000)
})

$(".bt07").on('click', function(){
	$(".quadro").addClass('hidden');
	$(".quadro.cor08").removeClass('hidden');
	$('html, body').animate({
    	scrollTop: $(".quadro.cor08").offset().top
	}, 1000)
})

$(".botao").on('click', function(){
	$(".botao").removeClass('opacidade');
	$(this).addClass('opacidade');

})

function check(e) {
    var resp = $(e).val().toUpperCase();
    console.log(resp);
    var gaba = $(e).data('resp');
    console.log(gaba);
    if (resp == gaba) {
        $(e).css('color', '#96ff7e');
    } else {
        $(e).css('color', '#ff8686');
    }
}