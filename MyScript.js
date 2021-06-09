const slider = document.querySelector('.slider'),
  sliderList = slider.querySelector('.slider-list'),
  sliderTrack = slider.querySelector('.slider-track'),
  slides = slider.querySelectorAll('.slide'),
  arrows = slider.querySelector('.slider-arrows');

let slideIndex = 0,
  slideWidth = slides[0].offsetWidth,
  posX1 = 0,
  posX2 = 0,
  posInit = 0,
  posFinal = 0,
  posThreshold = slideWidth * 0.35,
  trfRegExp = /[-0-9.]+(?=px)/; //???????
// style = sliderTrack.style.transform = `translate3d(0px 0px 0px)`;


arrows.children[0].classList.toggle('.disabled', slideIndex === 0)
arrows.children[0].classList.toggle('.disabled', slideIndex === slides.length - 1)


slider.addEventListener('touchstart', swipeStart)
slider.addEventListener('mousedown', swipeStart)



function swipeStart() {
  let evt = getEvent()

  //* берем начальную позицию курсора по оси Х
  posInit = posX1 = evt.clientX
  //* убираем плавный переход, чтобы track двигался за курсором без задержки
  //* т.к. он будет включается в функции slide()
  sliderTrack.style.transition = ''

  //* и сразу начинаем отслеживать другие события на документе
  document.addEventListener('touchmove', swipeAction)
  document.addEventListener('touchend', swipeEnd)
  document.addEventListener('mousemove', swipeAction)
  document.addEventListener('mouseup', swipeEnd)
}

function swipeAction() {
  posX2 = posX1 - event.clientX
  posX1 = posX2

  console.log(posX2)

}

function swipeEnd() {

}




function getEvent() {
  return event.type.search('touch') != -1 ? event.touches[0] : event
}

function slide() {
  sliderTrack.style.transition = 'transform .5s'; //???????

  sliderTrack.style.transform = `translate3d(-${slideWidth * slideIndex}px 0px 0px)`
}