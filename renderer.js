// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

document.getElementById("intialize-btn").onclick = function() {myFunction()};
function myFunction() {
  var element1 = document.getElementById("instructions-right-block");
  element1.classList.add('animated', 'fadeOutUp');

  var element2 = document.getElementById("list-right-block");
  element2.style.visibility = "visible";
  element2.classList.add('animated', 'fadeInUp');
}






