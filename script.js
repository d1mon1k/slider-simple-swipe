const slider = document.querySelector('.slider'),
  sliderList = slider.querySelector('.slider-list'), //Поиск элемента ведётся внутри - slider
  sliderTrack = slider.querySelector('.slider-track'),
  slides = slider.querySelectorAll('.slide'),
  arrows = slider.querySelector('.slider-arrows');

const prev = arrows.children[0],
  next = arrows.children[1],
  slideWidth = slides[0].offsetWidth; // offsetWidth: It returns the width of an HTML element including padding, border and scrollbar in pixels but it does not include margin width. ... clientWidth: It returns the width of an HTML element including padding in pixels but does not include margin, border and scrollbar width.

let slideIndex = 0, //текущий слайд
  posInit = 0, //* Получаем touchStart --- не понимаю только зачем два раза нам это
  posX1 = 0, //* Получаем touchStart
  posX2 = 0,
  posY1 = 0, //* Получаем touchStart по оси Y --- Зачем нам ось Y ?
  posY2 = 0,
  posFinal = 0,
  isSwipe = false,
  isScroll = false,
  allowSwipe = true,
  transition = true,
  nextTrf = 0,
  prevTrf = 0,
  lastTrf = --slides.length * slideWidth,
  posThreshold = slides[0].offsetWidth * 0.35, //минимальный путь пальца для перехода на следующий слайд
  trfRegExp = /([-0-9.]+(?=px))/,
  swipeStartTime,
  swipeEndTime;



function swipeAction() {

  let evt = getEvent(),
    style = sliderTrack.style.transform, //! ??? Почему оно возвращает это - translate3d(0px, 0px, 0px)
    transform = +style.match(trfRegExp)[0]; //! ????????????????????????????????

  posX2 = posX1 - evt.clientX; //! ????
  posX1 = evt.clientX;

  posY2 = posY1 - evt.clientY;  //! ????
  posY1 = evt.clientY;

  console.log(posY2)

  if (!isSwipe && !isScroll) {
    let posY = Math.abs(posY2);
    if (posY > 7 || posX2 === 0) {
      isScroll = true;
      allowSwipe = false;
    } else if (posY < 7) {
      isSwipe = true;
    }
  }

  if (isSwipe) {
    if (slideIndex === 0) {
      if (posInit < posX1) {
        setTransform(transform, 0);
        return;
      } else {
        allowSwipe = true;
      }
    }

    // запрет ухода вправо на последнем слайде
    if (slideIndex === --slides.length) {
      if (posInit > posX1) {
        setTransform(transform, lastTrf);
        return;
      } else {
        allowSwipe = true;
      }
    }

    if (posInit > posX1 && transform < nextTrf || posInit < posX1 && transform > prevTrf) {
      reachEdge();
      return;
    }

    sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
  }

}





function swipeEnd() {
  posFinal = posInit - posX1;

  isScroll = false;
  isSwipe = false;

  document.removeEventListener('touchmove', swipeAction);
  document.removeEventListener('mousemove', swipeAction);
  document.removeEventListener('touchend', swipeEnd);
  document.removeEventListener('mouseup', swipeEnd);

  sliderList.classList.add('grab');
  sliderList.classList.remove('grabbing');

  if (allowSwipe) {
    swipeEndTime = Date.now();
    if (Math.abs(posFinal) > posThreshold || swipeEndTime - swipeStartTime < 300) {
      if (posInit < posX1) {
        slideIndex--;
      } else if (posInit > posX1) {
        slideIndex++;
      }
    }

    if (posInit !== posX1) {
      allowSwipe = false;
      slide();
    } else {
      allowSwipe = true;
    }

  } else {
    allowSwipe = true;
  }

}


function setTransform(transform, comapreTransform) {
  if (transform >= comapreTransform) {
    if (transform > comapreTransform) {
      sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
    }
  }
  allowSwipe = false;
}

function reachEdge() {
  transition = false;
  swipeEnd();
  allowSwipe = true;
};


sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)'; //! Для отслеживания REGexp позиции track ?
sliderList.classList.add('grab'); //*Добавляем курсор 'рука'

sliderTrack.addEventListener('transitionend', () => allowSwipe = true); //! Для чего это ?



//* ===============================================Clear============================================
slider.addEventListener('touchstart', swipeStart);
slider.addEventListener('mousedown', swipeStart);


//? Зачем else return ?
arrows.addEventListener('click', function (event) {
  let target = event.target; //сохраняем в переменную одну из стрелок
  console.log(event)
  if (target.classList.contains('next')) {
    slideIndex++;
  } else if (target.classList.contains('prev')) {
    slideIndex--;
  }
  // else {
  //   return;
  // }

  slide();
});

function slide() {
  if (transition) { //! Для чего это ?
    sliderTrack.style.transition = 'transform .5s';
  }
  sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;

  prev.classList.toggle('disabled', slideIndex === 0); //toggle (String [, Boolean])
  next.classList.toggle('disabled', slideIndex === --slides.length);
}

//*Возвращаем клик первым пальцем (array[0]) , если это сенсорный экран. else {event}
function getEvent() {
  return (event.type.search('touch') !== -1) ? event.touches[0] : event;
}


function swipeStart() {
  let evt = getEvent(); //*Получаем клик первым пальцем (array[0])

  if (allowSwipe) { //! Почему мы создаём события если (allowSwipe??)

    swipeStartTime = Date.now(); //! Зачем ?????

    transition = true; //! Зачем ?????

    nextTrf = (slideIndex + 1) * -slideWidth;
    prevTrf = (slideIndex - 1) * -slideWidth;

    posInit = posX1 = evt.clientX;
    posY1 = evt.clientY;

    sliderTrack.style.transition = ''; //* Для того что бы палец хватал и двигал слайд без задержек

    document.addEventListener('touchmove', swipeAction);
    document.addEventListener('mousemove', swipeAction);
    document.addEventListener('touchend', swipeEnd);
    document.addEventListener('mouseup', swipeEnd);

    sliderList.classList.remove('grab');
    sliderList.classList.add('grabbing');
  }
}