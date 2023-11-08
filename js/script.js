const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const minWeightInput = document.querySelector('.minweight__input') // поле с минимальным весом
const maxWeightInput = document.querySelector('.maxweight__input') // поле с максимальным весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const fruitList = document.querySelector('.fruits__list') // список фруктов
const resetButton = document.querySelector('.reset__btn');


// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;


// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);
let backupArr = JSON.parse(fruitsJSON);
/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
 fruits.length >= backupArr.length ? backupArr = [...fruits] : false;
  let child = fruitList.lastElementChild;
  while (child) {
    fruitList.removeChild(child);
    child = fruitList.lastElementChild;
  } 

  for (let i = 0; i < fruits.length; i++) {
   const li =  document.createElement("li");
   let liClassName = '';
   // формируем класс на основе цвета
   switch (fruits[i].color) {
     case 'розово-красный':
       liClassName = 'fruit_carmazin';
       break;
     case 'оранжевый':
       liClassName = 'fruit_orange';
       break;
     case 'желтый': 
       liClassName = 'fruit_yellow';
       break;
     case 'зеленый':
       liClassName = 'fruit_green';
       break;
     case 'голубой':
       liClassName = 'fruit_skyblue';
       break;
     case 'фиолетовый':
       liClassName = 'fruit_violet';
       break;
    case 'светло-коричневый':
       liClassName = 'fruit_lightbrown';
       break;
   } 
   // формируем новый элемент <li> при помощи document.createElement,
    li.className = `fruit__item ${liClassName}`
    li.innerHTML = `
    <div class="fruit__info">
      <div>index: ${[i]}</div>
      <div>kind: ${fruits[i].kind}</div>
      <div>color: ${fruits[i].color}</div>
      <div>weight (кг): ${fruits[i].weight}</div>
    </div>`
// добавляем в конец списка fruitsList при помощи document.appendChild
    fruitList.appendChild(li)
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

    // функция перемешивания массива
const shuffleFruits = () => {
const controlArr = [...fruits];
let result = [];
  while (fruits.length > 0) {
    let i = getRandomInt(0, fruits.length - 1);
    result.push(fruits[i]);
    fruits.splice(i,1)
  }  
  // функция сравнения массивов
const compareArrays = (a, b) => a.length === b.length && a.every((n, i) => n === b[i]);
  if (compareArrays(result,controlArr)){
    alert('Расположение элементов не изменилось, повторите попытку!')
  } 
    fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  let weightArr = [];
    fruits.forEach((el) => weightArr.push(el.weight));
  let minWeight = parseInt(minWeightInput.value);
  let maxWeight = parseInt(maxWeightInput.value);
    // validation data
  const validation = minWeight || maxWeight || minWeight < maxWeight;
  if (!validation) {
    minWeight = Math.min(...weightArr);
    maxWeight = Math.max(...weightArr);
    minWeightInput.value = minWeight;
    maxWeightInput.value = maxWeight;
  }

  let result =  fruits.filter((item) => {
    return item.weight >= minWeight && item.weight <= maxWeight
  })

  fruits = result;
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

resetButton.addEventListener('click', () => {
  fruits = [...backupArr];
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  // функция сравнения двух элементов по цвету
  const priority = ['розово-красный', 'оранжевый', 'желтый', 'зеленый', 'голубой', 'фиолетовый','светло-коричневый'];
  const priorityA = priority.indexOf(a.color);
  const priorityB = priority.indexOf(b.color);
  return priorityA > priorityB;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // функция сортировки пузырьком
    let n = arr.length;
    for(let i = 0; i < n-1; i++) {
      for (let j = 0; j < n-1-i; j++) {
        if (comparation(arr[j], arr[j+1])) {
          let temp = arr[j+1];
          arr[j+1] = arr[j];
          arr[j] = temp;
        }
      }
    }
  },

  quickSort(arr, comparation, start = 0, end = arr.length - 1 ) {
   // terminating case
    if (start >= end) {
        return;
    }

    const pivotValue = arr[end];
    let pivotIndex = start; 
    for (let i = start; i < end; i++) {
        if (comparation(pivotValue, arr[i])) {
        // меняем элементы местами
        [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
        // переходим к следующему 
        pivotIndex++;
        }
    }
    // Помещаем значение pivot  в середину
    [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]] 
  
    let index = pivotIndex;
    
    // Рекурсивно применяем к левому и правому подмассивам
    sortAPI.quickSort(arr, comparation, start, index - 1);
    sortAPI.quickSort(arr, comparation, index + 1, end);
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // переключатель sortKind между 'bubbleSort' / 'quickSort'
    sortKind = (sortKind === 'bubbleSort') ? 'quickSort' : 'bubbleSort'
    sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  // выводим в sortTimeLabel значение 'sorting...'
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  // выводим в sortTimeLabel значение sortTime
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
    // Sanitize string
  kindInput.value = kindInput.value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').trim();
     // Validation
  const generalValidation = kindInput.value && colorInput.value && parseInt(weightInput.value);
  const colorArr = ['розово-красный', 'оранжевый', 'желтый', 'зеленый', 'голубой', 'фиолетовый', 'светло-коричневый'];
  const colorValidation = colorArr.some((elem) => elem === colorInput.value);
  if (!generalValidation) {
    alert('Введены некорректные данные!');
  } else if (!colorValidation) {
    alert('Некорректный цвет!');
  } else {
     // создание и добавление нового фрукта в массив fruits
    fruits.push({
      kind: kindInput.value,
      color: colorInput.value,
      weight: parseInt(weightInput.value)
    });
    // очистка полей ввода данных
    kindInput.value = '';
    colorInput.value = '';
    weightInput.value = '';
  }
  display();
});

