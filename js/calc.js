const arrayForCalculator = [1,2,3,"+",4,5,6,"-",7,8,9,"*","=",0,".","/","C","CA"];

const calcTable = document.querySelector(".calcutor__list-btn");
const calkOutput = document.querySelector(".calculator__output");
const errorBox = document.querySelector(".error");
const errorMessage = document.querySelector(".error__message");

const countState = {
  result: 0,
  num: 0,
  operator: "",
  setResult(res) {
    this.result = res;
  },
  setNum(num) {
    this.num = num;
  },
  setOperator(oper) {
    this.operator = oper;
  },
  setState() {
    this.result = 0;
    this.num = 0;
    this.operator = "";
  },
};

const formatResult = (num) => num.toFixed(num % 1 === 0 ? 0 : 2);

const addNumder = (num1, num2) => formatResult(+num1 + +num2);
const subtractNumber = (num1, num2) => formatResult(num1 - num2);
const multiplyNumder = (num1, num2 = 1) =>
  num2 === "" ? countState.result : formatResult(num1 * num2);
const divideNumber = (num1, num2) => {
  if (num2 === "") {
    return countState.result;
  }
  if (+num2 === 0) {
    errorMessage.textContent = "Сannot be divided by 0";
    showError();
    return countState.result;
  } else {
    return formatResult(num1 / num2);
  }
};

const count = (num1, num2, action) => {
  switch (action) {
    case "+":
      return addNumder(num1, num2);
    case "-":
      return subtractNumber(num1, num2);
    case "*":
      return multiplyNumder(num1, num2);
    case "/":
      return divideNumber(num1, num2);
    default:
      return null;
  }
};

const choiceOperator = (value) => {
  const text = calkOutput.textContent;
  if (arrayForCalculator.includes(value)) {
    if (isNaN(text[text.length - 1])) {
      countState.setOperator(value);
      calkOutput.textContent = `${text.slice(0, text.length - 1)}`;
      showOutput(value);
    } else {
      if (countState.result !== 0) {
        showResult();
        removeDisabled("point");
      } else {
        countState.setResult(+text);
        removeDisabled("point");
      }
      countState.setOperator(value);
      showOutput(value);
    }
  }
};

const addPoint = () => {
  const text = calkOutput.textContent;
  if (document.querySelector("#point").hasAttribute("disabled")) {
    return;
  }
  if (!text || isNaN(+text[text.length - 1])) {
    document.querySelector("#point").setAttribute("disabled", "");
    calkOutput.textContent = `${text}0.`;
  } else {
    document.querySelector("#point").setAttribute("disabled", "");
    calkOutput.textContent = `${text}.`;
  }
};

const clearAll = () => {
  countState.setState();
  calkOutput.textContent = ``;
};

const backspace = () => {
  const text = calkOutput.textContent;
  if (text[text.length - 1] === countState.operator) {
    document.querySelector("#C").setAttribute("disabled", "");
  } else {
    calkOutput.textContent = `${text.slice(0, text.length - 1)}`;
  }
};

const showResult = () => {
  if (calkOutput.textContent && isNaN(+calkOutput.textContent)) {
    const array = calkOutput.textContent.split(`${countState.operator}`);
    const num = array.length === 2 ? array[1] : array[2];
    countState.setNum(num);
    countState.setResult(
      count(countState.result, countState.num, countState.operator)
    );
    calkOutput.textContent = `${countState.result}`;
    removeDisabled("point");
  }
};

const showError = () => {
  errorBox.classList.add("open");
  errorBox.addEventListener("click", () => {
    errorBox.classList.remove("open");
  });
};

const showOutput = (value) => {
  calkOutput.textContent = `${calkOutput.textContent}${value}`;
};

const removeDisabled = (id) => {
  document.querySelector(`#${id}`).removeAttribute("disabled");
};

const createCalcOutput = (e) => {
  errorBox.classList.remove("open");
  if (e.target.type === "button" || e.key) {
    const value = e.key || e.target.id;
    removeDisabled("C");

    if (isNaN(+value)) {
      switch (value) {
        case "point":
          addPoint();
          break;
        case ".":
          addPoint();
          break;
        case "CA":
          clearAll();
          break;
        case "C":
          backspace();
          break;
        case "Backspace":
          backspace();
          break;
        case "=":
          showResult();
          countState.setState();
          break;
        case "Enter":
          showResult();
          countState.setState();
          break;
        default:
          choiceOperator(value);
          break;
      }
    } else {
      showOutput(value);
    }
  }
};

const addCalcBtn = () => {
  const calcBtn = arrayForCalculator
    .map(
      (item) => `<li><button type="button" id="${
        item === "." ? "point" : item
      }" class="calcutor__btn">${item}</button></li>
`
    )
    .join(" ");
  calcTable.innerHTML = calcBtn;
};
addCalcBtn();

calcTable.addEventListener("click", createCalcOutput);
document.addEventListener("keydown", createCalcOutput);
