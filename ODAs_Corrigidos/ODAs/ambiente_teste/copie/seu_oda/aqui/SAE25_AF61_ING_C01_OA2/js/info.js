

$(document).ready(function(){

	var imageLeft, imageTop;

	var eOverlay, eContent, eButton, eImage;
	

	if (typeof configAbout.displayData == "undefined")
	{
		//we are in the old configAbout, need to figure some stuff out

		configAbout.displayData = []
		configAbout.title = gameConfig.nome

		if (typeof configAbout.version != "undefined")
			configAbout.displayData.push(["Versão", [configAbout.version]])

		if (typeof configAbout.authorship != "undefined")
			configAbout.displayData.push(["Autoria", configAbout.authorship])


		if (typeof configAbout.design != "undefined")
			configAbout.displayData.push(["Design", configAbout.design])

		if (typeof configAbout.locution != "undefined")
			configAbout.displayData.push(["Locução", configAbout.locution])
		


		configAbout.color = getClassBackgroundColor(".btn-info");


	} else {

		//we're cool, just do your shit
	}


	var overlayCssStyle = {
		'position':'absolute',
		'top': 0,
		'right':0,
		'bottom':0,
		'left':0,
		'background-color': 'black',
		'opacity': '0.9',
		'z-index': '998'
	};

	var containerCssStyle = {
		'opacity': '1',
		'position': 'absolute',
		'top':20,
		'z-index': '999',
		'min-width': "500px",
		'max-width': "600px"

	}


	var buttonCssStyle = {
		'cursor':'pointer',
		'right':'30px',
		'bottom':'10px',
		'position':'fixed',
		'z-index':'50px',
		'width': '48px',
		'height': '38px',
		'border-radius': '5px',
		'background-color': configAbout.color,
		'border': '4px solid ' + configAbout.color,
		'text-align': 'center',
		'font': '30px verdana',
		'color': 'white',
		'z-index': '30',
		'-webkit-box-shadow': '0px 0px 5px 5px rgba(255, 255, 255, .15)',
		'-moz-box-shadow': '0px 0px 5px 5px rgba(255, 255, 255, .15)',
		'box-shadow': '0px 0px 5px 5px rgba(255, 255, 255, .15)'
	};

	var headerCssStyle = {
		"height": "40px", 
		"border-top-left-radius": "10px", 
		"border-top-right-radius": "10px",
		"background-color": configAbout.color,
		"padding": "15px 40px",
		"font-size": "30px",
		"font-family": "Arial",
		"color": "#fff",
		"position": "relative"

	}

	var closeButtonCssStyle = {
		"font-size": "50px",
		"color": "#fff", 
		"position": "absolute",
		"right": "0",
		"top": "0",
		"width": "50px",
		"cursor": "pointer"
	}

	var bodyCssStyle = { 
		"background": "#fff",
		"padding": "20px 50px",
		"max-height": "350px",
		"font-size": "14px",
		"font-family": "'Trebuchet MS', Arial, Sans-serif",
		"overflow": "auto",
		"color": "#262626"
	}

	var footerCssStyle = {
		"height": "30px", 
		"border-bottom-left-radius": "10px", 
		"border-bottom-right-radius": "10px",
		"background-color": configAbout.color,
		"padding": "10px 40px",
		"font-size": "18px",
		"font-family": "'Trebuchet MS', Arial, Sans-serif",
		"color": "#fff"
	}

	var infoKeyCssStyle = {
		"font-weight": "bold",
		"font-family": "'Trebuchet MS', Arial, Sans-serif",
		"margin-bottom": "0px",
		"margin-top": "17px"
	}

	var infoValueCssStyle = {
		"margin-top": "0px"
	}






	eOverlay = $('<div class="overlayInfo">').css(overlayCssStyle);
	eButton = $("<div>i</div>").attr("id", "btn-info").css(buttonCssStyle);
	
	$(document).on("click", '.overlayInfo, #closeButtonInfo', function(){
		console.log("ssss")
		$('.overlayInfo').remove();
		$('#containerInfo').remove();
	})


	eButton.click(function(){

	


		eContainer = $("<div>").attr({
			"id": "containerInfo"
		}).css(containerCssStyle);

		eHeader = $("<div>").attr({
			"id": "headerInfo"
		}).css(headerCssStyle).html(configAbout.title)

		eCloseButton = $("<div>").attr({
			"id": "closeButtonInfo"
		}).css(closeButtonCssStyle).html("&times;").click(function(){
			$('.overlayInfo').remove();
			$('#containerInfo').remove();
		}).appendTo(eHeader);

		eHeader.appendTo(eContainer)

		eBody = $("<div>").attr({
			"id": "bodyInfo"
		}).css(bodyCssStyle);

		for (i in configAbout.displayData)
		{
			
			thisData = configAbout.displayData[i];
			key = thisData[0]
			value = thisData[1]

			$("<p>").html(key).addClass("infoKey").css(infoKeyCssStyle).appendTo(eBody)
			$("<p>").html(value.join("<br>")).addClass("infoValue").css(infoValueCssStyle).appendTo(eBody)
			

		}

		eBody.appendTo(eContainer)

		eFooter = $("<div>").attr({
			"id": "headerInfo"
		}).css(footerCssStyle).appendTo(eContainer).html("")

		eOverlay.appendTo('body');
		eContainer.appendTo('body');


		elementLeft = ($(document).width() - $("#containerInfo").width()) / 2;
		elementTop = ($(document).height() - $("#containerInfo").height()) / 2;

		
		$("#containerInfo").css({
			"top": elementTop,
			"left": elementLeft
		})


		return false;

	})

	eButton.appendTo($("body"));


})

function getStyle(className)
{
	var x, sheets,classes;
	for( sheets=document.styleSheets.length-1; sheets>=0; sheets-- ){
	    classes = document.styleSheets[sheets].rules || document.styleSheets[sheets].cssRules;
	    for(x=0;x<classes.length;x++) {
	        if(classes[x].selectorText===className) {
	            return  (classes[x].cssText ? classes[x].cssText : classes[x].style.cssText);
	        }
	    }
	}
	return false;
};

function getClassBackgroundColor(className)
{
	style = getStyle(className)
	rules = style.split(";")
	for (i in rules)
	{
		if (rules[i].indexOf("background-color") != -1)
			return rules[i].split(":")[1]
	}


}




