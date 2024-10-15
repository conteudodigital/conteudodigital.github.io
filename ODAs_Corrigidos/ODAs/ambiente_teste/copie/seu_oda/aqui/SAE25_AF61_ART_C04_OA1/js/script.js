$('.creditos').on('click', function () {
    $('.cred-modal').addClass('is-active');
    $('html').css('overflow', 'hidden');
});

$('.modal-close').on('click', function () {
    $('.modal').removeClass('is-active');
    $('html').css('overflow', 'auto');
});

var dragAtual, dropAtual;
var dropCorretos = 0;

var acertosMaior = 0;

$(document).ready(function(){
  dragDrop();
});

function dragDrop(){
  $( ".drag" ).draggable({
    revert: true,
    start: function(event, ui){
      dragAtual = $(this);
    }
  });

  $('.drop').droppable({
    drop: function(event, ui){
      dropAtual = $(this);
      console.log(dragAtual.attr('data-item') + ' - ' + dropAtual.attr('data-correto'));
      if(dragAtual.attr('data-item') == dropAtual.attr('data-correto')){
        $(this).next('.legenda').removeClass('hidden');
        dropAtual.html(dragAtual.html());
        dragAtual.fadeOut(100);
      }
      else {
        $(this).addClass('animated shake');
        setTimeout(function(){
            console.log("errado!");
            $('.drop').removeClass('animated shake');
        }, 500);
      }
    }
  });
}