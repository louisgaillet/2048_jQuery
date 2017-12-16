(function($) {

	$.fn.game = function()
	{

		$('.new-game').click(function(){
			$('.tile ').remove();
			create();
			$('.score span').text(0);
		});
		function random(N)
		{
			return Math.floor(Math.random() * (N+1))+1;
		}

		// Permet de verifier et trouver un espace vide
		function checkSpace()
		{

			var nb =random(3) ;
			var nb2 = random(3);
			var tileNew = $('body').find('[data-x='+nb+'][data-y='+nb2+']');
			if(tileNew.length === 0)
			{
				return {x:nb , y: nb2};

			}
			else
			{
				checkSpace();
			}
		}

		function checkOver()
		{
			var count = $('.tile').length;
			if(count >= 16)
			{
				for (var x = 1; x <= 4; x++) {
					for (var y=1; y <= 3; y++) {
						var tile =  $('body').find('[data-x='+(x)+'][data-y='+y+'] .tile-inner');
						var tile = tile.text();
						var tileNext =  $('body').find('[data-x='+(x)+'][data-y='+(y+1)+'] .tile-inner');
						var tileNext = tileNext.text();
						if( tile == tileNext )
						{
							return true;
						}
					}
				}

				for (var y = 1; y <= 4; y++) {
					for (var x=1; x <= 3; x++) {
						var tile =  $('body').find('[data-x='+(x)+'][data-y='+y+'] .tile-inner');
						var tile = tile.text();
						var tileNext =  $('body').find('[data-x='+(x+1)+'][data-y='+y+'] .tile-inner');
						var tileNext = tileNext.text();
						if( tile == tileNext )
						{
							return true;
						}
					}
				}
				return false;
			}
			return true;
		}

		function viewFinish()
		{
			setTimeout(function(){
					$('.state-game ').show();
					$('.tile ').remove();
					create();
					$('.state-game ').append('<h3> Game over !!!</h3>');
				}, 200);	
		}

		// Permet de voir si le jeu est fini
		 function checkStatus()
		{
			var count = $('.tile').length;
			if(count >= 16)
			{
				return false
			}
			 return true;
		}

		// Permet de creer x nouveau bloc(s) 
		function create()
		{
			// On regarde si game over
			if(checkStatus())
			{
					var gameContainer = $('.game-container');
					var tileContainer = $('.tile-container');
					// Verification d'un  espace vide
					var position = checkSpace();
					if(typeof position === "undefined")
					{
						create();
					}
					else
					{
						x = position["x"];
						y = position["y"];
						var value = random(3) % 2 == 0 ? value =2 : value= 4;
						// Creation de la tile
						var classCss = 'tile tile-'+value+' tile-position-'+x+'-'+y; 
						var tile = "<div class='tile-new' data-x='"+x+"' data-y="+y+"> <div class='tile-inner'>"+value+"</div> </div>"
						$('body').find(tileContainer).append(tile);
						$('body').find('.tile-new').addClass(classCss);
						setTimeout(function(){
							$('body').find('.tile').removeClass('tile-new');
						}, 200);
						
					}
			}
		}

		// Supprimer et editer les classes d'un block
		function setClass(thisObj,x,y){
			var classCss = $(thisObj).attr('class');
			$(thisObj).removeClass((classCss));
			var classCss = classCss.substring(0, classCss.length - 3);
			var matches = $(thisObj).attr('class').match(/\btile-\S+/g);
			$.each(matches, function(){
			    var className = this;
			    $(thisObj).removeClass(className.toString());
			});
			$(thisObj).addClass(classCss+x+"-"+y);
			//.log(classCss+j);
			$(thisObj).attr('data-y', y);
			$(thisObj).attr('data-x', x);
		}

		function getValueFusion(thisObj)
		{
			var summ =  $(thisObj).text();
			if( parseInt(summ)== 16 )
			{
				setTimeout(function(){
					$('.state-game ').show();
					$('.tile ').remove();
					create();
					$('.state-game ').append('<h3> You win !!!</h3>');
				}, 200);	
			}
		}

		function setScore(increment)
		{
			var score = $('.score span').text();
			$('.score span').text(parseInt(score)+increment);
		}
		// Fusionne les tile ou txt = txt de tile +1
		function fusion(tile, tileNext,value)
		{
			$(tileNext).removeClass('tile-'+value);
			var actualClass = $(tileNext).attr('class');
			$(tileNext).removeClass();
			$(tileNext).addClass('tile-'+parseInt(value)*2);
			$(tileNext).addClass(actualClass);
			$(tileNext).find('.tile-inner').text(parseInt(value)*2);
			$(tile).remove();
			setScore(parseInt(value)*2);	
			getValueFusion($(tileNext).find('.tile-inner'));
		}


		// Permet de repeter le mouvementvers le haut		
		function recursiveMouvementDown(i,j,tile)
		{
			// !!! Verifier si colone full !!!
			var tileNext = $('body').find('[data-x='+i+'][data-y='+(j+1)+']');
			var value =$(tile).find('.tile-inner').text();
			var valueNext = $(tileNext).find('.tile-inner').text();
			if( tileNext.length == 0 && j<4)
			{
					setClass($(tile),i, j+1);
					recursiveMouvementDown(i,j+1,tile);
					
			}
			else
			{
				if( value == valueNext){
					setClass($(tile),i, j-1);
					fusion(tile,tileNext, value);
				}
			}
		}

				// Permet de repeter le mouvementvers le haut		
		function recursiveMouvementLeft(i,j,tile)
		{
			var tileNext = $('body').find('[data-x='+(j-1)+'][data-y='+i+']');
			var value =$(tile).find('.tile-inner').text();
			var valueNext = $(tileNext).find('.tile-inner').text();
			if( tileNext.length == 0 && j>1)
			{
					setClass($(tile),j-1, i);
					recursiveMouvementLeft(i,j-1,tile);
					
			}
			else
			{
				if( value == valueNext){
					setClass($(tile),i, j-1);
					fusion(tile,tileNext, value);
				}
			}
		}

	   // Permet de repeter le mouvement 
		function recursiveMouvementUp(i,j,tile)
		{
			var tileNext = $('body').find('[data-x='+i+'][data-y='+(j-1)+']');
			var value =$(tile).find('.tile-inner').text();
			var valueNext = $(tileNext).find('.tile-inner').text();
			
			if( tileNext.length == 0 && j>1)
			{
					 setClass($(tile), i, j-1);
					 recursiveMouvementUp(i,j-1,tile);
					
			}
			else
			{
				if( value == valueNext){
					setClass($(tile), i,j+1);
					fusion(tile,tileNext, value);
				}
			}
		}

		// Permet de repeter le mouvementvers le haut		
		function recursiveMouvementRight(i,j,tile)
		{
			// !!! Verifier si colone full !!!
			var tileNext = $('body').find('[data-x='+(j+1)+'][data-y='+(i)+']');
			var value =$(tile).find('.tile-inner').text();
			var valueNext = $(tileNext).find('.tile-inner').text();
			if( tileNext.length == 0 && j<4)
			{
					setClass($(tile), j+1, i);
					recursiveMouvementRight(i,j+1,tile);
					
			}
			else
			{
				if( value == valueNext){
					setClass($(tile), j-1, i);
					fusion(tile,tileNext, value);
				}
			}
		}

		// Gere le deplacement vers le bas
		function mooveDown()
		{
			for (var i = 0; i <= 4; i++) 
			{
				for (var j = 3; j >= 0; j--) 
				{
					var tile = $('body').find('[data-x='+i+'][data-y='+j+']');

					if($(tile).length > 0)
						$(tile).each(function(){ recursiveMouvementDown(i,j, tile) });
				}
			}
			create();
		};

		function mooveLeft()
		{
			for (var y = 1; y <= 4; y++) 
			{
				for (var x = 2; x <= 4; x++) 
				{
					var tile = $('body').find('[data-x='+x+'][data-y='+y+']');
					if($(tile).length > 0)
						$(tile).each(function(){ recursiveMouvementLeft(y,x, tile) });
				}
			}
			create();
		};


		function mooveUp()
		{
			for (var i = 1; i <= 4; i++) 
			{
				for (var j = 2; j <= 4; j++) 
				{
					var tile = $('body').find('[data-x='+i+'][data-y='+j+']');
					
					if($(tile).length > 0){
						$(tile).each(function(){ recursiveMouvementUp(i,j, tile) });
					}
				}
			}
			create();
		};

		function mooveRight()
		{
			for (var i = 0; i <= 4; i++) 
			{
				for (var j = 3; j >= 0; j--) 
				{
					var tile = $('body').find('[data-x='+j+'][data-y='+i+']');

					if($(tile).length > 0)
						$(tile).each(function(){ recursiveMouvementRight(i,j, tile) });
				}
			}
			create();
		};

	  // Permet de detecter et d'attribuer une fn en fonction de la touche choisi 
	   function whichKey(e) {
	   	e.preventDefault();
	        var code = (e.keyCode ? e.keyCode : e.which);
	        switch (code){
	        	// Verifier si x1 -(1,2,3,4) n'existe pas
	            case 40:
	                if(checkOver())
	                {
	                	mooveDown();
	                }
	                else{
	                	viewFinish();
	                }
	                break;
	            case 38:
	            	if(checkOver())
	                {
	               	mooveUp();
	               	}
	               	else{
	               		viewFinish();
	               	}
	                break;
	            case 37:
	            	if(checkOver())
	                {
	                mooveLeft();
	                }
	                else{
	                	viewFinish();
	                }
	                break;
	            case 39:
	            	if(checkOver())
	                {
	               	mooveRight();
	               	}
	               	else{
	               		viewFinish();
	               	}
	                break;
	            }
	            
	    }

	    // Game manage
		return this.each(function(){
			var gameContainer = $(this).find('.game-container');
			var tileContainer = $(this).find('.tile-container');
			create();
			$('body').on('keydown',whichKey);
		});

	}

})(jQuery);
