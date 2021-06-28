//event listeners - will be invoked after DOM Content is loaded
function eventListeners() {
    const showBtn = document.getElementById("showBtn");
    const questionCard = document.querySelector(".questionCard");
    const closeBtn = document.querySelector(".closeBtn");
    const form = document.getElementById("questionForm");
    const categoryInput = document.getElementsByTagName('select');
    const questionInput = document.getElementById("questionInput");
    const answerInput = document.getElementById("answerInput");
    const questionList = document.getElementById("questionsList");
    const textarea=document.querySelectorAll('textarea');

    //let data = [];
    let id;

    //new ui instance
    const ui = new UI();

    //retrieve questions from local storage
    let data = ui.retrieveLocalStorgage();
    if (data.length > 0) {
        id = (data[(data.length - 1)].id) + 1;
    } else {
        id = 1;
    }
    data.forEach(function (question) {
        ui.addQuestion(questionList, question);
    })

    //show question form
    showBtn.addEventListener('click', function () {
        ui.showQuestion(questionCard);
    });

    //hide question form
    closeBtn.addEventListener('click', function () {
        ui.hideQuestion(questionCard);
    });

    clearBtn.addEventListener('click',function(){
        ui.clearQuestion(questionCard);
    });

    //add question
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const questionValue = questionInput.value;
        const answerValue = answerInput.value;
        const categoryValue = categoryInput.value;

        if (questionValue.length < 10 || answerValue.length < 10) {
            alert('Please input more than 10 characters')
        } else {
            const question = new Question(id, questionValue, answerValue);
            data.push(question);
            ui.addToLocalStorage(data);
            id++;
            ui.addQuestion(questionList, question)
            ui.clearFields(questionInput, answerInput);

        }
    });

    //work with a question
    questionList.addEventListener('click', function (event) {
        event.preventDefault();
        if (event.target.classList.contains('deleteFlashcard')) {
            let id = event.target.dataset.id;

            questionList.removeChild(event.target.parentElement.parentElement.parentElement);
            // rest of data
            let tempData = data.filter(function (item) {
                return item.id !== parseInt(id);
            });
            data = tempData;
            ui.addToLocalStorage(data);

        } else if (event.target.classList.contains('showAnswer')) {
            event.target.nextElementSibling.classList.toggle('showItem');
        } else if (event.target.classList.contains('editFlashcard')) {
            //delete question from DOM
            let id = event.target.dataset.id;
            questionList.removeChild(event.target.parentElement.parentElement.parentElement);

            //show question in question card
            ui.showQuestion(questionCard);
            //find specific question clicked
            const tempQuestion = data.filter(function (item) {
                return item.id === parseInt(id);
            });
            // rest of data
            let tempData = data.filter(function (item) {
                return item.id !== parseInt(id);
            });
            data = tempData;
            questionInput.value = tempQuestion[0].title;
            questionInput.value = tempQuestion[0].answer;

            
            
        }
    });
}

//Contructor function responsible for the display
function UI() {
    //show question card
    UI.prototype.showQuestion = function (element) {
        element.classList.add('showItem');
    }
    //hide question card
    UI.prototype.hideQuestion = function (element) {
        element.classList.remove('showItem');
    }
    //add question
    UI.prototype.addQuestion = function (element, question) {
        const div = document.createElement('div');
        div.classList.add('col-md-4');
        div.innerHTML = `<div class="card card-body flashcard my-3">
        <h5>${question.categoryValue}</h5>
        <h4 class="text-capitalize">${question.title}</h4>
        <a href="#" class="text-capitalize my-3 showAnswer">Show/Hide Answer</a>
        <h5 class="answer mb-3">${question.answer}</h5>
        <div class="flashcard-btn d-flex justify-content-between">
   
         <a href="#" id="editFlashcard" class=" btn my-1 editFlashcard text-uppercase" data-id="${question.id}">edit</a>
         <a href="#" id="deleteFlashcard" class=" btn my-1 deleteFlashcard text-uppercase" data-id="${question.id}">delete</a>
        </div>
       </div>`;
        element.appendChild(div);
    }

    //add to Local Storage
    UI.prototype.addToLocalStorage = function (data) {
        localStorage.clear();
        const dataJSON = JSON.stringify(data);
        localStorage.setItem('flash-questions', dataJSON)
    }

    //retrieve from localStorage
    UI.prototype.retrieveLocalStorgage = function () {

        let savedQuestions = localStorage.getItem('flash-questions');
        if (savedQuestions) {
            const savedQuestionsParsed = JSON.parse(savedQuestions);
            return savedQuestionsParsed;
        } else {
            return savedQuestions = [];
        }

    }

    

    //clear fields
    UI.prototype.clearFields = function (question, answer) {
        questionInput.value = '';
        answerInput.value = '';
    }
}
//Constructor function responsible for each question
function Question(id, title, answer) {
    this.id = id;
    this.title = title;
    this.answer = answer;
}
// dom event listener to run when content is loaded
document.addEventListener('DOMContentLoaded', function () {
    eventListeners();
})