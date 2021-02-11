gsap.registerPlugin(ScrollTrigger)
window.onload = function() {
  document.getElementsByClassName("setup")[0].style.opacity = '0'
  gsap.to(".menu", {
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
  ScrollTrigger.create({
    trigger: ".setup div.header",
    start: "top top",
    endTrigger: ".setup-end",
    end: "bottom top",
    pin: true,
    duration: 0.3,
    ease: "power1.inOut"
  })
}
