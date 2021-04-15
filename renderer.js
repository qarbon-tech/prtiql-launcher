// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const shell = require('shelljs');
var fs = require('fs');
const open = require("open");
var Mousetrap = require("mousetrap");

var leftBlock = document.getElementById("left-block");
var leftDetailsBlock = document.getElementById("details-left-block");
var instructionsRightBlock = document.getElementById("instructions-right-block");
var listRightBlock = document.getElementById("list-right-block");
var previewBlock = document.getElementById("preview-block");
//const listHeader = document.getElementById("list-header");
const galleryCell = document.getElementsByClassName("gallery-cell");
const playButton = document.getElementById("left-block-play");
const closeButton = document.getElementById("left-block-close");
const wave1 = document.getElementsByClassName("wave");
const wave2 = document.getElementsByClassName("wave2");
const setupBlock = document.getElementById("setup-block");
const gameTitle = document.getElementById("game-title");
const gameDescription = document.getElementById("game-desc");

const playTerminal = document.getElementById("game-play-terminal");

/*
Button Functionality
*/

// intialize dependencies and install Partiql
$("#intialize-btn").click(function() {

  terminal.echo("Installing Docker...");
  shell.exec('sh script.sh', function(code, stdout, stderr) {
    if (code == 0) {
      terminal.echo("[[;green;]Docker installation successful]");
      
      // Writes Docker installation config to JSON if install successful
      let dependencies = fs.readFileSync('./data/dependencies.json');
      let proccessedDependencies = JSON.parse(dependencies);
      proccessedDependencies.docker = true;
      fs.writeFile("./data/dependencies.json", JSON.stringify(proccessedDependencies), function() {
        console.log(proccessedDependencies);
      });
      terminal.echo("[[;green;]Saved Configuration]");

      setTimeout(function(){
        terminal.echo("[[;green;]\nPlease restart machine for changes]");
      },1000);
    } else {
      terminal.echo("[[;red;]Docker installation failed]");
    }
  });
  
});


// Controls click event on game card
$(galleryCell).click(function(clickEvent) {
  //console.log(flkty.selectedIndex);
  displayGameLaunchWindow(clickEvent.target.id);
});


// Controls click event of close button
$(closeButton).click(function(clickEvent) {
  closeGameLaunch();
});

function closeGameLaunch() {
  $(leftDetailsBlock).delay(1000).fadeOut();
  $(leftBlock).delay(1500).fadeIn();
  $(wave1).fadeIn();
  $(wave2).fadeIn();
  //$("#list-header").fadeIn();
  $("#preview-block").fadeOut();
  player.stop();
}

// Controls click event of play button
$(playButton).click(function(clickEvent) {
  $(playTerminal).fadeIn();
  open("http://www.google.com");
});

/*
Function declaration
*/

// Displays title of game when hovering over icon
function focusTitle(gameTitle) {
  $(listHeader).fadeOut(function() {
    $(this).text(gameTitle);
  }).fadeIn();
}

// Launches main dashboard 
function launchMainDash() {
  setupBlock.classList.add('animated', 'fadeOutUp');
  
  listRightBlock.style.visibility = "visible";
  listRightBlock.classList.add('animated', 'fadeInUp');
  $(wave1).delay(2000).fadeIn();
  $(wave2).delay(2500).fadeIn();
}

// Loads the preview player with trailer for game
function loadPreviewPlayer(youtubeID) {
  player.source = {
    type: 'video',
    sources: [
        {
            src: youtubeID,
            provider: 'youtube',
        },
    ],
  };
  player.on('ready', () => {
    player.play();
  })
  
}

// Pulls the game details drawer from left side
function displayGameLaunchWindow(gameId) {
  //player.stop();
  //$(previewBlock).fadeOut();
  $(leftBlock).delay(500).fadeOut();
  //$(wave1).delay(2000).fadeIn();
  //$(wave2).delay(2000).fadeIn();
  
  $(leftDetailsBlock).delay(1000).fadeIn();

  let gameData = fs.readFileSync('./data/gameData.json');
  let formattedGameData = JSON.parse(gameData);

  formattedGameData.forEach(function(item, index) {
    if (item.id == gameId) {
      //loadPreviewPlayer(item.preview);

      $(gameTitle).fadeOut(function() {
        $(this).text(item.name);
      }).fadeIn();
      $(gameDescription).fadeOut(function() {
        $(this).text(item.description);
      }).fadeIn();
    }
  });
}


function pullGameDetailsDrawer(name, desc) {
  if ($(leftBlock).css('display') == 'none') {
    //console.log(name + " " + desc + " hidden");

  } else {
    //console.log("shown");
  }
}

// Retrieves game details from gameData.json
function displayGamePreview(gameId) {
  let gameData = fs.readFileSync('./data/gameData.json');
  let formattedGameData = JSON.parse(gameData);

  formattedGameData.forEach(function(item, index) {
    if (item.id == gameId) {
      loadPreviewPlayer(item.preview);
    }
  });
}

$(document).ready(function() {

  // Initialize game library
  var elem = document.querySelector('.gallery');
  flkty = new Flickity(elem, {
      cellAlign: 'left',
      contain: true,
      prevNextButtons: false,
      accessibility: true
  });

  let dependencies = fs.readFileSync('./data/dependencies.json');
  let proccessedDependencies = JSON.parse(dependencies);

  // launches main dash only if Docker has been installed
  if (proccessedDependencies.docker == true) {
    if (proccessedDependencies.firstLaunch == true) {
       proccessedDependencies.firstLaunch == false;
       fs.writeFile("./data/dependencies.json", JSON.stringify(proccessedDependencies), function() {
         console.log(proccessedDependencies);
       });
      var sound = new Howl({
        src: ['./assets/audio/startup.mp3']
      });
      
      sound.play();

      setTimeout(function(){
        launchMainDash();
      },6400);
    } else {
      launchMainDash();
    }
  }

  // click right button to scroll game list towards right
  Mousetrap.bind('right', function() {  
    flkty.next('next');
    //console.log(flkty.selectedIndex);
    //console.log(flkty.selectedElement.id);
    //document.getElementById(flkty.selectedElement.id).style.transform = "scale(0.9)";

    $(wave1).delay(1000).fadeIn();
    $(wave2).delay(1000).fadeIn();
    $(previewBlock).fadeOut();
    player.stop();
  });

  // click left button to scroll game list towards left
  Mousetrap.bind('left', function() { 
    flkty.previous('previous');

    $(wave1).delay(1000).fadeIn();
    $(wave2).delay(1000).fadeIn();
    $(previewBlock).fadeOut();
    player.stop();
  });

  // show game preview on enter click
  Mousetrap.bind('enter', function() {
    console.log(flkty.selectedElement.id);
    displayGamePreview(flkty.selectedElement.id);

    $(wave1).fadeOut();
    $(wave2).fadeOut();
    $(previewBlock).fadeIn();
  });

  Mousetrap.bind('command+enter', function() {
    displayGameLaunchWindow(flkty.selectedElement.id);
  });

  Mousetrap.bind('esc', function() {
    closeGameLaunch();
  });
});





