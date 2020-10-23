// 1) Создать объект в котором будет типы карточек с количеством карточек каждого типа(в этой задаче количество у всех одиноковые). Создать генерацию массива карточек рандомно где количество типов * количество карточек каждого типа.
// 2) создать генерацию массива поля. Это будет двумерный массив где в константе будет количество колонок и строчек.
// 3) Отобразить на странице карточки в стопке.
// 4) Отобразить на странице игровое поле с массива поля.
// 5) отобразить счётчик сколько карточек осталось в стопке, а сколько сейчас на поле.
// 6) при щелчке на поле,  там появлеется верхняя карточка. в топке она пропадает, а появляеться следущая.
// 7) при повторном щелчке на карточку она поварачиваеться на 90 градусов.


// Объект карточек

const cards = {
  cardsType: [ 
    { 
    name: 'corner', 
    cardId: 0, 
    quality: 10,
    cardSrc: './images/corner.png',
    degree: 0,
    rouds: [false, true, true, false],
    pos: true,
  }, 
    { 
    name: 'stick', 
    cardId: 1, 
    quality: 10,
    cardSrc: './images/stick.png',
    degree: 0,
    rouds: [false, true, false, true],
    pos: true,
  }, 
    { 
    name: 'impasse', 
    cardId: 2, 
    quality: 10,
    cardSrc: './images/impasse.png',
    degree: 0,
    rouds: [false, true, false, false],
    pos: true,
  }],
}

// генерируем рандомный массив где длинна массива, это сумма всех карточек. В каждое значение массива ложим id карточки.

let gameCards = [];

const generateCardsForGame = (arrCards) => {
  for (let i = 0; i < arrCards.length; i++ ) {
    for (let k = 0; k < arrCards[i].quality; k++) {
      gameCards.push(arrCards[i]);
    };
  };

  const cardSort = () => {
    return Math.random() - 0.5;
  };
  gameCards.sort(cardSort);
};
generateCardsForGame(cards.cardsType);


// Функция отображения на странице последней карточки с массива карточек.

const cardDeckEl = document.querySelector('.card-deck');

const genOneImgCard = () => {
  let cardStr = '';
  let firstCard = gameCards.length - 1; 
  cardStr = `<img class="card-img" src="${gameCards[firstCard].cardSrc}">`;
  return cardStr;
};

cardDeckEl.innerHTML = genOneImgCard();

// Функция показывает значение сколько осталось карт в колоде.

const cardsLeftEl = document.querySelector('.cards-left');

const qualityCardsInDesk = () => {
  cardsLeftEl.textContent = `Cards left: ${gameCards.length}`;
}
qualityCardsInDesk();

// создание массива игрового поля

let gameBoard = [];
const boardColumns = 8;
const boardRows = 8;

for (let i = 0; i < boardRows; i++) {
  let boardSpaces = [];
  for (let k = 0; k < boardColumns; k++){
    boardSpaces[k] = null;
  };
  gameBoard[i] = boardSpaces;
};


// функция создания игровой доски на странице

const gameBoardEl = document.querySelector('.board-desk');

const genBoardHTML = (arrBoard, check) => {
  let spaceStr = '';
  for (let i = 0; i < arrBoard.length; i++) {
    for (let k = 0; k < arrBoard[i].length; k++) {
      if (arrBoard[i][k] != null && arrBoard[i][k].pos == false) {
        spaceStr = `${spaceStr}
          <div class="board-space with-img" id="${(i * arrBoard.length) + (k)}" >
            <img class="card-img incorrect" src="${arrBoard[i][k].cardSrc}" style="transform: rotate(${arrBoard[i][k].degree}deg);">
          </div>`;
      } else if (arrBoard[i][k] != null) {
        spaceStr = `${spaceStr}
          <div class="board-space with-img" id="${(i * arrBoard.length) + (k)}" >
            <img class="card-img" src="${arrBoard[i][k].cardSrc}" style="transform: rotate(${arrBoard[i][k].degree}deg);">
          </div>`;
      } else  {
        spaceStr = `${spaceStr}<div class="board-space" id="${(i * arrBoard.length) + (k)}"></div>`;
      }
      
    };
  };
  gameBoardEl.innerHTML = spaceStr;
};

genBoardHTML(gameBoard);


// функция для внесения объекта карточки которая отображена в колоде в массив игровой доски.

const writeImgInArr = (chosenSpace, space) => {
  let rowNumber = 0;
  let columnsNumber = 0;
  columnsNumber = chosenSpace % boardColumns;
  rowNumber = (chosenSpace - columnsNumber) / boardRows;
  gameBoard[rowNumber][columnsNumber] = space;
};

// функция установки карточки на доску.

let gameSpaceEl = document.querySelectorAll('.board-space');


const setCardOnBoard = (event) => {
  let takeGameCard = gameCards.pop(); // переменная в которую присваиваеться удаленный элемент массива с карточками.
  let selectGameCard = Object.assign({}, takeGameCard); // копируем объект и ложим в переменную.
  cardDeckEl.innerHTML = genOneImgCard(); // заново рисуеться последний элемент.
  writeImgInArr(event.target.id, selectGameCard); // тут функция для внесения объекта карточки которая отображена в колоде в массив игровой доски.
  if (checkPosBlock(event.target.id)) {
    getObjProperty(event.target.id).pos = true;
  } else {
    getObjProperty(event.target.id).pos = false;
  }
  genBoardHTML(gameBoard); // заново рисуем доску
  qualityCardsInDesk(); // сколько осталось карт
  // if (checkPosBlock(event.target.id) == false) {
  //   event.target.classList.add('incorrect');
  // } else {
  //   event.target.classList.remove('incorrect');
  // }

  gameSpaceEl = document.querySelectorAll('.board-space');
  
  for (let i = 0; i < gameSpaceEl.length; i++) {
    if (gameSpaceEl[i].classList.length > 1) {
      gameSpaceEl[i].addEventListener('click', rotateGameCard);
    } else {
      gameSpaceEl[i].addEventListener('click', setCardOnBoard);
    };
  };
  
  
};

for (let i = 0; i < gameSpaceEl.length; i++) {
  gameSpaceEl[i].addEventListener('click', setCardOnBoard);
};

// функция поворота карты

const rotateGameCard = (el) => {
  let degreeCard = getObjProperty(el.target.parentNode.id); // получаю ссылку на объект элемента
  degreeCard.rouds = shiftRoudsArr(degreeCard); // при повороте на 90 грудусо происходит сдвиг массива вправо и перезаписывается значение в БД
  degreeCard.degree += 90;
  console.log('rot', checkPosBlock(el.target.parentNode.id));
  el.target.style.transform = `rotate(${degreeCard.degree}deg)`; // вузуализация поворота на 90 градусов
  if (checkPosBlock(el.target.parentNode.id) == false) {
    el.target.classList.add('incorrect');
    getObjProperty(el.target.parentNode.id).pos = false;
  } else {
    el.target.classList.remove('incorrect');
    getObjProperty(el.target.parentNode.id).pos = true;
  }
};

// функция получения объекта с массива доски для последующих манипуляций с ним.

const getObjProperty = (spaceId) => {
  let rowNumberArr = 0;
  let columnsNumberArr = 0;
  columnsNumberArr = spaceId % boardColumns;
  rowNumberArr = (spaceId - columnsNumberArr) / boardRows;
  return  gameBoard[rowNumberArr][columnsNumberArr]; 
};

// функция сдвига массива позици вправо.
const shiftRoudsArr = (objArr) => {
  let tempArr = objArr.rouds;
  let newArr = tempArr.slice(3).concat(tempArr.slice(0,3));
  return newArr;
};

// функция проверки правльности постановки карточки, она будет выдавать конечный результат true или false

const checkPosBlock = (currentId) => {
  let rowNumberCurrent = 0;
  let columnsNumberCurrent = 0;
  columnsNumberCurrent = currentId % boardColumns;
  rowNumberCurrent  = (currentId - columnsNumberCurrent) / boardRows;

  const checkLeftBlock = () => {
    if ((columnsNumberCurrent + 1) < boardColumns) {
      if (gameBoard[rowNumberCurrent][columnsNumberCurrent + 1] !== null && gameBoard[rowNumberCurrent][columnsNumberCurrent + 1].rouds[3] == gameBoard[rowNumberCurrent][columnsNumberCurrent].rouds[1] || gameBoard[rowNumberCurrent][columnsNumberCurrent + 1]  == null) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    };
  }
  

  const checkRightBlock = () => {
    if ((columnsNumberCurrent - 1) >= 0) {
      if (gameBoard[rowNumberCurrent][columnsNumberCurrent - 1] !== null && gameBoard[rowNumberCurrent][columnsNumberCurrent - 1].rouds[1] == gameBoard[rowNumberCurrent][columnsNumberCurrent].rouds[3] || gameBoard[rowNumberCurrent][columnsNumberCurrent - 1] == null) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    };
  }
  
  
  const checkBottomBlock = () => {
    if ((rowNumberCurrent + 1) < boardRows) {
      if (gameBoard[rowNumberCurrent + 1][columnsNumberCurrent] !== null && gameBoard[rowNumberCurrent + 1][columnsNumberCurrent].rouds[0] == gameBoard[rowNumberCurrent][columnsNumberCurrent].rouds[2] || gameBoard[rowNumberCurrent + 1][columnsNumberCurrent] == null) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    };
  }
  
  
  const checkTopBlock = () => {
    if ((rowNumberCurrent - 1) >= 0) {
      if (gameBoard[rowNumberCurrent - 1][columnsNumberCurrent] !== null && gameBoard[rowNumberCurrent - 1][columnsNumberCurrent].rouds[2] == gameBoard[rowNumberCurrent][columnsNumberCurrent].rouds[0] || gameBoard[rowNumberCurrent - 1][columnsNumberCurrent] == null) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    };
  }
  
  if (checkLeftBlock() && checkRightBlock() && checkBottomBlock() && checkTopBlock()) {
    return true;
  } else {
    return false;
  }
  
};



