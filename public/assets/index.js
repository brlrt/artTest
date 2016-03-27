var app = app || {};
app.version= 'v 0.0.1';

$( document ).ready(function() {
  $('video').mediaelementplayer({
    loop: true,
    features: [],
    success: function(mediaElement, domObject)
    {
      mediaElement.play();
      mediaElement.addEventListener('ended', loadNextTrack, false);
    }
  });
      console.log( 'ready!' );
  function loadNextTrack(mediaElement, domObject)
  {
     app.debug('done');
     mediaElement.play();
  }
});

