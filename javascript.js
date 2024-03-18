/*
Last thing to do is just update the CSS to make it look pretty!
*/


const keyContainer = document.querySelector("#key-container");

function createKeys() {
    let col1 = [7, 4, 1, 0];
    let col2 = [8, 5, 2, "_"]; // change _ to . if i decide to add decimal support
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
let prevOpArray = [];

function getKeyPressed(key) {
    let validOperators = ["+", "-", "/", "*"];
    let ans = 0;

    if (calcOp == true) {
        if (validOperators.includes(key)) {
            opString = keyArray[0] + " ";
        } else {
            if (key == "Back") {
                keyArray = [];
                opString = "";
                answerDisplay.textContent = 0;
            } else if (key != "=") {
                opString = "";
                keyArray = [];
            }
        }
        calcOp = false;
    }

    let lastKeyEntry = keyArray[keyArray.length - 1];

    if (key == "_" || key == ".") {
        return;
    } else if (key == "Back") {
        if (validOperators.includes(lastKeyEntry)) {
            opString = opString.slice(0, -2);
        } else {
            opString = opString.slice(0, -1);
        }
        keyArray.pop();
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
        if (keyArray.length == 0) {
            ans = 0;
        } else {
            ans = getOperationArray(keyArray);
        }
        let numDecimalsRounded = getNumOfDecimalsRounded(ans);
        answerDisplay.textContent = ans.toFixed(numDecimalsRounded);
        prevOpArray = keyArray;
         if (isNaN(ans) == false) {
            keyArray = [ans];
            calcOp = true;
        }
    } else {
        let swapOperators = false;
        // this changes the previous operator to the current one
        if (validOperators.includes(key)) {
            if (validOperators.includes(prevKey) || validOperators.includes(lastKeyEntry)) {
                swapOperators = true;
            }
        }
        
        if (swapOperators == true) {
            keyArray[(keyArray.length - 1)] = key;
            opString = opString.slice(0, -2) + key + " ";
            console.log(keyArray);
        } else {
            // this initializes op w/ a 0 if first entry is an operator
            if (keyArray.length == 0 && validOperators.includes(key)) {
                keyArray.push(0);
                keyArray.push(key);
                opString += 0 + " " + key + " ";
            } else {
                keyArray.push(key);
                // this is just for formatting. keeps numbers together w/o spaces, but separates
                // the operators w/ a space before an after
                if (validOperators.includes(key)) {
                    opString = opString + " " + key + " ";
                } else {
                    let prevKeyTwoBack = keyArray[(keyArray.length - 3)];
                    let swapZero = false;
                    let addSpace = false;
                    // if the first key is a 0 and then a number is entered, OR the first part
                    // of a number is 0, then this changes it from a 0 to the new number.
                    // looks weird to have it look like either A) 06 or B) 5 + 06, so this
                    // addresses that.            
                    if (prevKey == 0) {
                        if (validOperators.includes(prevKeyTwoBack)) {
                            swapZero = true;
                            addSpace = true;
                        }

                        if (keyArray.length == 2) {
                            swapZero = true;
                        }
                    }

                    if (swapZero == true) {
                        if (addSpace == true) {
                            opString = opString.slice(0, -2) + " " + key;
                        } else {
                            opString = opString.slice(0, -2) + key;
                        }

                        keyArray.pop();
                        keyArray[(keyArray.length - 1)] = key;
                    } else {
                        opString += key;
                    }
                }
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

    let oneNumber = false;

    if (arr.length == 1) {
        num1 = arr[0];
        oneNumber = true;
    }

    for (let i = 0; i < arr.length; i++) {
        if (oneNumber == true) {
            break;
        }

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

    let opComplete = true;
    for (let i = 0; i < arr.length; i++) {
        if (validOperators.includes(arr[i])) {
            opComplete = false;
            calcOperation(arr);
            break;
        }
    }

    if (opComplete == true) {
        return ans;
    }
    
}

function computeOp(firstNum, operator, secondNum) {
    let answer = firstNum;
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

function getNumOfDecimalsRounded(ans) {
    // this function gets the number of decimals from the answer.
    // if it's more than 3, it rounds to 3 decimal places. 
    let num = ans + "";
    let index = 0;
    for (let i = 0; i < num.length; i++) {
        if (num[i] == ".") {
            // console.log("FOUND DECIMAL AT index " + i);
            index = i + 1; // + 1 cuz we don't wanna include the decimal point
            break;
        }
    }

    let numPreSlice = num;
    num = num.slice(index);

    let numDecimals = 0;
    if (numPreSlice.includes(".")) {
        // console.log("num includes a decimal place! including...");
        numDecimals = num.length;
        if (numDecimals > 3) {
            numDecimals = 3;
        }
    }

    return numDecimals;   
}