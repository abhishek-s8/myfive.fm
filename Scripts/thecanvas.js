function showInput() {
  var user = document.getElementById("user_input").value;
  var duration = document.getElementById("user_input3").value;
  let requestURL = 'https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user='+user+'&period='+duration+'&api_key=ea3b91183e716133eaa1725b4eb0b901&format=json';
  let request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();
  request.onload = function() {
    const rankings = request.response;
    try {
      showRankings(rankings);
    } catch(e) {
      alert('Entered wrong username. Please try again with valid username.');
    }
  }
}

function showRankings(obj) {
  const albums = obj['topalbums']['album'];

  if (! canvas || ! canvas.getContext) { return false; }

  var background = new Image();
  background.src = "./Images/"+document.getElementById("user_input4").value;

  background.onload = function() {

    var albumCovers = new Array();
    albumCovers[0] = new Image();
    albumCovers[1] = new Image();
    albumCovers[2] = new Image();
    albumCovers[3] = new Image();
    albumCovers[4] = new Image();

    try {
      //get the album images
      for (let i = 0; i < 5; i++) {  
        albumCovers[i].src = albums[i].image[3]['#text'];
        if (albums[i].image[3]['#text'] == "") {
          albumCovers[i].src = "./Images/case.jpg";
        }
      }

      //put on the album images
      albumCovers[0].onload = function() {
           ctx.drawImage(albumCovers[0], 225, 300, 250, 250);
       }
      albumCovers[1].onload = function() {
           ctx.drawImage(albumCovers[1], 225, 625, 250, 250);
       }
      albumCovers[2].onload = function() {
           ctx.drawImage(albumCovers[2], 225, 950, 250, 250);
       }
      albumCovers[3].onload = function() {
           ctx.drawImage(albumCovers[3], 225, 1275, 250, 250);
       }
      albumCovers[4].onload = function() {
           ctx.drawImage(albumCovers[4], 225, 1600, 250, 250);
       }

      //duration header
      ctx.drawImage(background, 0, 0, x, y);
      ctx.font = "bold 45px verdana, sans-serif ";
      if (document.getElementById("user_input3").value == "overall") {
        var duration = "All Time"
      } else if (document.getElementById("user_input3").value == "12month") {
        var duration = "This Year"
      } else if (document.getElementById("user_input3").value == "6month") {
        var duration = "6 Months"
      } else if (document.getElementById("user_input3").value == "3month") {
        var duration = "3 Months"
      } else if (document.getElementById("user_input3").value == "1month") {
        var duration = "This Month"
      } else if (document.getElementById("user_input3").value == "7day") {
        var duration = "This Week"
      } else { 
        var duration = "Top 5"
      }
      ctx.fillStyle = document.getElementById("user_input5").value;  
      ctx.fillText(duration, 75, 175);

      //name header
      ctx.font = "bold 60px verdana, sans-serif";
      if (document.getElementById("user_input2").value != "" && document.getElementById("user_input2").value.length > 16) {
        var name = "Your Top Albums";
        alert('Your name is too long. Maximum length allowed is 16 characters.');
      } else if (document.getElementById("user_input2").value != "" && document.getElementById("user_input2").value.length > 12) {
        ctx.font = "bold 50px verdana, sans-serif";
        var name = capitalize(String(document.getElementById("user_input2").value))+"'s Top Albums";
      } else if (document.getElementById("user_input2").value != "" && document.getElementById("user_input2").value.length <= 12) {
        var name = capitalize(String(document.getElementById("user_input2").value))+"'s Top Albums";
      } else {
        var name = "Your Top Albums";
      }
      ctx.fillStyle = document.getElementById("user_input5").value;  
      ctx.fillText(name, 75, 250);

      //the ranking numbers
      var numberHeight = 445; 
      for (let i = 0; i < 5; i++) {
        ctx.font = "bold 60px verdana, sans-serif";
        var temp = i + 1;
        var number = temp.toString();
        var message3 = "#" + number;
        ctx.fillStyle = document.getElementById("user_input5").value; 
        ctx.fillText(message3, 75, numberHeight);
        numberHeight=numberHeight+325;
      }

      //Album titles and artist names
      var num2=410;
      var num3=460;
      for (let i = 0; i < 5; i++) {
        var message4 =  albums[i].artist.name;
        var message5 =  albums[i].name;
        if (message4.length > 20) {
          message4 = message4.substring(0, 19).trimEnd() + "...";
        } 
        if (message5.length > 20) {
          message5 = message5.substring(0, 19).trimEnd() + "...";
        }
        ctx.fillStyle = document.getElementById("user_input5").value;
        ctx.font = "bold 40px verdana, sans-serif";  
        ctx.fillText(message5, 510, num2);
        ctx.font = "bold 30px verdana, sans-serif";
        ctx.fillText(message4, 510, num3);
        num2=num2+325;
        num3=num3+325;
      }

      //slide down to results
      $('html, body').animate({
          scrollTop: $("#canvas1").offset().top
      }, 1000);
    } catch (e) {
      alert('Error with your Last.fm account. Please try again later.');
    }
  }
}

//capitalizes first letter
const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

//function to download canvas image
function download_image(){
  var canvas = document.getElementById("canvas1");
  image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  var link = document.createElement('a');
  link.download = "myfive.png";
  link.href = image;
  link.click();
}