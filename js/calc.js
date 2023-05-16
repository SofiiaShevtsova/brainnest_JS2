"use strict";
const arrayForCalculator = [
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
if (calcTable) {
    let text = "";
    const addCalcBtn = () => {
        const calcBtn = arrayForCalculator
            .map((item) => `<li><button type="button" id="${item === "." ? "point" : item}" class="calcutor__btn">${item}</button></li>
`)
            .join(" ");
        calcTable.innerHTML = calcBtn;
    };
    addCalcBtn();
    const point = document.querySelector("#point");
    const clearOneBtn = document.querySelector("#C");
    const formatResult = (num) => num.toFixed(num % 1 === 0 ? 0 : 2);
    const addNumder = (num1, num2) => formatResult(num1 + num2);
    const subtractNumber = (num1, num2) => formatResult(num1 - num2);
    const multiplyNumder = (num1, num2 = 1) => `${num2}` === "" ? `${countState.result}` : formatResult(num1 * num2);
    const divideNumber = (num1, num2) => {
        if (`${num2}` === "") {
            return `${countState.result}`;
        }
        if (num2 === 0) {
            if (errorMessage) {
                errorMessage.textContent = "Сannot be divided by 0";
            }
            showError();
            return `${countState.result}`;
        }
        else {
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
        if (calkOutput === null || calkOutput === void 0 ? void 0 : calkOutput.textContent) {
            text = calkOutput.textContent;
            if (arrayForCalculator.indexOf(value) !== -1) {
                if (isNaN(+text[text.length - 1])) {
                    countState.setOperator(value);
                    calkOutput.textContent = `${text.slice(0, text.length - 1)}`;
                    showOutput(value);
                }
                else {
                    if (countState.result !== 0) {
                        showResult();
                        removeDisabled("point");
                    }
                    else {
                        countState.setResult(+text);
                        removeDisabled("point");
                    }
                    countState.setOperator(value);
                    showOutput(value);
                }
            }
        }
    };
    const addPoint = () => {
        if (calkOutput === null || calkOutput === void 0 ? void 0 : calkOutput.textContent) {
            text = calkOutput.textContent;
            if (point && point.hasAttribute("disabled")) {
                return;
            }
            if (!text || isNaN(+text[text.length - 1])) {
                point && point.setAttribute("disabled", "");
                calkOutput.textContent = `${text}0.`;
            }
            else {
                point && point.setAttribute("disabled", "");
                if (calkOutput) {
                    calkOutput.textContent = `${text}.`;
                }
            }
        }
    };
    const clearAll = () => {
        countState.setState();
        if (calkOutput) {
            calkOutput.textContent = ``;
        }
    };
    const backspace = () => {
        if (calkOutput === null || calkOutput === void 0 ? void 0 : calkOutput.textContent) {
            text = calkOutput.textContent;
            if (text[text.length - 1] === countState.operator) {
                clearOneBtn && clearOneBtn.setAttribute("disabled", "");
            }
            else {
                calkOutput.textContent = `${text.slice(0, text.length - 1)}`;
            }
        }
    };
    const showResult = () => {
        var _a;
        if (calkOutput &&
            calkOutput.textContent &&
            isNaN(+calkOutput.textContent)) {
            const array = calkOutput.textContent.split(`${countState.operator}`);
            const num = array.length === 2 ? array[1] : array[2];
            countState.setNum(+num);
            const result = (_a = count(countState.result, countState.num, countState.operator)) !== null && _a !== void 0 ? _a : "0";
            countState.setResult(+result);
            calkOutput.textContent = `${countState.result}`;
            removeDisabled("point");
        }
    };
    const showError = () => {
        if (errorBox) {
            errorBox.classList.add("open");
            errorBox.addEventListener("click", () => {
                errorBox.classList.remove("open");
            });
        }
    };
    const showOutput = (value) => {
        if (calkOutput) {
            calkOutput.textContent = `${calkOutput.textContent}${value}`;
        }
    };
    const removeDisabled = (id) => {
        const element = document.getElementById(id);
        element && element.removeAttribute("disabled");
    };
    const createCalcOutput = (e) => {
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
            }
            else {
                showOutput(value);
            }
        }
    };
    calcTable.addEventListener("click", createCalcOutput);
    document.addEventListener("keydown", createCalcOutput);
}
//# sourceMappingURL=calc.js.map