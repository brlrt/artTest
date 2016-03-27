var app = app || {};
app.countdown = function (time) {
  console.log("countdown start",time);
  setTimeout(function (argument) {
    window.location.replace("/");
  },time)
}
app.countdown(300000);