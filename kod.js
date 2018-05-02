var startIndex = 0;
var objAlbum = new Array(); //?
document.addEventListener('scroll', function () { infiniteScroll(); });

function getArtist() {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            obj = JSON.parse(this.responseText);
            loadArtist(obj);
        }
    };
    xhttp.open("GET", "http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=rock&api_key=5839c8ee2f70763bdcb4bcb92b3cf155&format=json", true);
    xhttp.send();

}

function loadPage(artist) {

    localStorage.setItem('name', artist);
    window.location.href = 'albumi.html';
}

function getAlbums()
{
    var obj;
    var artist = localStorage.getItem('name');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            obj = JSON.parse(this.responseText);
            removeNull(obj);
            objAlbum.length
            loadAlbums();
        }
    };
    xhttp.open("GET", "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" +artist+ "&api_key=5839c8ee2f70763bdcb4bcb92b3cf155&format=json", true);
    xhttp.send();
}

function loadArtist(obj)
{
    for (var i = 0; i < 10; i++) {

        var s = document.createElement("SECTION");
        s.className = "container";

        var div = document.createElement("DIV");
        div.className = "card";
        div.onmouseenter = toggle;
       
        var ff = document.createElement("FIGURE");
        ff.className = "front";

        var picture = document.createElement("DIV");
        picture.innerHTML = '<img class="artist" src="' + obj.topartists.artist[i].image[3]['#text'] + '" />';

        var rank = document.createElement("DIV");
        rank.id = "rank";
        rank.innerHTML = obj.topartists.artist[i]['@attr'].rank;

        var artist = document.createElement("DIV");
        artist.id = "artist";
        artist.innerHTML = obj.topartists.artist[i].name;
        /*var txt = document.createTextNode(obj.topartists.artist[i]['@attr'].rank);
       var h = document.createElement("H1");
       h.appendChild(txt);
       artist.appendChild(h);*/
                  
        var fb = document.createElement("FIGURE");
        fb.className = "back";

        var summery = document.createElement("DIV");
        summery.className = "summery";
        summery.id = obj.topartists.artist[i].name;

        var button = document.createElement("BUTTON");
        button.id = obj.topartists.artist[i].name;  // Cuvamo ime izvodjaca u id-u dugmeta
        button.onclick = function () { loadPage(this.id); };   // Jako je vazno da se funkcija samo prenese, a ne odmah pozove. Za to postoje dva nacina:
                                                        // ili da se napise njeno ime bez zagrada ili da se napise anonimna funkcija koja je poziva.
                                                        // posto je nama potrebna funkcija kojamora da prenese argument id onda moramo preko anonimne funkcije.
        button.innerHTML = "Albumi";
        

        ff.appendChild(picture);
        ff.appendChild(artist);
        ff.appendChild(rank);
        

        fb.appendChild(summery);
        fb.appendChild(button);

        div.appendChild(ff);
        div.appendChild(fb);

        s.appendChild(div);
        document.body.appendChild(s);

        getSummery(obj.topartists.artist[i].name);

    }   
}

function loadAlbums()
{
 
    for (var i = startIndex; (i < startIndex + 10) && (i < objAlbum.length) ; i++)
    {
           var s = document.createElement("SECTION");
           s.className = "container";

           var div = document.createElement("DIV");
           div.className = "card";
           div.onmouseenter = toggle;

           var ff = document.createElement("FIGURE");
           ff.className = "front";

           var picture = document.createElement("DIV");
           picture.innerHTML = '<img class="artist" src="' + objAlbum[i].image[3]["#text"] + '" />';

           var album = document.createElement("DIV");
           album.className = "album";
           album.innerHTML = objAlbum[i].name;

           var fb = document.createElement("FIGURE");
           fb.className = "back";

           var tracks = document.createElement("DIV");
           tracks.className = "track";
           tracks.id = objAlbum[i].name;

           ff.appendChild(picture);
           ff.appendChild(album);

           fb.appendChild(tracks);

           div.appendChild(ff);
           div.appendChild(fb);

           s.appendChild(div);
           document.body.appendChild(s);

           getTracks(objAlbum[i].artist.name, objAlbum[i].name);
           
    }

    startIndex = i;
}

function getSummery(artist)
{
    var obj;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            obj = JSON.parse(this.responseText);
            document.getElementById(artist).innerHTML = truncate(obj.artist.bio.summary) + '. . .';
        }
    };
    xhttp.open("GET", "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+artist+"&api_key=5839c8ee2f70763bdcb4bcb92b3cf155&format=json", true);
    xhttp.send();
}


function getTracks(artist, album)
{
    var obj;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            obj = JSON.parse(this.responseText);
            tracks(obj, album);
        }
    };
    xhttp.open("GET", "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=5839c8ee2f70763bdcb4bcb92b3cf155&artist=" +artist+ "&album=" +album+ "&format=json", true);
    xhttp.send();

}

function tracks(obj, album)
{
    var album = document.getElementById(album);
    var ol = document.createElement("OL");
    for (var i = 0; i < obj.album.tracks.track.length; i++
        ) {
        var li = document.createElement("LI");
        li.innerHTML = '<a href="' + obj.album.tracks.track[i].url + '" target="_blank">' + obj.album.tracks.track[i].name + '</a>';
        ol.appendChild(li);
    }
      album.appendChild(ol);
}

function toggle()
{
    this.classList.toggle('flipped');
}

function truncate(txt) {
    var lenght = txt.lenght;
    var new_txt = txt.substring(0, 300);
    return new_txt;
}


function search()
{
    var input = document.getElementById("input").value;
    var albums = document.querySelectorAll(".album");

    // Brisemo trenutno found polje
    var x = document.getElementsByClassName("found");
    for (var j = 0; j < x.length; j++) {
        x[j].className = "album";
    }

    for (var i = 0; i < objAlbum.length; i++) {
        if (input == objAlbum[i].name) {
            //alert("Album je pronadjen");

            //Album vec je ucitan
            if (i < albums.length) {
                window.scrollTo(0, 380 * Math.floor(i / 3));   // Skrolujemo 0 horizontalno i odgovarajuci broj piksela vertikalno.
                // Postavljamo found polje
                albums[i].className = "found";
                return;
            }
            //Album nije jos uvek ucitan
            else {
                //Ucitavamo albume po 10 u grupi dok ne dodjemo do grupe u kojoj je trazeni album.
                while( i >= albums.length )
                {
                    loadAlbums();  // Ucitavamo sledecih deset albuma
                    albums = document.querySelectorAll(".album");  // Update-ujemo nas niz ucitanih
                }

                window.scrollTo(0, 380 * Math.floor(i / 3));   // Skrolujemo 0 horizontalno i odgovarajuci broj piksela vertikalno.
                // Postavljamo found polje
                albums[i].className = "found";
                return;
            }

             
         }
    }

    alert("Album not found");
}

function infiniteScroll()
{
    var scrollTop = document.documentElement.scrollTop || window.pageYOffset;
    var pageHeight = document.documentElement.scrollHeight;
    var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    if (pageHeight - (scrollTop + clientHeight) < 50) {
        loadAlbums();
    }

}

function removeNull(obj)
{
    var index = 0;
    for ( var i = 0; i< obj.topalbums.album.length ; i++)
        if (obj.topalbums.album[i].name != "(null)")
        {
            objAlbum.push(obj.topalbums.album[i]);
            index++;
        }
}