gsap.registerPlugin(ScrollTrigger)
window.onload = function() {
  HTMLCollection.prototype.forEach = Array.prototype.forEach
  NodeList.prototype.forEach = Array.prototype.forEach
  document.getElementsByClassName("setup")[0].style.opacity = '0'
  document.getElementById("bi").style.opacity = '0'
  document.getElementById("installation").style.opacity = '0'
  document.getElementById("doc-setup").style.opacity = '0'
  gsap.to(".first", {
    scrollTrigger: {
    trigger: ".header :not(.setup)",
    start: "top top",
    scrub: true,
  },
  opacity: 0
  });
  gsap.to(".setup", {
    scrollTrigger: {
    trigger: ".setup",
    start: "top bottom-=100",
    scrub: true,
    markers: true
  },
  opacity: 1
  });
  gsap.to(".bi", {
    scrollTrigger: {
    trigger: ".bi",
    start: "top bottom-=100",
    end: "top top",
    scrub: true,
    markers: true
  },
  opacity: 1
  });
  gsap.to(".inst", {
    scrollTrigger: {
    trigger: ".inst",
    start: "top bottom-=100",
    end: "top top",
    scrub: true,
    markers: true
  },
  opacity: 1
  });
  gsap.to("#doc-setup", {
    scrollTrigger: {
    trigger: "#doc-setup",
    start: "top bottom-=100",
    end: "top top",
    scrub: true,
    markers: true
  },
  opacity: 1
  });
}
function dark() {
    document.body.classList.toggle('darkmode');
    document.getElementsByClassName("header").forEach(function(e) {e.classList.toggle('darkmode')})
    document.querySelectorAll('a').forEach(function(e) {e.classList.toggle('darkmode')})
}
