let allQ = document.getElementById("allQ-El");
let currentQ = document.getElementById("currentQ-El");
let option1 = document.getElementById("option1_El");
let option2 = document.getElementById("option2_El");
let option3 = document.getElementById("option3_El");
let option4 = document.getElementById("option4_El");
let options = [option1, option2, option3, option4];
let radio1 = document.getElementById("radio1_El");
let radio2 = document.getElementById("radio2_El");
let radio3 = document.getElementById("radio3_El");
let radio4 = document.getElementById("radio4_El");
let radioButtons = [radio1, radio2, radio3, radio4];
let radioButtonHolder = document.querySelectorAll(".radioButtonHolder");
let buttonHolder = document.querySelector(".buttonHolder");
let formWrapper = document.getElementById("formWrapper_El");
let form = document.getElementById("form_El");
let endMessageContainer = document.getElementById("endMessage_El");
let endMessage = document.getElementById("message_El")
let formHeader = document.querySelector(".formHeader");
let nextButton = document.getElementById("nextButton_El");
let lastButton = document.getElementById("lastButton_El");
let restartButton = document.getElementById("restartButton_El");
let qAList = document.getElementById("qAList_El");
let checkBox = document.getElementById("checkbox_El");
let statusAreaWrapper = document.getElementById("statusAreaWrapper_El");
let contentPart = document.getElementById("content_El");
let qIndex = 0;
let points = 0;
let quizFinished = false;
let resetNextButtonText = false;
let firstQUnanswered = true;
let qAnswered = [];
const questions = [
  {
    question: "Who is the author of the novel 'One Hundred Years of Solitude'?",
    options: [
      { text: "Gabriel García Márquez", isCorrect: true },
      { text: "Jorge Luis Borges", isCorrect: false },
      { text: "Isabel Allende", isCorrect: false },
      { text: "Pablo Neruda", isCorrect: false },
    ],
  },
  {
    question: "What is the capital of France?",
    options: [
      { text: "Paris", isCorrect: true },
      { text: "Rome", isCorrect: false },
      { text: "Madrid", isCorrect: false },
      { text: "Berlin", isCorrect: false },
    ],
  },
  {
    question: "What is the largest planet in our solar system?",
    options: [
      { text: "Jupiter", isCorrect: true },
      { text: "Saturn", isCorrect: false },
      { text: "Earth", isCorrect: false },
      { text: "Mars", isCorrect: false },
    ],
  },
  {
    question: "Who wrote 'The Catcher in the Rye'?",
    options: [
      { text: "J.D. Salinger", isCorrect: true },
      { text: "F. Scott Fitzgerald", isCorrect: false },
      { text: "Ernest Hemingway", isCorrect: false },
      { text: "John Steinbeck", isCorrect: false },
    ],
  },
  {
    question: "What is the chemical symbol for water?",
    options: [
      { text: "H2O", isCorrect: true },
      { text: "CO2", isCorrect: false },
      { text: "O2", isCorrect: false },
      { text: "H2O2", isCorrect: false },
    ],
  },
];

startQuiz();
nextButton.addEventListener("click", function () {
  if (!quizFinished) {
    newQuestion();
  } else {
    allQ.textContent = "Question " + (qIndex + 1) + "/" + questions.length;
    showEndMessage();
  }
  if (!checkedIfSelected()) {
    nextButton.textContent = "Select an answer";
    resetNextButtonText = true;
  }
});

lastButton.addEventListener("click", function () {
  lastQuestion();
});

restartButton.addEventListener("click", function () {
  restartQuiz();
});

for (let i = 0; i < radioButtons.length; i++) {
  radioButtons[i].addEventListener("change", function (event) {
    if (event.target.checked && resetNextButtonText) {
      if (quizFinished) {
        nextButton.textContent = "Finish";
      } else {
        nextButton.textContent = "Next";
      }
      if (qAnswered[qIndex]) {
        qAnswered[qIndex] = i;
      }
    }
    if (qIndex === 0) {
      nextButton.textContent = "Next";
    }
    if (qIndex >= questions.length - 1) {
      nextButton.textContent = "Finish";
      quizFinished = true;
    }
    if (qAnswered[qIndex] == null) {
      qAnswered.push(i);
    } else {
      qAnswered[qIndex] = i;
    }
    addQAtoList();
  });
}
checkBox.addEventListener("change", function (event) {
  if (event.target.checked) {
    removeStatusArea(false);
  } else {
    removeStatusArea(true);
  }
});

function startQuiz() {
  qIndex = 0;
  points = 0;
  qAnswered = []
  shuffleArray(questions);
  questions.forEach((question) => {
    question.options = shuffleArray(question.options);
  });
  setQuestion();
  allQ.textContent = "Question " + (qIndex + 1) + "/" + questions.length;
}

function addQAtoList() {
  let question = "";
  let answer = "";
  firstQUnanswered = false;
  for (let i = 0; i < qAnswered.length; i++) {
    question += `
    <li class="listItem question"><span>Question ${i + 1}: </span>${questions[i].question}</li>
    <li class="listItem answer"><span>Answer: </span>${questions[i].options[qAnswered[i]].text}</li>`;
  }
  if(!firstQUnanswered){
    removeStatusArea(false);
  }
  qAList.innerHTML = question + answer;
}

function removeStatusArea(remove){
  if(remove){
    if(window.innerWidth/window.innerHeight>=1){
    contentPart.style.gridTemplateColumns = "auto";
    contentPart.style.gridTemplateRows = "1fr";
    formWrapper.style.gridRow = "1";
    statusAreaWrapper.style.gridRow ="1";
    }else{
      contentPart.style.gridTemplateRows = "auto";  
      formWrapper.style.gridRow = "1";
      statusAreaWrapper.style.gridRow ="2";
    }
    statusAreaWrapper.style.display = "none";
  }else if(!remove&&checkBox.checked){
    if(window.innerWidth/window.innerHeight>=1){
    contentPart.style.gridTemplateColumns = "1fr 1fr";
    contentPart.style.gridTemplateRows = "1fr";
    formWrapper.style.gridRow = "1";
    statusAreaWrapper.style.gridRow ="1";
    }else{
      contentPart.style.gridTemplateRows = "1fr 1fr"; 
      contentPart.style.rowGap = "40px";
      formWrapper.style.gridRow = "1";
      statusAreaWrapper.style.gridRow ="2";
    }
    statusAreaWrapper.style.display = "block";
  }
}

function newQuestion() {
  if (checkedIfSelected()) {
    if (qIndex < questions.length - 1) {
      qIndex++;
    }
    setQuestion();
    resetAllRadioButtons();

  } else {
    nextButton.textContent = "Select an answer";
    resetNextButtonText = true;
  }
  if (qAnswered[qIndex] != null) {
    radioButtons[qAnswered[qIndex]].checked = true;
  }
  if (qIndex >= questions.length - 1) {
    nextButton.textContent = "Finish";
    quizFinished = true;
  }
}

function lastQuestion() {
  if (qIndex > 0) {
    qIndex--;
  }
  setQuestion();
  if (qAnswered[qIndex] != null) {
    radioButtons[qAnswered[qIndex]].checked = true;
  }
  quizFinished = false;
  nextButton.textContent = "Next";
}

function restartQuiz() {
  removeStatusArea(false);
  quizFinished = false;
  form.style.display = "block";
  endMessageContainer.style.display = "none";
  resetAllRadioButtons();
  startQuiz();
  firstQUnanswered = true;
}

function setQuestion() {
  currentQ.textContent = questions[qIndex].question;
  for (let i = 0; i < options.length; i++) {
    options[i].textContent = questions[qIndex].options[i].text;
  }
  allQ.textContent = "Question " + (qIndex + 1) + "/" + questions.length;
}
function resetAllRadioButtons() {
  for (let i = 0; i < radioButtons.length; i++) {
    radioButtons[i].checked = false;
  }
}

function correctQuiz() {
  for (let i = 0; i < questions.length; i++) {
    if (questions[i] && qAnswered[i] !== undefined) {
      if (questions[i].options && questions[i].options[qAnswered[i]]) {
        if (questions[i].options[qAnswered[i]].isCorrect) {
          points++;
        }
      }
    }
  }
}

function checkedIfSelected() {
  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      return true;
    }
  }
}

function showEndMessage() {
  removeStatusArea(true);
  correctQuiz();
  form.style.display = "none";
  endMessageContainer.style.display = "block";
  currentQ.textContent = "";
  endMessage.textContent = "Well played you got " + points + "/" + questions.length + "points";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
