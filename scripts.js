'use strict';

var searchApiUrl = 'https://api.spotify.com/v1/search?type=artist&q=';
var topTracksApiUrlPrefix = "https://api.spotify.com/v1/artists/";
var topTracksApiUrlSuffix = "/top-tracks?country=US";

function search(offset) {
	var searchText = $('#searchBox').val();
	var url = searchApiUrl + encodeURIComponent(searchText);

	if (offset != null) {
		url += '&offset=' + offset;
	}

	$.get(url).then(function (data) {
		showResults(data, offset != null ? offset + 20 : 20);
		$('#resultsSection').show();
	});
}

function showResults(results, nextOffset) {
	var resultsDiv = $('#results'); 

	var htmlString = '<ul>';

	var artists = results.artists.items;

	for (var i = 0; i < artists.length; i++) {
		var artist = artists[i];
		htmlString += '<li><a class="open-modal" href="#" data-name="' + artist.name + '" data-id="' + artist.id+ '">'+ artist.name + '</a></li>'
	}

	htmlString += '</ul>';

	if (artists.length > 0) {
		htmlString += '<button type="button" class="btn btn-default" onclick="search(' + nextOffset + ')">Next</button>';
	} else {
		htmlString += 'There are no further results';
	}

	resultsDiv.html(htmlString);
}

function populateModal(name, id) {
	$.get(topTracksApiUrlPrefix + id + topTracksApiUrlSuffix).then(function (data) {
		$('#myModalLabel').html(name + "'s Top Tracks");

		var tracks = data.tracks;
		var modalBody = $('#myModal .modal-body');
		var htmlString = "";

		for (var i = 0; i < tracks.length; i++) {
			var track = tracks[i];
			htmlString += '<div class="row track"><div class="col-lg-12">';
			var imageArrayLen = track.album.images.length;
			if (imageArrayLen > 0) {
				htmlString += '<img src="' + track.album.images[imageArrayLen-1].url + '" />';
			}
                        
                        var trackUrl = track.external_urls.spotify;
                        
                        if (trackUrl == null) { trackUrl = "#"; }

			htmlString += '<span class="track-name"><a href="' + trackUrl + '">' + track.name + '</a></span>';
			htmlString += '</div></div>';
		}

		modalBody.html(htmlString);
		$('#myModal').modal('show');
	});
}

$('#searchButton').click(function(){
    search();
});

$('#searchBox').keypress(function(e){
    if (e.keyCode == 13) {
        search();
    }
});

$(document).on("click", ".open-modal", function (e) {
 	var artistId = e.target.dataset.id;
 	var artistName= e.target.dataset.name;

 	populateModal(artistName, artistId);
});
