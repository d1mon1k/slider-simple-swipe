// let slider = document.querySelector('.slider'),
//   sliderList = slider.querySelector('.slider-list'),
//   sliderTrack = slider.querySelector('.slider-track'),
//   slides = slider.querySelectorAll('.slide'),
//   arrows = slider.querySelector('.slider-arrows');

// let slideIndex = 0,
//   slideWidth = slides[0].offsetWidth,
//   posX1 = 0,
//   posX2 = 0,
//   posInit = 0,
//   posFinal = 0,
//   posThreshold = slideWidth * 0.35,
//   trfRegExp = /[-0-9.]+(?=px)/; //* С помощью регулярного выражения с приминением .match(ниже по коду) мы возвращаем массив трёх чисел (Потому что translate3d имеет три числа перед (?=px) и можем обратиться нарпимер к оси Х ([0]) и от него отнять posX2 и переместить наш трек)

// slider.addEventListener('touchstart', swipeStart)
// slider.addEventListener('mousedown', swipeStart)


// function swipeStart() {
//   let evt = getEvent()

//   //* берем начальную позицию курсора по оси Х
//   posInit = posX1 = evt.clientX
//   //* убираем плавный переход, чтобы track двигался за курсором без задержки
//   //* т.к. он будет включается в функции slide()
//   sliderTrack.style.transition = ''

//   //* и сразу начинаем отслеживать другие события на документе
//   document.addEventListener('touchmove', swipeAction)
//   document.addEventListener('touchend', swipeEnd)
//   document.addEventListener('mousemove', swipeAction)
//   document.addEventListener('mouseup', swipeEnd)
// }

// function swipeAction() {
//   let evt = getEvent(),
//     style = sliderTrack.style.transform = `translate3d(0px, 0px, 0px)`,
//     transform = +style.match(trfRegExp)[0];

//   posX2 = posX1 - evt.clientX
//   posX1 = evt.clientX

//   sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px})`
// }

function swipeEnd() {

}




// function getEvent() {
//   return event.type.search('touch') !== -1 ? event.touches[0] : event
// }


// function slide() {
//   sliderTrack.style.transition = 'transform .5s'; //???????
//   sliderTrack.style.transform = `translate3d(-${slideWidth * slideIndex}px 0px 0px)`


//   arrows.children[0].classList.toggle('disabled', slideIndex === 0)
//   arrows.children[0].classList.toggle('disabled', slideIndex === slides.length - 1)
// }



//===========================================

let slider = document.querySelector('.slider'),
  sliderList = slider.querySelector('.slider-list'),
  sliderTrack = slider.querySelector('.slider-track'),
  slides = slider.querySelectorAll('.slide'),
  arrows = slider.querySelector('.slider-arrows'),
  slideWidth = slides[0].offsetWidth,
  slideIndex = 0,
  posInit = 0,
  posX1 = 0,
  posX2 = 0,
  posFinal = 0,
  posThreshold = slideWidth * .35,
  trfRegExp = /[-0-9.]+(?=px)/;


// function slide() {
//   sliderTrack.style.transition = 'transform .5s';
//   sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;

//   // делаем стрелку prev недоступной на первом слайде
//   // и доступной в остальных случаях
//   // делаем стрелку next недоступной на последнем слайде
//   // и доступной в остальных случаях
//   prev.classList.toggle('disabled', slideIndex === 0);
//   next.classList.toggle('disabled', slideIndex === --slides.length);
// }

function getEvent() {
  return event.type.search('touch') !== -1 ? event.touches[0] : event
}

function swipeStart() {
  let evt = getEvent();

  // берем начальную позицию курсора по оси Х
  posInit = posX1 = evt.clientX;

  // убираем плавный переход, чтобы track двигался за курсором без задержки
  // т.к. он будет включается в функции slide()
  sliderTrack.style.transition = '';

  // и сразу начинаем отслеживать другие события на документе
  document.addEventListener('touchmove', swipeAction);
  document.addEventListener('touchend', swipeEnd);
  document.addEventListener('mousemove', swipeAction);
  document.addEventListener('mouseup', swipeEnd);
}

function swipeAction() {
  let evt = getEvent(),
    // для более красивой записи возьмем в переменную текущее свойство transform
    style = sliderTrack.style.transform = `translate3d(0px, 0px, 0px)`,
    // считываем трансформацию с помощью регулярного выражения и сразу превращаем в число
    transform = +style.match(trfRegExp)[0];

  posX2 = posX1 - evt.clientX;
  posX1 = evt.clientX;

  sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
  // можно было бы использовать метод строк .replace():
  // sliderTrack.style.transform = style.replace(trfRegExp, match => match - posX2);
  // но в дальнейшем нам нужна будет текущая трансформация в переменной
}


slider.addEventListener('touchstart', swipeStart)
slider.addEventListener('mousedown', swipeStart)
