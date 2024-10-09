/*versao 9/10/2020
refacao quase total
*/
var ex_AppQuadrinho = function (
	_id,
	_dentroModulo,
	modoEdicao, 
	_itensTemp,
	_enunciado, 
	_idioma, 
	_sons) {
	var caminho = "resources/image/",
	stages=[],
	content= [],
	contentFundo= [],
	contentPers= [],
	contentDialogos= [],
	contentUI= [],
	count = 0,
	inicio1 = false,
	canvasTodos=[],
	ativo=0,
	update=true,
	cliqueDuplo=false,
	itens=[],
	molduras=[],
	textoSelect,
	textoBalao="...",
	moldurasAtivas=[],
	sons=_sons,
	t;

	$divOd=$('#'+_id);
	$btinicio=$('#'+_id).find('#btIniciaTutorial');
	$btimgs=$('#'+_id).find('#botoesImagens');
	$btgrav=$('#'+_id).find('#botoesGravacao');
	$btfundo=$('#'+_id).find('#btcxfundo');
	$btperso=$('#'+_id).find('#btcxperso');
	$btbalao=$('#'+_id).find('#btcxbalao');
	$btadd=$('#'+_id).find('#btcxadd');
	$btgravar=$('#'+_id).find('#btcxgravar');
	$btfecha=$('#'+_id).find('#btfechabalao');
	$btTutoL=$('#'+_id).find('#tutoLand');
	$btTutoP=$('#'+_id).find('#tutoPort');
	$divCanvas = $('#'+_id).find("#divCanvas");
	$cxFundos = $('#'+_id).find("#caixaFundos");
	$cxPersonagens = $('#'+_id).find("#caixaPersonagens");
	$cxBaloes = $('#'+_id).find("#caixaBaloes");
	$canvas=$('#'+_id).find('.canvas_hq');
	console.log($canvas.length);

	if(_dentroModulo){
		$divOd.css("position",'relative');
		$divOd.css("height",window.innerHeight + 'px');
		//$divOd.height();
	}
	function iniciaTutorial(_this){
		$(_this).closest('.objetoDigital').find('.telaInicio').hide();
		$(_this).closest('.objetoDigital').find('.telaTutorial').show();
	}
	function iniciaOd(_this){
		$(_this).closest('.objetoDigital').find('.telaTutorial').hide();
		$(_this).closest('.objetoDigital').find('.telaMenu').show();
		$(_this).closest('.objetoDigital').find('#divCanvas').show();
		$btimgs.show();
		$cxFundos.show();
		$btgrav.show();
		inicio1 = true;

		addCanvas();
		mudaMoldAtiva(count);
		$divOd.css("height",window.innerHeight + 'px');
		count++;  
		
	}
	var imgLoader1 = document.getElementById('upload1');
	var imgLoader2 = document.getElementById('upload2');
	imgLoader1.addEventListener('change', carregaImagem, false);
	imgLoader2.addEventListener('change', carregaImagem, false);
	function carregaImagem(evt) {
		var files = evt.target.files; 
		console.log(evt.target.name);
		for (var i = 0, f; f = files[i]; i++) {
			if (!f.type.match('image.*')) {
				continue;
			}
			var reader = new FileReader();
			reader.onload = (function(theFile) {
				return function(e) {
					var img = new Image();
					img.onload = function(){
						colocaAssetPersonagem(ativo,img,Number(evt.target.name));
					}
					img.src = e.target.result;
					
				};
			})(f);

			reader.readAsDataURL(f);
		}
	}	
	$btgravar.click(function (){
		tiraPrint();
	});	
	$btfecha.click(function (){
		$(".caixaTextoBalao").hide();
		textoBalao=document.getElementById("textodobalao").value;
		caixaTexto(textoSelect);
	});

	$('.btimgFundo').each(function() {
		$(this).click(function () {
			colocaAssetPersonagem(ativo,$(this).attr('src'),0);

		});
	});	
	$('.btimgPersonagem').each(function() {
		$(this).click(function () {
			colocaAssetPersonagem(ativo,$(this).attr('src'),1);

		});
	});	
	$('.btimgBalao').each(function() {
		$(this).click(function () {
			colocaAssetPersonagem(ativo,$(this).attr('src'),2);

		});
	});
	$btadd.on('click', function() {
		addCanvas();
		mudaMoldAtiva(count);
		$divOd.css("height",window.innerHeight + 'px');
		count++;     
	});		
	$btfundo.on('click', function() {
		$cxFundos.show();
		$cxPersonagens.hide();
		$cxBaloes.hide();
	});		
	$btperso.on('click', function() {
		$cxFundos.hide();
		$cxPersonagens.show();
		$cxBaloes.hide();
	});		
	$btbalao.on('click', function() {
		$cxFundos.hide();
		$cxPersonagens.hide();
		$cxBaloes.show();
	});	
	$btinicio.on('click', function() {
		iniciaTutorial(this);
	});
	$btTutoP.on('click', function() {
		iniciaOd(this);
	});
	$btTutoL.on('click', function() {
		iniciaOd(this);
	});	

	createjs.Ticker.setFPS(30);
	createjs.Ticker.on("tick", ticker);
	function tiraPrint() {
		for(var i=0;i<moldurasAtivas.length;i++){
			moldurasAtivas[i].visible=false;
			contentUI[i].visible=false;
		}
		$divCanvas.css('width',$divCanvas.outerWidth()+'px');
		$divCanvas.css('height',$divCanvas.outerHeight()+'px');
		$divCanvas.css('overflow' , 'visible');
		$divCanvas.css('marginLeft' , '10px');
		$divCanvas.css('marginTop' , '10px');
		$divCanvas.css('padding' , '0px');
		setTimeout(function(){
			var node = $divCanvas.get(0);
			domtoimage.toPng(node)
			.then(function (dataUrl) {
				var img = new Image();
				img.src = dataUrl;
				window.open(dataUrl, "toDataURL() image", "width=800, height=800");
				$divCanvas.css('overflow' , 'auto');
				$divCanvas.css('marginLeft' , '15%');
				$divCanvas.css('padding' , '35px');
			})
			.catch(function (error) {
				console.error('oops, something went wrong!', error);
			});
		},250);
	}
	function addCanvas(){
		var ca = document.createElement("canvas");
		ca.width=512;
		ca.height=512;
		ca.setAttribute("name", count);           
		ca.setAttribute("class", "canvas_hq");           
		$divCanvas.append(ca); 
		var stg=new createjs.Stage(ca);
		stg.nome=count;

		var i=count;

		stg.enableMouseOver();
		stg.mouseMoveOutside = true;
		createjs.Touch.enable(stg);
		contentPers[i] = new createjs.Container();
		contentDialogos[i] = new createjs.Container();
		contentFundo[i] = new createjs.Container();
		contentUI[i] = new createjs.Container();
		var fundo = new createjs.Shape();
		fundo.id=i;
		fundo.graphics.beginFill("#ffffff").drawRect(0, 0, 512, 512);
		stg.addChild(fundo);
		fundo.on("mousedown", function (evt) {

			mudaMoldAtiva(this.id);
		});
		stg.addChild(contentFundo[i]);
		stg.addChild(contentPers[i]);
		stg.addChild(contentDialogos[i]);
		stg.addChild(contentUI[i]);

		molduras[i] = new createjs.Shape();
		molduras[i].graphics.beginStroke("#000000").setStrokeStyle(8).drawRect(0, 0, 512, 512);
		stg.addChild(molduras[i]);
		moldurasAtivas[i] = new createjs.Shape();
		moldurasAtivas[i].graphics.beginStroke("red").setStrokeStyle(8).drawRect(0, 0, 512, 512);
		stg.addChild(moldurasAtivas[i]);
		moldurasAtivas[i].visible=false;
		contentUI[i].visible=false;

		criabtapagar(i,"resources/image/bt_apagar.png");
		stages.push(stg);

	}
	function mudaMoldAtiva(_i){
		ativo=_i;
		for(var i=0;i<moldurasAtivas.length;i++){
			if(i==ativo){
				console.log("selec:"+ativo);
				moldurasAtivas[ativo].visible=true;
				contentUI[ativo].visible=true;
			}else{
				moldurasAtivas[i].visible=false;
				contentUI[i].visible=false;
			}
		}
	}
	function criabtapagar(_i,_src){
		var img = new createjs.Bitmap(_src);
		img.id=_i;
		contentUI[_i].addChild(img);
		img.x=512-64;
		img.x=512-64;
		img.image.onload = function(){
			img.on("mousedown", function (evt) {
				$('canvas[name ="'+this.id+'"]').remove();
				//stages.splice(this.id, 1);
				for(var i=0;i<stages.length;i++){
					if(stages[i].nome==this.id){
						stages.splice(i, 1);
					}
				}
				console.log(stages.length);
				//count--;
			});
		}
	}
	function colocaAssetPersonagem(_i,_src,_tipo) {
		var img = new createjs.Container();
		var preimg = new createjs.Bitmap(_src);
		img.addChild(preimg);
		img.id=_i;
		img.tipo=_tipo;
		var escala=1;
		if(_tipo==0){
			contentFundo[_i].removeAllChildren();
			contentFundo[_i].addChild(img);
		}else if(_tipo==1){
			contentPers[_i].addChild(img);
			console.log("personagem "+_src);
			img.scaleX=0.6;
			img.scaleY=0.6;

		}else if(_tipo==2){

			preimg.image.onload = function(){
				contentDialogos[_i].addChild(img);
				img.largura=preimg.getBounds().width;
				img.altura=preimg.getBounds().height;
				caixaTexto(img,"testando testando testando testando testando testando testando testando ",_i);


			};

			img.scaleX=0.6;
			img.scaleY=0.6;

		}
		console.log(_i);


		img.on("mousedown", function (evt) {
			evt.target.cursor = "grabbing";
			var global = stages[0].localToGlobal(this.x, this.y);
			this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
			var local = stages[0].globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
			this.py = Math.floor(local.y);
			this.px = Math.floor(local.x);
			mudaMoldAtiva(this.id);
			this.parent.addChild(this);
		});
		img.on("pressmove", function (evt) {
			var local = stages[0].globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
			this.x = Math.floor(local.x);
			this.y = Math.floor(local.y);

		});			
		img.on("mouseover", function (evt) {
			evt.target.cursor = "grab";
		});
		img.on("pressup", function (evt) {
			console.log(Math.abs(this.px - this.x));
			console.log(Math.abs(this.py - this.y));
			if(Math.abs(this.px - this.x)<5 && Math.abs(this.py - this.y)<5){
				if(this.tipo==2){
					var txt = this.getChildByName("versao");
					if(txt){
						console.log("achei");
						this.removeChild(txt);
					}
					textoSelect=this;

					setTimeout(function(){
						if(!cliqueDuplo){
							$(".caixaTextoBalao").show();
							cliqueDuplo=false;
						}
					},600);
				}

			}else{
				cliqueDuplo=false;
			}
		});			
		img.on("dblclick", function (evt) {
			cliqueDuplo=true;
			console.log(cliqueDuplo);
			if(this.tipo==0){
				contentFundo[this.id].removeChild(this);
			}else if(this.tipo==1){
				contentPers[this.id].removeChild(this);
			}else if(this.tipo==2){
				contentDialogos[this.id].removeChild(this);
			}
		});

	}
	function caixaTexto(_img){
		var _tamanhoTexto=document.getElementById("tTexto").value;
		var txt = new createjs.Text(textoBalao, _tamanhoTexto+"px pinkchicken", "#000000");
		txt.name="versao";
		txt.lineWidth=_img.largura-90*2;
		txt.x=_img.largura/2;
		txt.y=_img.altura/2;
		txt.textAlign ="center";
		txt.textBaseline ="middle";
		console.log(txt.getBounds().height);
		txt.regY=txt.getBounds().height/2;

		_img.addChild(txt);
	}

	function criaDebug() {
		var myJSON = JSON.stringify(_itensTemp,null,0);

		console.clear();
		console.log(myJSON);
	}


	function ticker(event) {
		for(var i=0;i<stages.length;i++){
			if(update){
				stages[i].update();

			}
		}
	}

}