/**
 * Classe do jogo
 * 
 * @author Ivanildo de Castro
 */
var sprite = new function(){
	var main = null;
	main = {
		
		/**
		 * Id da Animação
		 * 
		 */
		_idAnimation : null,
		
		/**
		 * Objeto da animação
		 * 
		 */
		_animationObject : null,
		
		/**
		 * Contator de step
		 */
		_stepCount : 0,
		
		/**
		 * Nome da classe de uso
		 * 
		 */
		_name : null,
		
		/**
		 * Inicialização da animação
		 * 
		 * @param name
		 * @param stepLength
		 * @param stepDimesion
		 * @param stepTime
		 */
		starAnimation : function(name, stepLength, stepDimesion, stepTime){
			
			main._name = name;
			
			var stepCount = 0;
			var animationObject = $('<div></div>')
										.addClass('animate_'+name)
										.css({
											width 	: stepDimesion.width,
											height 	: stepDimesion.height,
											position : 'absolute',
											top:$(window).height()/2-stepDimesion.height/2,
											left:$(window).width()/2-stepDimesion.width/2
										});
			
			$(window).resize({o:animationObject},function(e){
				var o = e.data.o;
				$(o).css({
					top:$(window).height()/2-$(o).height()/2,
					left:$(window).width()/2-$(o).width()/2
				});
			});
			
			$(animationObject).data({
				'name' : name,
				'stepLength' : stepLength,
				'stepDimesion' : stepDimesion,
				'stepTime' : stepTime
			});
			$('body').append(animationObject);
			main._animationObject = animationObject;
			main._stepCount = 1;
			main.animation();
		},
	
		/**
		 * Execução da animação
		 * 
		 * @param stepCount
		 */
		animation : function(){
			var animationObject = main._animationObject;
			
			$(animationObject).attr('class', 'animate_'+main._name+' animate_moving_' + main._stepCount);
			
			main._stepCount++;
			main._stepCount = (main._stepCount>3)?1:main._stepCount;
			
			clearTimeout(main._idAnimation);
			main._idAnimation = setTimeout(function(){
				main.animation();
			}, $(animationObject).data('stepTime'));
			
		},
		
		/**
		 * Interrompe a animação
		 * 
		 */
		stopAnimation : function(){
			clearTimeout(main._idAnimation);
			$(main._animationObject).remove();
		}
		
	
	};
	
	return main;
};