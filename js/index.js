window.onscroll = function() {
document.querySelectorAll("section").forEach(function(s) {
if($(window).scrollTop() >= $(s).offset().top - $(s).height()) {
  if (!document.querySelector("a[href='#" + s.id + "']").classList.contains("active")) {
  $(".active:not([href='#" + s.id + "'])").removeClass("active")
  $("a[href='#" + s.id + "']").addClass("active")
}
} else {
  $("a[href='#" + s.id + "']").removeClass("active")
}
})
}
