
$('.creditos').on('click', function () {
    $('.modal').toggleClass('is-active');
    $('html').css('overflow', 'hidden');
});

$('.modal-close').on('click', function () {
    $('.modal').toggleClass('is-active');
    $('html').css('overflow', 'auto');
});

