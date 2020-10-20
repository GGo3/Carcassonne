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
  }, 
    { 
    name: 'stick', 
    cardId: 1, 
    quality: 10,
    cardSrc: './images/stick.png',
  }, 
    { 
    name: 'impasse', 
    cardId: 2, 
    quality: 10,
    cardSrc: './images/impasse.png',
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

const genBoardHTML = (arrBoard) => {
  console.log(arrBoard);
  let spaceStr = '';
  for (let i = 0; i < arrBoard.length; i++) {
    for (let k = 0; k < arrBoard[i].length; k++) {
      if (arrBoard[i][k] != null) {
        spaceStr = `${spaceStr}
          <div class="board-space" id="${(i * arrBoard.length) + (k)}">
            <img class="card-img" src="${arrBoard[i][k].cardSrc}">
          </div>`;
      } else {
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

const gameSpaceEl = document.querySelectorAll('.board-space');

const setCardOnBoard = (event) => {
  let selectGameCard = gameCards.pop(); // переменная в которую присваиваеться удаленный элемент массива с карточками.
  cardDeckEl.innerHTML = genOneImgCard(); // заново рисуеться последний элемент.
  writeImgInArr(event.target.id, selectGameCard); // тут функция для внесения объекта карточки которая отображена в колоде в массив игровой доски.
  genBoardHTML(gameBoard); // заново рисуем доску
  
};

for (let i = 0; i < gameSpaceEl.length; i++) {
  gameSpaceEl[i].addEventListener('click', setCardOnBoard);
};
