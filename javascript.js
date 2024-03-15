/*
Next part is to track what was pressed.

Add eventlistener to each button
Calls function that gets what was pressed and adds to an array
Updates operationDisplay (string that concatenates w/ each key pressed)

On the press of =, it calls a different function that...
    -calls getOperationsArray(arr) w/ the tracked array and gets returned answer
    -displays answer to answerDisplay
    -displays full operation to operationDisplay

*/



const keyContainer = document.querySelector("#key-container");

function createKeys() {
    let col1 = [7, 4, 1, 0];
    let col2 = [8, 5, 2, "."];
    let col3 = [9, 6, 3, "_"];
    let col4 = ["CE", "*", "+", "="];
    let col5 = ["Back", "/", "-", "_"];

    // creates 5 columns
    for (let i = 0; i < 5; i++) {
        let colToUse = [];
        if (i == 0) {
            colToUse = col1;
        } else if (i == 1) {
            colToUse = col2;
        }
        else if (i == 2) {
            colToUse = col3;
        }
        else if (i == 3) {
            colToUse = col4;
        }
        else if (i == 4) {
            colToUse = col5;
        }

        const keyCol = document.createElement("div");
        keyCol.className = "key-col";
        // creates 4 buttons per column
        for (let k = 0; k < 4; k++) {
            const btn = document.createElement("button");
            btn.textContent = colToUse[k];
            btn.addEventListener("click", () => {
                alert("You pressed " + colToUse[k])
            });
            keyCol.appendChild(btn);
        }

        keyContainer.appendChild(keyCol);
    }
}

createKeys();


let arr = [5, "+", 3, "*", 1, 0, "-", 1, "+", 2];
getOperationArray(arr);


function getOperationArray(arr) {
    let opArr = [];
    let num = "";
    let operator = "";
    let validOperators = ["+", "-", "/", "*"];

    for (let i = 0; i < arr.length + 1; i++) {
        let digit = arr[i];
        
        if (typeof(digit) != "number") {
            opArr.push(parseFloat(num));
            num = "";
            if (validOperators.includes(digit)) {
                operator = digit;
                opArr.push(digit);
            }
        } else {
            num += [String(digit)];
        }

    }

    console.log("operation: " + opArr);
    calcOperation(opArr);
}


function calcOperation(arr) {
    let num1 = 0;
    let num2 = 0;
    let operator = "";
    let index = 0;

    let validOperators = ["+", "-", "/", "*"];

    for (let i = 0; i < arr.length; i++) {
        let digit = arr[i];
    
        if (arr.includes("*") || arr.includes("/")) {
            if (typeof(digit) != "number") {
                if (digit == "*" || digit == "/") {
                    num1 = arr[i - 1];
                    num2 = arr[i + 1];
                    operator = digit;
                    index = i - 1;
                    break;
                }
            }

        } else {
            if (typeof(digit) != "number") {
                num1 = arr[i-1];
                num2 = arr[i+1];
                operator = digit;
                index = i - 1;
                break;
            }
        }

    }

    arr.splice(index, 3);
    ans = computeOp(num1, operator, num2);
    arr.splice(index, 0, ans);

    // console.log(arr);

    let opComplete = true;
    for (let i = 0; i < arr.length; i++) {
        if (validOperators.includes(arr[i])) {
            opComplete = false;
            calcOperation(arr);
            break;
        }
    }

    if (opComplete == true) {
        console.log("answer: " + ans);
        return ans;
    }
    
}

function computeOp(firstNum, operator, secondNum) {
    if (operator == "+") {
        answer = firstNum + secondNum;
    } else if (operator == "-") {
        answer = firstNum - secondNum;
    } else if (operator == "*") {
        answer = firstNum * secondNum;
    } else if (operator == "/") {
        answer = firstNum / secondNum;
    }

    return answer;
}

