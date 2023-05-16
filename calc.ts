const arrayForCalculator: string[] = [
  "1",
  "2",
  "3",
  "+",
  "4",
  "5",
  "6",
  "-",
  "7",
  "8",
  "9",
  "*",
  "=",
  "0",
  ".",
  "/",
  "C",
  "CA",
];

const calcTable: Element | null = document.querySelector(".calcutor__list-btn");
const calkOutput: Element | null = document.querySelector(
  ".calculator__output"
);
const errorBox: Element | null = document.querySelector(".error");
const errorMessage: Element | null = document.querySelector(".error__message");

type State = {
  result: number;
  num: number;
  operator: string;
  setResult(res: number): void;
  setNum(num: number): void;
  setOperator(oper: string): void;
  setState(): void;
};

const countState: State = {
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

if (calcTable) {
  let text: string = "";

  const addCalcBtn = (): void => {
    const calcBtn: string = arrayForCalculator
      .map(
        (item: string): string => `<li><button type="button" id="${
          item === "." ? "point" : item
        }" class="calcutor__btn">${item}</button></li>
`
      )
      .join(" ");
    calcTable.innerHTML = calcBtn;
  };
  addCalcBtn();

  const point: Element | null = document.querySelector("#point");
  const clearOneBtn: Element | null = document.querySelector("#C");

  const formatResult = (num: number): string =>
    num.toFixed(num % 1 === 0 ? 0 : 2);

  const addNumder = (num1: number, num2: number): string =>
    formatResult(num1 + num2);
  const subtractNumber = (num1: number, num2: number): string =>
    formatResult(num1 - num2);
  const multiplyNumder = (num1: number, num2: number = 1): string =>
    `${num2}` === "" ? `${countState.result}` : formatResult(num1 * num2);
  const divideNumber = (num1: number, num2: number): string => {
    if (`${num2}` === "") {
      return `${countState.result}`;
    }
    if (num2 === 0) {
      if (errorMessage) {
        errorMessage.textContent = "Сannot be divided by 0";
      }
      showError();
      return `${countState.result}`;
    } else {
      return formatResult(num1 / num2);
    }
  };

  const count = (num1: number, num2: number, action: string): string | null => {
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

  const choiceOperator = (value: string) => {
    if (calkOutput?.textContent) {
        text = calkOutput.textContent;
        
        if (arrayForCalculator.indexOf(value) !== -1) {
          
            if (isNaN(+text[text.length - 1])) {
            
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
    }
  };

  const addPoint = (): void => {
    if (calkOutput?.textContent) {
      text = calkOutput.textContent;
      if (point && point.hasAttribute("disabled")) {
        return;
      }
      if (!text || isNaN(+text[text.length - 1])) {
        point && point.setAttribute("disabled", "");
        calkOutput.textContent = `${text}0.`;
      } else {
        point && point.setAttribute("disabled", "");
        if (calkOutput) {
          calkOutput.textContent = `${text}.`;
        }
      }
    }
  };

  const clearAll = (): void => {
    countState.setState();
    if (calkOutput) {
      calkOutput.textContent = ``;
    }
  };

  const backspace = (): void => {
    if (calkOutput?.textContent) {
      text = calkOutput.textContent;
      if (text[text.length - 1] === countState.operator) {
        clearOneBtn && clearOneBtn.setAttribute("disabled", "");
      } else {
        calkOutput.textContent = `${text.slice(0, text.length - 1)}`;
      }
    }
  };

  const showResult = (): void => {
    if (
      calkOutput &&
      calkOutput.textContent &&
      isNaN(+calkOutput.textContent)
    ) {
      const array = calkOutput.textContent.split(`${countState.operator}`);
      const num = array.length === 2 ? array[1] : array[2];
      countState.setNum(+num);
      const result: string =
        count(countState.result, countState.num, countState.operator) ?? "0";
      countState.setResult(+result);
      calkOutput.textContent = `${countState.result}`;
      removeDisabled("point");
    }
  };

  const showError = (): void => {
    if (errorBox) {
      errorBox.classList.add("open");
      errorBox.addEventListener("click", () => {
        errorBox.classList.remove("open");
      });
    }
  };

  const showOutput = (value: string): void => {
    if (calkOutput) {
      calkOutput.textContent = `${calkOutput.textContent}${value}`;
    }
  };

  const removeDisabled = (id: string): void => {
    const element = document.getElementById(id);
    element && element.removeAttribute("disabled");
  };

  const createCalcOutput = (e: any): void => {
    errorBox && errorBox.classList.remove("open");

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

  calcTable.addEventListener("click", createCalcOutput);
  document.addEventListener("keydown", createCalcOutput);
}
