'use strict'

window.addEventListener('DOMContentLoaded', () => {

  let options = {
    width: 500,
    height: 300,
    cellCountX: 50,
    colorActiveCell: '#406ffc'
  };

  const canvas = document.getElementById('life-play');  //Элемент canvas
  const ctx = canvas.getContext('2d');
  const width = options.width;  //Ширина canvas
  const height = options.height;//Выстоа canvas
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = options.colorActiveCell; //Цвет активных клеток

  const cellCountX = options.cellCountX; //Количество клеток по ширине canvas
  const step = (width / cellCountX).toFixed(2); //Ширина одной клетки
  const cellCountY = height / step;  //Количество клеток по высоте canvas
  
  let arrData = []; //Массив для хранения данных о активыных клетках
  let count = 0; //Количество циклов
  let timer; //Таймер для запуска анимации 
  const countContainer = document.getElementById('count'); //Контейнер для вывода количества циклов
  
  //Генерация активных клеток с помощью движения мыши
  canvas.addEventListener("mousemove", (event) => {
    let x = event.offsetX;
    let y = event.offsetY;

    x = Math.floor(x / step);
    y = Math.floor(y / step);

    if (x >= 0 && y >= 0 && x < cellCountX && y < cellCountY) {
      arrData[y][x] = 1;
    }

    drawOneCell(y, x);
  });

  //Первичное заполнение массива
  function initData() {
    for (let i = 0; i < cellCountY; i++) {
      arrData[i] = [];
      for (let j = 0; j < cellCountX; j++) {
        arrData[i][j] = 0;
      }
    }
  };

  initData();

  //Рисование активных клеток по координатам из массива
  function drawCells() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < cellCountY; i++) {
      for (let j = 0; j < cellCountX; j++) {
        if (arrData[i][j] == 1) {
          ctx.fillStyle = options.colorActiveCell;
          ctx.fillRect(j * step, i * step, step, step);
        }
      }
    }
  }

  //Рисование одной активной клетки по координатам
  function drawOneCell(i, j) {    
    ctx.fillRect(j * step, i * step, step, step);
  }

  //Функция генерации движения клеток
  function createLife() {
    const arrDataTemp = [];

    for (let i = 0; i < cellCountY; i++) {
      arrDataTemp[i] = [];
      for (let j = 0; j < cellCountX; j++) {

        let neighbors = 0;

        if (arrData[leftTop(i, 'y') - 1][j] == 1) neighbors++;
        if (arrData[i][rightBottom(j, 'x') + 1] == 1) neighbors++;
        if (arrData[rightBottom(i, 'y') + 1][j] == 1) neighbors++;
        if (arrData[i][leftTop(j, 'x') - 1] == 1) neighbors++;
        if (arrData[leftTop(i, 'y') - 1][rightBottom(j, 'x') + 1] == 1) neighbors++;
        if (arrData[rightBottom(i, 'y') + 1][rightBottom(j, 'x') + 1] == 1) neighbors++;
        if (arrData[rightBottom(i, 'y') + 1][leftTop(j, 'x') - 1] == 1) neighbors++;
        if (arrData[leftTop(i, 'y') - 1][leftTop(j, 'x') - 1] == 1) neighbors++;

        if (arrData[i][j] == 1) {
          if (neighbors == 2 || neighbors == 3) {
            arrDataTemp[i][j] = 1;
          } else {
            arrDataTemp[i][j] = 0;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(j * step, i * step, step, step);
          }
        } else {
          (neighbors == 3) ? arrDataTemp[i][j] = 1: arrDataTemp[i][j] = 0;
        }

      }
    }

    arrData = arrDataTemp;
    
    if (count == 0) {
      drawCells();
      timer = requestAnimationFrame(createLife);
    } else {
      if (checkArray(arrData)) {
        drawCells();
        timer = requestAnimationFrame(createLife);
      } else {
        clearTimeout(timer);
      }
    }

    count++;
    countContainer.innerHTML = count;    
  }

  //Функция проверки массива на активные клетки
  function checkArray(arr) {
    let result = false;
    for (let i = 0; i < arr.length; i++) {

      if (arrData[i].indexOf(1) !== -1) {
        result = true;
      }
    }
    return result;
  }

  //Функция проверки крайних значений слева и сверху
  function leftTop(i, mode) {
    if (mode == 'x') {
      if (i == 0) return cellCountX;
      else return i;
    }
    if (mode == 'y') {
      if (i == 0) return cellCountY;
      else return i;
    }
  }

   //Функция проверки крайних значений справа и снизу
  function rightBottom(i, mode) {
    if (mode == 'x') {
      if (i == cellCountX - 1) return -1;
      else return i;
    }
    if (mode == 'y') {
      if (i == cellCountY - 1) return -1;
      else return i;
    }
  }

   //Функция очистки поля
  function clearField() {
    ctx.clearRect(0, 0, width, height);
    initData();
    cancelAnimationFrame(timer);
    count = 0;
    countContainer.innerHTML = count;
  }

  //Нажатие на кнопку Start
  document.getElementById('start').addEventListener('click', createLife);

  //Нажатие на кнопку Clear
  document.getElementById('clear').addEventListener('click', clearField);

  //Нажатие на кнопку Stop
  document.getElementById('stop').addEventListener('click', () => {
    cancelAnimationFrame(timer);
  });

  //Нажатие на кнопку One step
  document.getElementById('step').addEventListener('click', () => {
    createLife();
    cancelAnimationFrame(timer);
  });
});