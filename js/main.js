// Dom 
const form = document.querySelector('#form');
const type = document.querySelector('#type');
const title = document.querySelector('#title');
const textVal = document.querySelector('#value');
const incomesList = document.querySelector('#incomes-list');
const expensesList = document.querySelector('#expenses-list');

const budgetEl = document.querySelector('#budget');
const totalIncomeEl = document.querySelector('#total-income');
const totalExpEl = document.querySelector('#total-expense');    
const percentsWrapper = document.querySelector('#expense-percents-wrapper');

const monthEl = document.querySelector('#month');
const yearEl = document.querySelector('#year');

//Data  
const budget = [];

//Functions
function inserTestData(){
    const testData = [

        {type: 'inc', title: 'Frilanse', value: 500},
        {type: 'inc', title: 'Frilanse', value: 200},
        {type: 'inc', title: 'Frilanse', value: 1200},
        {type: 'exp', title: 'Products', value: 100}

    ];

    function getRandomInt(max){
        return Math.floor(Math.random() * max);
    }

    const randomIndex = getRandomInt(testData.length);

    let randomData = testData[randomIndex];

    type.value = randomData['type'];
    title.value = randomData['title'];
    textVal.value = randomData['value'];
}
//Очистка формы
function clearForm(){
    form.reset();
}
//Посчет бюджета
function calcBudget(){

    //Считаем общий доход 

    let totalIncome = budget.reduce(function(total, element){
        if(element.type === 'inc'){
            return total + element.textVal;
        }else{
            return total;
        }
    }, 0)

    let totalExpance = budget.reduce(function(total, element){
        if(element.type === 'exp'){
            return total + element.textVal;
        }else{
            return total;
        }
    }, 0)

    const totalBudget = totalIncome - totalExpance;
    let expencePercents = 0;

    if(totalIncome){
        expencePercents = Math.round((totalExpance * 100) / totalIncome);
    }

    budgetEl.innerHTML = priceFormatter.format(totalBudget);
    totalIncomeEl.innerHTML = '+ ' + priceFormatter.format(totalIncome);
    totalExpEl.innerHTML = "- " + priceFormatter.format(totalExpance);

    if(expencePercents > 0){
        const html = `<div class="badge">${expencePercents}</div>`;
        percentsWrapper.innerHTML = html;
    }else{
        percentsWrapper.innerHTML = '';
    }
}

function displayMonth(){
    const now = new Date();
    const year = now.getFullYear();
    const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
        month: 'long'
    })

    const month = timeFormatter.format(now);

    timeFormatter.format(now);

    console.log(year);
    console.log(month);

    monthEl.innerHTML = month;
    yearEl.innerHTML = year;
}

const priceFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
})

//Actions
inserTestData();
calcBudget();
displayMonth();

// Добавление новой записи
form.addEventListener('submit', function(e){
    e.preventDefault();

    //Проверка полей на заполненость
    if(title.value.trim() === ""){
        title.classList.add('form__input--error');
        return;
    }else{
        title.classList.remove('form__input--error');
    }

    if(textVal.value.trim() === "" || +textVal.value <= 0){
        textVal.classList.add('form__input--error');
        return;
    }else{
        textVal.classList.remove('form__input--error');
    }

    //Расчет id
    let id = 1;
    if(budget.length > 0){
        //Последний элемент в массиве
        const lastElem = budget[budget.length - 1];
        // ID последнего элемента 
        const lastElID = lastElem.id;
        // Формируем новый id
        id = lastElID + 1;
    }

    //Формируем запись
    const record = {
        id: id,
        type: type.value,
        title: title.value.trim(),
        textVal: +textVal.value,
    }

    //Добавляем запись в бюджет 
    budget.push(record);

    //Отображаем на странице
    if(record.type === 'inc'){
        const html = `
        <li data-id="${record.id}" class="budget-list__item item item--income">
            <div class="item__title">${record.title}</div>
            <div class="item__right">
              <div class="item__amount">${priceFormatter.format(record.textVal)}</div>
              <button class="item__remove">
                <img src="./img/circle-green.svg" alt="delete" />
              </button>
            </div>
          </li>
        `
        incomesList.insertAdjacentHTML('afterbegin', html);
    }

    //Отображаем расходы на странице
    if(record.type === 'exp'){
        const html = `
        <li data-id="${record.id}" class="budget-list__item item item--expense">
        <div class="item__title">${record.title}</div>
        <div class="item__right">
          <div class="item__amount">${priceFormatter.format(record.textVal)}</div>
          <button class="item__remove">
            <img src="./img/circle-red.svg" alt="delete" />
          </button>
        </div>
        </li>
        `

        expensesList.insertAdjacentHTML('afterbegin', html);
    }

    // Считаем бюджет 
    calcBudget();

    clearForm();
    inserTestData();
});

// Удаление 
document.body.addEventListener('click', function(e){
    // Кнопка удалить
    if(e.target.closest('button.item__remove')){
        
        const paretnElem  = e.target.closest('li.budget-list__item');
        const id = paretnElem.dataset.id;
        

        const idx = budget.findIndex(function(elem){

            if(id === elem.id){
                return true;
            }

        })

        // Удаление из массива 
        budget.splice(idx, 1);

        // Удаление с разметки 
        paretnElem.remove();

        calcBudget();
    }
})