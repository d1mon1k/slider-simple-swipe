'use strict';
const slider = document.querySelector('.slider'),
  sliderList = slider.querySelector('.slider-list'),
  sliderTrack = slider.querySelector('.slider-track'),
  slides = slider.querySelectorAll('.slide'),
  arrows = slider.querySelector('.slider-arrows');

let
  prev = arrows.children[0],
  next = arrows.children[1];

let slideIndex = 0,
  slideWidth = slides[0].offsetWidth, // offsetWidth: It returns the width of an HTML element including padding, border and scrollbar in pixels but it does not include margin width. ... clientWidth: It returns the width of an HTML element including padding in pixels but does not include margin, border and scrollbar width.
  posX1 = 0,
  posX2 = 0,
  posInit = 0,
  posFinal = 0;

let nextTrf = 0,
  prevTrf = 0,
  allowSwipe = true,
  lastTrf = (slides.length - 1) * slideWidth;

const posThreshold = slideWidth * 0.35,
  trfRegExp = /[-0-9.]+(?=px)/; // С помощью регулярного выражения с приминением .match(ниже по коду) мы возвращаем массив трёх чисел (Потому что translate3d имеет три числа перед (?=px) и можем обратиться нарпимер к оси Х ([0]) и от него отнять posX2 и переместить наш трек)


slider.addEventListener('touchstart', swipeStart)
slider.addEventListener('mousedown', swipeStart)
slide()


function swipeStart() {
  let evt = getEvent();

  nextTrf = (slideIndex + 1) * -slideWidth;
  prevTrf = (slideIndex - 1) * -slideWidth;
  // берем начальную позицию курсора по оси Х
  posInit = posX1 = evt.clientX;

  // убираем плавный переход, чтобы track двигался за курсором без задержки т.к. он будет включается в функции slide()
  sliderTrack.style.transition = '';

  // и сразу начинаем отслеживать другие события на документе
  document.addEventListener('touchmove', swipeAction);
  document.addEventListener('touchend', swipeEnd);
  document.addEventListener('mousemove', swipeAction);
  document.addEventListener('mouseup', swipeEnd);
}

function swipeAction() {
  let evt = getEvent(),
    style = sliderTrack.style.transform,
    transform = +style.match(trfRegExp)[0];

  posX2 = posX1 - evt.clientX;
  posX1 = evt.clientX;

  if (slideIndex === 0) {
    if (posInit < posX1) {
      setTransform(transform, 0);
      return;
    } else {
      console.log('allowSwipe = true')
      allowSwipe = true;
    }
  }

  if (slideIndex === slides.length - 1) {
    if (posInit > posX1) {
      setTransform(transform, lastTrf);
      return;
    } else {
      console.log('allowSwipe = true')
      allowSwipe = true;
    }
  }

  // if (posInit > posX1 && transform < nextTrf || posInit < posX1 && transform > prevTrf) {
  //   reachEdge();
  //   return;
  // }

  sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
}

function swipeEnd() {
  posFinal = posInit - posX1;

  document.removeEventListener('touchmove', swipeAction);
  document.removeEventListener('mousemove', swipeAction);
  document.removeEventListener('touchend', swipeEnd);
  document.removeEventListener('mouseup', swipeEnd);

  if (allowSwipe) {
    console.log('allow-swipe END')
    // убираем знак минус и сравниваем с порогом сдвига слайда
    if (Math.abs(posFinal) > posThreshold) {
      // если мы тянули вправо, то уменьшаем номер текущего слайда
      if (posInit < posX1) {
        console.log('allow-swipe--')
        slideIndex--;
        // если мы тянули влево, то увеличиваем номер текущего слайда

      } else if (posInit > posX1) {
        console.log('allow-swipe++')

        slideIndex++;
      }
    }

    // если курсор двигался, то запускаем функцию переключения слайдов
    if (posInit !== posX1) {
      // allowSwipe = false
      console.log('allow-swipe___slide')

      slide();
    } else {
      allowSwipe = true
    }
  } else {
    allowSwipe = true
  }

}


function getEvent() {
  return event.type.search('touch') !== -1 ? event.touches[0] : event


}

function setTransform(transform, comapreTransform) {
  if (transform >= comapreTransform) {
    if (transform > comapreTransform) {
      sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
    }
  }
  allowSwipe = false;
}

// function reachEdge() {
//   transition = false;
//   swipeEnd();
//   allowSwipe = true;
// };

function slide() {
  sliderTrack.style.transition = 'transform .5s';
  sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;

  prev.classList.toggle('disabled', slideIndex === 0)
  next.classList.toggle('disabled', slideIndex === slides.length - 1)
}

arrows.addEventListener('click', function () {
  let target = event.target

  if (target.classList.contains('next')) {
    slideIndex++
  } else if (target.classList.contains('prev')) {
    slideIndex--
  }

  slide()
})


