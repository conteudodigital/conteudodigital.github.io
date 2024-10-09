/*atualizacao 13/05/2021
foi colocado um quiz canvas, exemplo em ingles EXT 3bi u21
*/

var AppWebstories=function(_id,_dentroModulo,_delay=500,_itens=null){
    var count=0;
    var clicavel=true;
    $divOd=$('#'+_id);
    $btprox=$('#'+_id).find('#btProximo');
    $btant=$('#'+_id).find('#btAnterior');
    $btinicio=$('#'+_id).find('#btIniciaTutorial');
    $telaTuto=$('#'+_id).find('#telaTut');
    $divslides=$('#'+_id).find('#divSlides');
    $slides=$('#'+_id).find('.slideInterno');
    $containerBarrinhas=$('#'+_id).find('#barrinhaStorie-container');
    $ncanvas=$('#'+_id).find('canvas');

    $divslides.css("width",window.innerWidth + 'px');
    $divslides.css("height",window.innerHeight-50 + 'px');

    var bars=[];
    const fotos = Array.from($slides);
    const arraycanvas = Array.from($ncanvas);
    console.log(arraycanvas.length);

    for(var i=0;i<$slides.length;i++){
        /*cria barrinhas*/
        var s = document.createElement('div');
        s.setAttribute('class', 'barrinhaStorie');
        bars.push(s);
        $containerBarrinhas.append(s); 
    }

    var barrinhaStorie = $(bars[0]);
    barrinhaStorie.addClass('active');

    function iniciaOd(_this){
        $(_this).closest('.objetoDigital').find('.telaInicio').hide();
        $(_this).closest('.objetoDigital').find('.telaMenu').show();
        $(_this).closest('.objetoDigital').find('.telaTutorial').show();
        $(_this).closest('.objetoDigital').find('#divSlides').show();
        animaStorie(0,null,true);
        if(pegaRotTela()==1){
            $btprox.hide();
            $btant.hide();
        }else{
            $btprox.show();
            $btant.show();
        }

    }
    $telaTuto.on('click', function() {
        $(this).closest('.objetoDigital').find('.telaTutorial').hide();
        $btant.hide();
    });
    $btinicio.on('click', function() {
        iniciaOd(this);
    });
    const clickHandler = (e) => {
        console.log("click1");
        if(clicavel){
            clicavel=false;
            setTimeout(function(){
                clicavel=true;
                var posClicada=e.clientX /window.innerWidth;
                var countAnt=count;
                trocaSlide(posClicada,countAnt);
            },_delay)
            
        }
    }
    function trocaSlide(posClicada,countAnt){
        if(posClicada>0.2){
            if(count<$slides.length-1){
                count++; 
                animaStorie(count,countAnt);
                if(pegaRotTela()==0){$btant.show()};
            }
            if(count==$slides.length-1){
                if(pegaRotTela()==0){$btprox.hide()};
            }
        }else{
            if(count>0){
                count--;
                animaStorie(count,countAnt);
                if(pegaRotTela()==0){$btprox.show()};
            }
            if(count==0){
                if(pegaRotTela()==0){$btant.hide()};
            }
        }
        console.log("count:"+count);
    }
    function verificaVideo(_qual,_toca){
        $vid = $(_qual).find("#vid");
        if($vid.length>0){
            if(_toca){
                $vid.get(0).play();
            }else{
                $vid.get(0).pause();
            }
        }
    }
    function animaElemento(_i,_qual,_de,_para){
        $elemento = $(fotos[_i]).find(_qual);
        if($elemento.length>0){
            $elemento.css({"left":_de,"opacity":"0","display":"block"});
            $elemento.animate({left: _para,opacity:1,"display":"block"},1000,"swing");
        }
    }
    function animaStorie(_i,_iOld,_inicio=false){
        $slideAtual = $(fotos[_i]);
        $slideAntigo = $(fotos[_iOld]);
        $barrinhaStorie = $(bars[_i]);
        $progressOld = $(bars[_iOld]);
        $texto = $(fotos[_i]).find("#caixaTextoStorie");
        verificaVideo(fotos[_i],true);
        verificaVideo(fotos[_iOld],false);


        var prop1="0px";
        var prop2="-100%";
        $slideAtual.css({"width":"100%"});
        $texto.css({"width":"80vw"});

        if(_iOld>_i){
            prop1="0px";
            prop2="150%";
            if(pegaRotTela()==0){
                prop1="25%";
                prop2="75%";
                $slideAtual.css({"width":"50%","transform":"scale(1)","left":prop1,"opacity":"1"});
                $slideAntigo.css({"transform":"scale(0.8)","opacity":"0.5","left":prop2});
                $texto.css({"width":"40vw"});
                if(_iOld>0){
                    $slideAnt = $(fotos[_iOld+1]);
                    $slideAnt.hide();
                }
                if(_i<$slides.length-1){
                    $slideProx = $(fotos[_i-1]);
                    $slideProx.show();
                    $slideProx.css({"left":'-25%',"opacity":"0.5",'transform': 'scale(0.8)'}, "slow").addClass('visible');
                }
            }else{
                $slideAtual.css({"width":"100%","left":'0px',"opacity":"1"});
                $slideAntigo.css({"left":'150%'});
            }
            animaElemento(_i,"#caixaTextoStorie","-50%","50%");
            animaElemento(_i,"#slideTextos","-50%","0px");
            $progressOld.removeClass('active'); 
        }else if(_i>_iOld){
            prop1="0px";
            prop2="-100%";
            if(pegaRotTela()==0){
                prop1="25%";
                prop2="-25%";
                $slideAtual.css({"width":"50%","transform":"scale(1)","left":prop1,"opacity":"1"});
                $slideAntigo.css({"transform":"scale(0.8)","opacity":"0.5","left":prop2});

                $texto.css({"width":"40vw"});
                if(_iOld>0){
                    $slideAnt = $(fotos[_iOld-1]);
                    $slideAnt.hide();
                }
                if(_i<$slides.length-1){
                    $slideProx = $(fotos[_i+1]);
                    $slideProx.show();
                    $slideProx.css({"left":'70%',"opacity":"0.5",'transform': 'scale(0.8)'}, "slow").addClass('visible');
                }
            }else{
                $slideAtual.css({"width":"100%","left":'0px',"opacity":"1"});
                $slideAntigo.css({"left":'-100%'});
            }
            animaElemento(_i,"#caixaTextoStorie","100%","50%");
            animaElemento(_i,"#slideTextos","100%","0px");
            $barrinhaStorie.addClass('active'); 
        }else{
            if(pegaRotTela()==0){
                prop1="25%";
                prop2="-25%";
                $slideAtual.css({"width":"50%","transform":"scale(1)"});
                $slideAntigo.css({"transform":"scale(0.8)","opacity":"0.5"});
                $texto.css({"width":"40vw"});

                $slideProx = $(fotos[_i+1]);
                $slideProx.show();
                $slideProx.css({"left":'100%','transform': 'scale(0.8)',"opacity":"0.5"});
                $slideProx.animate({"left":'70%'}, "slow").addClass('visible');
            }
            animaElemento(_i,"#caixaTextoStorie","100%","50%");
            $slideAtual.animate({"left":prop1}, "slow").addClass('visible');
        }

    };
    $divslides.on('click', clickHandler);
    if(arraycanvas.length>0){
        var quant=arraycanvas.length; 
        var canvas=[];
        var stage=[];
        var fundo;
        var count=0;
        var btinicia;     
        var i_acertos=0;
        var i_erros=0;
        var txt_a;
        var txt_e;
        var corretas=[];
        var caminho="resources/image/";
        var certos=[];
        var errados=[];
        console.log("itens"+_itens.length);
        for (var i = 0; i < quant; i++) {
            retornaOrientacaoLocal(arraycanvas[i]);

            certos[i] = new createjs.Bitmap(caminho+"certo.png");
            errados[i] = new createjs.Bitmap(caminho+"errado.png");

            canvas[i] = arraycanvas[i];
            stage[i] = new createjs.Stage(canvas[i]);
            stage[i].enableMouseOver(10);
            createjs.Touch.enable(stage[i]);

            var btinicia = new createjs.Bitmap(caminho+_itens[i].fundo[0]);
            btinicia.image.onload = function(){};
            stage[i].addChild(btinicia);
            btinicia.on("click", function() {

            });         

            for (var j = 0; j < _itens[i].bts.length; j++) {
                console.log("asdasd"+_itens[i].bts[j][0]);
                var bt1 = new createjs.Bitmap(caminho+_itens[i].bts[j][0]);
                bt1.image.onload = function(){};
                stage[i].addChild(bt1);
                bt1.pode=_itens[i].bts[j][3];
                bt1.id=i;
                bt1.x=_itens[i].bts[j][1];
                bt1.y=_itens[i].bts[j][2];
                bt1.cursor = "pointer";
                bt1.on("click", function() {
                    if(clicavel){
                        clicavel=false;
                        setTimeout(function(){
                            clicavel=true;
                            var countAnt=count;
                            trocaSlide(0.5,countAnt);
                        },_delay);
                    }
                    console.log("click2");
                    if(this.pode){
                        stage[this.id].addChild(certos[this.id]);
                        certos[this.id].x=this.x;
                        certos[this.id].y=this.y-40;
                    }else{
                      stage[this.id].addChild(errados[this.id]);
                      errados[this.id].x=this.x;
                      errados[this.id].y=this.y-40;  
                  }
                  

              }); 
                bt1.on('mouseover', function() {
                    this.alpha=0.5;
                    createjs.Tween.get(this,{override:true}).to({scaleX:0.9,scaleY:0.9},250,createjs.Ease.quadOut);
                });
                bt1.on('mouseout', function() {
                    this.alpha=1;
                    createjs.Tween.get(this,{override:true}).to({scaleX:1,scaleY:1},250,createjs.Ease.quadOut);
                });     

            }


        }

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", ticker);
        function shuffle(a) {
            var j, x, i;
            for (i = a.length; i; i -= 1) {
                j = Math.floor(Math.random() * i);
                x = a[i - 1];
                a[i - 1] = a[j];
                a[j] = x;
            }
        }
        function ticker(event){
            for (var i = 0; i < quant; i++) {
                stage[i].update();
            }
        }
        function retornaOrientacaoLocal(_this){
            var widthToHeight = 16 / 9;
            var newWidth = window.innerWidth-75;
            var newHeight = window.innerHeight-75;
            var newWidthToHeight = newWidth / newHeight;
            $imgAtual = $(_this);
            if (newWidthToHeight > widthToHeight) {
                console.log("land");
                $imgAtual.css({'width':'auto','height':'100%'});
            } else {
                console.log("port");
                $imgAtual.css({'width':'100%','height':'auto'});
            }
        }
    }
    window.addEventListener('resize', function(){
        $divslides.css("width",window.innerWidth + 'px');
        $divslides.css("height",window.innerHeight-50 + 'px');
    });
}