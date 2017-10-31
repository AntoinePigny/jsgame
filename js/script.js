$(document).ready(function()  {
  function init() {
    if(localStorage.getItem('gameState') == null) {
      localStorage.setItem('gameState', 'optionScreen');
      displayScreen(localStorage.getItem('gameState'))
    } else {
      if (localStorage.getItem('gameState') == 'playScreen') {
        generateGame();
      }
      displayScreen(localStorage.getItem('gameState'))
    }
  }


  function generateGame() {
    //JSON parse sert a transformer une chaine de carac en obj JSON pour la traiter dans la fonction
    var baseX = JSON.parse(localStorage.getItem('gameAxes')).x; //ici on accede a l'objet nouvellement recréé et a sa propriété x
    var baseY = JSON.parse(localStorage.getItem('gameAxes')).y;
    var playScreen = $('section[data-state="playScreen"]'); //on passe en variable les données de la section (c'est un array) donc pour avoir rpecisement le html on prend l'entrée 0 de cet array
    var html = "<div style='width:" + baseX * 40 + "px' class='game-container'>";
    for (var y = 1; y <= baseY; y++) {
      for (var x = 1; x <= baseX ; x++) {
        html += "<div data-x='" + x + "' data-y='" + y + "' class='game-div'></div>";
      };
    };
    html += "</div>"
    $(playScreen).html(html);
    insertObjects();
  }


  function insertObjects(){
    if (localStorage.getItem('playerPos') == null) {
      var pos = {
        "x": 1,
        "y": 1
      };
      localStorage.setItem('playerPos', JSON.stringify(pos));
    };
    if (localStorage.getItem('goalPos') == null) {
      var pos = {
        "x": JSON.parse(localStorage.getItem('gameAxes')).x,
        "y": JSON.parse(localStorage.getItem('gameAxes')).y
      };
      localStorage.setItem('goalPos', JSON.stringify(pos));
    };
    var playerPos = JSON.parse(localStorage.getItem('playerPos'));
    var goalPos = JSON.parse(localStorage.getItem('goalPos'));
    $('.game-div[data-x="' + playerPos.x + '"][data-y="' + playerPos.y + '"]').html('<img style="width:100%;height:100%;" src="/vivi.jpg">');
    $('.game-div[data-x="' + goalPos.x + '"][data-y="' + goalPos.y + '"]').html('<img style="width:100%;height:100%;" src="/door.png">');
    $('body').on('keydown', function(e) {
      if(e.keyCode == 38/* UP */) {
        movePlayer('UP');
      } else if (e.keyCode == 40/* Down */) {
        movePlayer('DOWN');
      } else if (e.keyCode == 37/* Left */) {
        movePlayer('LEFT');
      } else if (e.keyCode == 39/* Right */) {
        movePlayer('RIGHT');
      }
    });
  }
  function checkVictory(currentPlayerPos) {
    if (currentPlayerPos.x == JSON.parse(localStorage.getItem('goalPos')).x && currentPlayerPos.y == JSON.parse(localStorage.getItem('goalPos')).y) {
      displayScreen('victory')
      localStorage.setItem('gameState', 'victory')
    }
  }

  function movePlayer(direction) {
    var currentPlayerPos = JSON.parse(localStorage.getItem('playerPos'));
    var gameSize = JSON.parse(localStorage.getItem('gameAxes'));
    if (direction == 'UP') {
      if ((currentPlayerPos.y - 1) > 0) {
        //on prend la position du joueur telle qu'elle etait avant et on vide la case via html('')
        $('.game-div[data-x="' + currentPlayerPos.x + '"][data-y="' + currentPlayerPos.y + '"]').html('');
        currentPlayerPos.y -= 1;
        $('.game-div[data-x="' + currentPlayerPos.x + '"][data-y="' + currentPlayerPos.y + '"]').html('<img style="width:100%;height:100%;" src="/vivi.jpg">');
        checkVictory(currentPlayerPos);
        localStorage.setItem('playerPos', JSON.stringify(currentPlayerPos));
      } else {
        console.log('aie !');
      }
    } else if (direction == 'DOWN') {
      if ((currentPlayerPos.y + 1) <= gameSize.y) {
        //on prend la position du joueur telle qu'elle etait avant et on vide la case via html('')
        $('.game-div[data-x="' + currentPlayerPos.x + '"][data-y="' + currentPlayerPos.y + '"]').html('');
        currentPlayerPos.y += 1;
        $('.game-div[data-x="' + currentPlayerPos.x + '"][data-y="' + currentPlayerPos.y + '"]').html('<img style="width:100%;height:100%;" src="/vivi.jpg">');
        checkVictory(currentPlayerPos);
        localStorage.setItem('playerPos', JSON.stringify(currentPlayerPos));
      } else {
        console.log('aie !');
      }

    } else if (direction == 'LEFT') {
      if ((currentPlayerPos.x - 1) > 0) {
        //on prend la position du joueur telle qu'elle etait avant et on vide la case via html('')
        $('.game-div[data-x="' + currentPlayerPos.x + '"][data-y="' + currentPlayerPos.y + '"]').html('');
        currentPlayerPos.x -= 1;
        $('.game-div[data-x="' + currentPlayerPos.x + '"][data-y="' + currentPlayerPos.y + '"]').html('<img style="width:100%;height:100%;" src="/vivi.jpg">');
        checkVictory(currentPlayerPos);
        localStorage.setItem('playerPos', JSON.stringify(currentPlayerPos));
      } else {
        console.log('aie !');
      }

    } else if (direction == 'RIGHT') {
      if ((currentPlayerPos.x + 1) <= gameSize.x) {
        //on prend la position du joueur telle qu'elle etait avant et on vide la case via html('')
        $('.game-div[data-x="' + currentPlayerPos.x + '"][data-y="' + currentPlayerPos.y + '"]').html('');
        currentPlayerPos.x += 1;
        $('.game-div[data-x="' + currentPlayerPos.x + '"][data-y="' + currentPlayerPos.y + '"]').html('<img style="width:100%;height:100%;" src="/vivi.jpg">');
        checkVictory(currentPlayerPos );
        localStorage.setItem('playerPos', JSON.stringify(currentPlayerPos));
      } else {
        console.log('aie !');
      }

    }
    //debugger;
  }


  // fonction pour afficher l'ecran correspondant a la valeur de gameState (via ajout/retrait de la classe hidden)
  function displayScreen(gameState) {
    $.each($('section[data-state!="' + gameState + '"]'), function(key, value) {
      $(this).addClass('hidden');
    });
    $('section[data-state="' + gameState + '"]').removeClass('hidden');
  }

//Event listener sur le bouton startGame
  $('button[data-action="startGame"]').on('click', function(){
    var baseX = $('input[name="x"]').val();
    var baseY = $('input[name="y"]').val();
    if (baseX == "" || baseY == ""){
      alert('X et Y doivent être remplis !')
    } else {
      //cette syntaxe permet de créer une variable en objet JSON
      var axes = {
        "x": baseX,
        "y": baseY
      };
      // JSON.stringify Prend un objet json et le transforme en chaine de caractère sous l'argument spécifié devant
      localStorage.setItem('gameAxes', JSON.stringify(axes));
      localStorage.setItem('gameState', 'playScreen');
      generateGame();
      displayScreen(localStorage.getItem('gameState'));
    }
  });

  $('button[data-action="reset"]').on('click', function() {
    localStorage.clear();
    location.reload();
  });



  init();
});
