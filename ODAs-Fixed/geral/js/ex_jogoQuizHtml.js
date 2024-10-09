var AppQuizHtml=function(_id,_dentroModulo,_pulaAutomaticamente,_embaralhaPergunta=true){
    var i_erros = 0,
    i_acertos = 0,
    i_total=0;
    $('input[type="checkbox"]:checked').prop('checked',false);
    var $divOd=$('#'+_id);
    var jogavel=true;
    var count=0;
    var $divGuiFinal=$('#'+_id).find('#guiFinal');
    var $btinicio=$('#'+_id).find('#btIniciaTutorial');
    var $btContinua=$('#'+_id).find('#btContinuar');
    var $playervideo=$('#'+_id).find('#plVideo');
    var $lacunas = $('.relacionaveis').find('.input');
    var $slides=$('#'+_id).find('.quizInterno');
    var $quiz=$('#'+_id).find('.quiz');
    var $btReload=$('#'+_id).find('#btReload');
    var $progressoradial=$('#'+_id).find('#progressoradial');
    var $labelAcerto=$('#'+_id).find('#labelAcerto');
    var $labelErros=$('#'+_id).find('#labelErros');

    const fotos = Array.prototype.slice.call($slides);
    if(_embaralhaPergunta){
     shuffleArray(fotos);

 }
 fotos.forEach(function(element){
    $(element).hide();
})
 var $check;
 var $visualcheck;

 console.log($(fotos[0]));
 var $slideAtual = $(fotos[0]);
 $slideAtual.css({"width":"100%","left":'0px',"opacity":"1"});
 var tamanhoInicialDiv=$divOd.height();
 var tamanhoTela=window.innerHeight;
 var ctx = $progressoradial[0].getContext('2d');
 var firstProgressBar = new RadialBar(ctx, {
    x: 250,
    y: 250,
    angle: 250,
    radius: 125,
    lineWidth: 40,
    backLineFill: '#FF6000',
    lineFill: '#C7C7C7',
    bgFill: '#F2F2F2',
    isShowInfoText: true,
    infoStyle: '60px Arial'
});
 if(_dentroModulo){

    $divOd.css("height", '100%');
}




function iniciaOd(_this){
    $(_this).closest('.objetoDigital').find('.telaInicio').hide();
    $(_this).closest('.objetoDigital').find('.telaMenu').show();
    $(_this).closest('.objetoDigital').find('.quiz').fadeIn();

    $divOd.css("position",'relative');
    $slideAtual.show();
    ajustaConteudoTela();
}
$btinicio.on('click', function() {
    iniciaOd(this);
});
$('.quizInterno').each(function() {
    $qualQuiz = $(this);
    $divContainer = $('#'+_id);
    $contagemponto=$qualQuiz.find('input:checkbox').val();
    if($contagemponto){
        i_total+=1;
    }
    $divContainer.find("label.btnQuiz").click(function () {
        $('.checkmark').css("background-color","#eee");
        $('input[type="checkbox"]:checked').prop('checked',false);
        if(jogavel){
            //jogavel=false;
            $check=$(this).find('input:checkbox');
            $check.prop('checked', true);
            $visualcheck=$(this).find('.checkmark');

            $icoCertooo=$(this).parent().parent().find('#icoCerto');
            $icoErradooo=$(this).parent().parent().find('#icoErrado');

            if($check.val()=="true"){
                if(_pulaAutomaticamente){
                    jogavel=false;
                    $visualcheck.css("background-color","#6CD100");
                    i_acertos++;
                    setTimeout(function(){  
                        $visualcheck.css("background-color","#eee");
                        pulaPergunta();
                    }, 1000);
                }else{
                    $visualcheck.css("background-color","#57C2FF");
                    $btContinua.show();
                }
            }else{
                if(_pulaAutomaticamente){
                    jogavel=false;
                    $visualcheck.css("background-color","#C60000");
                    i_erros++;
                    setTimeout(function(){  
                        $visualcheck.css("background-color","#eee");
                        pulaPergunta();
                    }, 500);
                }else{
                    $visualcheck.css("background-color","#57C2FF");
                    $btContinua.show();
                }
            }

        }
    }); 
});
function ajustaConteudoTela(){
    $divOd.css("height","100%");
    setTimeout(function(){
        console.log("conteudo tela "+$divOd.height());
        console.log("divGuiFinal"+$divGuiFinal.height());
        console.log("divOd"+$divOd.height());
        if($divGuiFinal.is(":visible")){
            if($divGuiFinal.height()>$divOd.height()){
                $divOd.css("height","100%");
            }
        }else{
            if($divOd.height()<window.innerHeight){
                console.log("conteudo menor que tela");
                $divOd.css("height",window.innerHeight+'px');
            }
        }
    },150)
}
function pulaPergunta(){
    if(count<$slides.length-1){
        $slideAtual = $(fotos[count]);
        $slideAtual.hide();
        console.log("proxima");
        jogavel=true;
        count++; 
        $slideAtual = $(fotos[count]);
        $slideAtual.fadeIn();

    }else{
        $('.quizInterno').hide()
        $divGuiFinal.show();
        $slideAtual = $(fotos[count]);
        //$slideAtual.hide();

        //$divOd.css("height", tamanhoInicialDiv+'px');
        var porc=((i_acertos/i_total) * 100).toFixed(3);
        $labelAcerto.html("Acertos:"+i_acertos);
        $labelErros.html("Erros:"+i_erros);
        firstProgressBar.set(porc);
        firstProgressBar.update();

    }
    ajustaConteudoTela();
}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
$btReload.on('click', function() {
    ajustaConteudoTela();
    // $('.quizInterno').show()
    $slideAtual.hide();
    $divGuiFinal.hide();
    i_erros = 0;
    i_acertos = 0;
    count=0;
    $slideAtual2 = $(fotos[count]);
    $slideAtual2.fadeIn();
    jogavel=true;
    $('input[type="checkbox"]:checked').prop('checked',false);
    $('.checkmark').css("background-color","#eee");
    console.log("reseta");
});            
$btContinua.on('click', function() {
    $btContinua.hide();
    jogavel=false;
    if($check.val()=="true"){
        $visualcheck.css("background-color","#6CD100");
        i_acertos++;
    }else{
        $visualcheck.css("background-color","#C60000");
        i_erros++;

    }
    setTimeout(function(){
        pulaPergunta();
        $btContinua.hide();

    },1500);
});
}