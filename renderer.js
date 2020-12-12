// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const shell = require('shelljs');
const fs = require('fs');
const open = require("open");

var leftBlock = document.getElementById("left-block");
var leftDetailsBlock = document.getElementById("details-left-block");
var instructionsRightBlock = document.getElementById("instructions-right-block");
var listRightBlock = document.getElementById("list-right-block");
var previewBlock = document.getElementById("preview-block");
const listHeader = document.getElementById("list-header");
const galleryCell = document.getElementsByClassName("gallery-cell");
const playButton = document.getElementById("left-block-play");
const closeButton = document.getElementById("left-block-close");
const wave1 = document.getElementsByClassName("wave");
const wave2 = document.getElementsByClassName("wave2");
const setupBlock = document.getElementById("setup-block");

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

// Hover over game card
$(".gallery-cell").hover(function(hoverEvent) {
    console.log(getGameData(hoverEvent.target.id));
    //getGameData(hoverEvent.target.id)

    $(wave1).fadeOut();
    $(wave2).fadeOut();
    $(previewBlock).fadeIn();
  
    focusTitle()
  }, function() {
    //$(leftBlock).delay(1000).fadeIn();
    $(wave1).delay(1000).fadeIn();
    $(wave2).delay(1000).fadeIn();
    $(previewBlock).fadeOut();
    player.stop();

    focusTitle("Game Library");
});


// Controls click event on a cell
$(galleryCell).click(function(clickEvent) {
  //console.log(flkty.selectedIndex);
  displayGameData(clickEvent.target.id);
});


// Controls click event of close button
$(closeButton).click(function(clickEvent) {
  $(leftDetailsBlock).delay(1000).fadeOut();
  $(leftBlock).delay(1500).fadeIn();
  $(wave1).fadeIn();
  $(wave2).fadeIn();
  $("#list-header").fadeIn();
  $("#preview-block").fadeOut();
  player.stop();
});

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
function displayGameData(gameId) {
  player.stop();
  $(previewBlock).fadeOut();
  $(leftBlock).delay(500).fadeOut();
  $(wave1).delay(2000).fadeIn();
  $(wave2).delay(2000).fadeIn();
  
  $(leftDetailsBlock).delay(1000).fadeIn();
}


function pullGameDetailsDrawer(name, desc) {
  if ($(leftBlock).css('display') == 'none') {
    //console.log(name + " " + desc + " hidden");

  } else {
    //console.log("shown");
  }
}

function setGameData() {
}

// Retrieves game details from gameData.json file
function getGameData(gameId) {
  let returnItem; 
  fs.readFile("./data/gameData.json", function(err, data) {
    if (err) throw err; 
    let gameData = JSON.parse(data); 

    gameData.forEach(function(item, index) {
      if (item.id == gameId) {
        loadPreviewPlayer(item.preview);
        returnItem = {
          "name": item.name,
          "year": item.year,
          "preview": item.preview,
          "developer": item.developer,
          "description": item.description
        }
      }
    });
    //console.log(returnItem);
    return returnItem.name;
  });
  return 0;
}

$(document).ready(function() {
  let dependencies = fs.readFileSync('./data/dependencies.json');
  let proccessedDependencies = JSON.parse(dependencies);

  // launches main dash only if Docker has been installed
  if (proccessedDependencies.docker == true) {
    launchMainDash();
  }
});


// Classes

class Game {
  constructor(name, year, preview, developer, description) {
    this.name = name;
    this.year = year;
    this.preview = preview;
    this.developer = developer;
    this.description = description;
  }

  get data() {
    return this.getGameData();
  }

  getGameData() {

  }
}


