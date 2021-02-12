gsap.registerPlugin(ScrollTrigger)
window.onload = function() {
  document.getElementsByClassName("setup")[0].style.opacity = '0'
  document.getElementsByClassName("documentation")[0].style.opacity = '0'
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
  gsap.to(".documentation", {
    scrollTrigger: {
    trigger: ".documentation",
    start: "top bottom-=100",
    endTrigger: ".documentation-header",
    start: "top bottom-=100",
    scrub: true,
    markers: true
  },
  opacity: 1
  });
}
