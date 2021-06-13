'use strict';
const slider = document.querySelector('.slider'),
  sliderTrack = slider.querySelector('.slider-track'),
  slides = slider.querySelectorAll('.slide'),
  arrows = slider.querySelector('.slider-arrows'),
  prev = arrows.children[0],
  next = arrows.children[1];

let sliderIndex = 0,
  posInit = 0,
  posX1 = 0,
  posX2 = 0,
  posFinal = 0,
  sliderWidth = slides[0].offsetWidth,
  allowSwipe = true;

const trfRegExp = /[-0-9.]+(?=px)/,
  posThreshold = sliderWidth * 0.35;


function getEvent() {
  return event.type.search('touch') != -1 ? event.targetTouches[0] : event
}

function swipeStart() {
  let evt = getEvent()

  sliderTrack.style.transition = ''

  posInit = posX1 = evt.clientX

  document.addEventListener('touchmove', swipeAction)
  document.addEventListener('touchend', swipeEnd)
  document.addEventListener('mousemove', swipeAction)
  document.addEventListener('mouseup', swipeEnd)

}

function swipeAction() {

  let evt = getEvent(),
    style = sliderTrack.style.transform,
    transform = +style.match(trfRegExp)[0];

  posX2 = posX1 - evt.clientX
  posX1 = evt.clientX

  // Запретим доступ на 0 слайде в лево во время свайпа
  if (sliderIndex === 0) {
    if (posX1 > posInit) {
      allowSwipe = false
      return;
    } else {
      allowSwipe = true
    }
  }

  //Запретим доступ на последнем слайде в право во время свайпа
  if (sliderIndex === slides.length - 1) {
    if (posX1 < posInit) {
      allowSwipe = false
      return;
    } else {
      allowSwipe = true
    }
  }

  sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`
}

function swipeEnd() {
  document.removeEventListener('mousemove', swipeAction)
  document.removeEventListener('touchmove', swipeAction)

  posFinal = posInit - posX1

  if (allowSwipe) {
    if (Math.abs(posFinal) > posThreshold) {
      if (posInit > posX1) {
        sliderIndex++
      } else if (posInit < posX1) {
        sliderIndex--
      }
    }

    if (posInit != posFinal) {
      slide()
    }
  } else {
    allowSwipe = true;
  }
}

function slide() {
  sliderTrack.style.transition = '.5s'

  sliderTrack.style.transform = `translate3d(-${sliderIndex * sliderWidth}px, 0px, 0px)`

  prev.classList.toggle('disabled', sliderIndex === 0)
  next.classList.toggle('disabled', sliderIndex === slides.length - 1)
}

arrows.addEventListener('click', function () {
  if (event.target.classList.contains('next')) {
    sliderIndex++
  } else if (event.target.classList.contains('prev')) {
    sliderIndex--
  }

  slide()
})

slider.addEventListener('touchstart', swipeStart)
slider.addEventListener('mousedown', swipeStart)
sliderTrack.style.transform = `translate3d(0px, 0px, 0px)`

slide()