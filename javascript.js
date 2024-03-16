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
                //alert("You pressed " + colToUse[k])
                getKeyPressed(colToUse[k])
            });
            keyCol.appendChild(btn);
        }

        keyContainer.appendChild(keyCol);
    }
}

const opDisplay = document.querySelector("#op-div");
const answerDisplay = document.querySelector("#answer-div");
let keyArray = [];
let opString = "";
let prevKey = "";
let calcOp = false;

/*
things to fix
-handling for if answer is NaN
-handling for if keyArr operation is NaN
*/

function getKeyPressed(key) {
    // console.log("prevKey: " + prevKey);
    let validOperators = ["+", "-", "/", "*"];
    let ans = 0;

    if (calcOp == true) {
        if (validOperators.includes(key)) {
            opString = keyArray[0] + " ";
        } else {
            opString = "";
            keyArray = [];
        }
        calcOp = false;
    }


    if (key == "_") {
        return;
    } else if (key == "Back") {
        keyArray.pop();
        opString = opString.slice(0, -2);
    } else if (key == "CE") {
        keyArray = [];
        opString = "";
        answerDisplay.textContent = 0;
    } else if (key == "=") {
        // if key array ends in +, -, *, or /, remove it, then call function
        if (validOperators.includes(keyArray[(keyArray.length - 1)])) {
            keyArray.pop();
            opString = opString.slice(0, -2);
        }

        ans = getOperationArray(keyArray);
        answerDisplay.textContent = ans;
         if (isNaN(ans) == false) {
             keyArray = [ans];
            calcOp = true;
        }
    } else {
        if (validOperators.includes(prevKey) && validOperators.includes(key)) {
            keyArray[(keyArray.length - 1)] = key;
            opString = opString.slice(0, -2) + key + " ";
            console.log(keyArray);
        } else {
            if (keyArray.length == 0 && validOperators.includes(key)) {
                keyArray.push(0);
                keyArray.push(key);
                opString += 0 + " " + key + " ";
            } else {
                keyArray.push(key);
                opString += key + " ";
            }
            
            
        }
        
    }

    if (opString.length <= 0) {
        opDisplay.textContent = "operation  =";
    } else {
        opDisplay.textContent = opString + " =";
    }

    
    prevKey = key;
}



createKeys();

let arr = [5, "+", 3, "*", 1, 0, "-", 1, "+", 2];
// getOperationArray(arr);


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

    // calling it twice because, for some reason, w/ certain operations like for ex,
    // 7*7*7, it would return "undefined" the first time, and the 2nd time it would
    // return the correct number. so just figured i'd call it twice to get around issue
    let ans = calcOperation(opArr);
    ans = calcOperation(opArr);

    console.log("answer: " + ans);
    return ans;
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
        // console.log("answer: " + ans);
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

