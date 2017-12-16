(function($) {

	$.fn.game = function()
	{


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

		// Permet de voir si le jeu est fini
		 function checkStatus()
		{
			var count = $('.tile').length;
			if(count == 16)
			{
				return false;
			}
			return true;
		}

		// Permet de creer x nouveau bloc(s) 
		function create(nbr, thisObj)
		{
			// On regarde si game over
			if(checkStatus())
			{
				var i = 1;
				while( i <= nbr){
					var gameContainer = $('.game-container');
					var tileContainer = $('.tile-container');
					// Verification d'un  espace vide
					var position = checkSpace();
					if(typeof position === "undefined")
					{
						create(1);
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
						$('body').find('.tile').removeClass('tile-new');
					}

					i++;
				}
			}
			else
			{
				alert('Game over');
			}
		}

		// Supprimer et editer les classes d'un block
		function setClass(thisObj, y){
			var classCss = $(thisObj).attr('class');
			$(thisObj).removeClass((classCss));
			var classCss = classCss.substring(0, classCss.length - 1);
			$(thisObj).addClass(classCss+y);
			//.log(classCss+j);
			$(thisObj).attr('data-y', y);
		}


		// Fusionne les tile ou txt = txt de tile +1
		function fusion(tile, tileNext,value)
		{
			// !!! Check tile-n !!!
			$(tileNext).removeClass('tile-'+value);
			var actualClass = $(tileNext).attr('class');
			console.log(actualClass);
			$(tileNext).removeClass();
			$(tileNext).addClass('tile-'+parseInt(value)*2);
			$(tileNext).addClass(actualClass);
			$(tileNext).find('.tile-inner').text(parseInt(value)*2);
			$(tile).remove();
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
					setClass($(tile), j+1);
					recursiveMouvementDown(i,j+1,tile);
					
			}
			else
			{
				if( value == valueNext){
					setClass($(tile), j-1);
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
					 setClass($(tile), j-1);
					 recursiveMouvementUp(i,j-1,tile);
					
			}
			else
			{
				if( value == valueNext){
					setClass($(tile), j+1);
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
				console.log('on avance');
					setClass($(tile), j+1);
					recursiveMouvementRight(i,j+1,tile);
					
			}
			else
			{
				if( value == valueNext){
					setClass($(tile), j-1);
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
			create(1);
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
			create(1);
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
			//create(1);
		};






	  // Permet de detecter et d'attribuer une fn en fonction de la touche choisi 
	   function whichKey(e) {
	   	e.preventDefault();
	        var code = (e.keyCode ? e.keyCode : e.which);
	        switch (code){
	            case 40:
	                mooveDown();
	                break;
	            case 38:
	               	mooveUp();
	                break;
	            case 37:
	                alert("left");
	                break;
	            case 39:
	               mooveRight();
	                break;
	            }
	            
	    }

	    // Game manage
		return this.each(function(){
			var gameContainer = $(this).find('.game-container');
			var tileContainer = $(this).find('.tile-container');
			//create(1, $(this));
			$('body').on('keydown',whichKey);
		});

	}


})(jQuery);
