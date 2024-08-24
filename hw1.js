function checkAge() {
    var birthdate = new Date(document.getElementById("birthdate").value);
    var today = new Date();
    var age = today.getFullYear() - birthdate.getFullYear();
    var monthDifference = today.getMonth() - birthdate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }

    if (age < 21) {
        document.getElementById("ageError").style.display = "block";
        document.getElementById("ageSuccess").style.display = "none";
        return false;
    } else {
        document.getElementById("ageSuccess").style.display = "block";
        document.getElementById("ageError").style.display = "none";
        return true;
    }
}

function addGif() {
    var gifContainer = document.getElementById("gif-container");
    var gif = document.createElement("img");
    gif.src = "https://media.giphy.com/media/lNAFPhLVwuaGO1VdKL/giphy.gif?cid=ecf05e4736x2mv1alphk5meuscztim0j73q8hbwn76072vk1&ep=v1_gifs_search&rid=giphy.gif&ct=g";  
    gif.style.width = "100%";
    gifContainer.appendChild(gif);
}

window.onload = addGif; 
  
