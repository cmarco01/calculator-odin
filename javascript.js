/*
Next part is to track what was pressed.

Add function to eventlistener that gets what was pressed

Add it to string displayMsg

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



function testNum(arr) {
    let nums = [];
    let num = "";
    let operator = "";
    let operatorChosen = false;
    let validOperators = ["+", "-", "/", "*"];

    // iterate thru
    // if i is a num, add it to string
    // if i is NOT a num (aka an operator):
    //      add that parseFloat(string) to nums
    //      clear it
    // set i to operator

    let tempArr = [];
    let numDigits = 0;

    for (let i = 0; i < arr.length + 1; i++) {
        // console.log(arr[i]);
        // console.log(typeof(arr[i]));
        let digit = arr[i];
        
        
        if (typeof(digit) != "number") {
            
            nums.push(num);
            // console.log("ADDING " + num + " to list");
            num = "";
            if (validOperators.includes(digit) && operatorChosen == false) {
                operator = digit;
                operatorChosen = true;
            } else if (validOperators.includes(digit) && operatorChosen == true) {
                // console.log("FOUND SECOND OPERATOR! breaking for loop");
                break;
            }
        } else {
            num += [String(arr[i])];
        }

        // using this to get the starting index to slice out the remainder of the op
        numDigits += 1;

        // console.log('num: ' + num);
    }

    if (nums.includes('')) {
        nums.pop();
    }

    console.log(nums);
    // console.log("operator: " + operator);

    let firstNum = parseFloat(nums[0]);
    let secondNum = parseFloat(nums[1]);
    let answer = 0;

    if (operator == "+") {
        answer = firstNum + secondNum;
    } else if (operator == "-") {
        answer = firstNum - secondNum;
    } else if (operator == "*") {
        answer = firstNum * secondNum;
    } else if (operator == "/") {
        answer = firstNum / secondNum;
    }

    // console.log("ANSWER:  " + answer);
    
    remainingOp = arr.slice(numDigits);
    remainingOp.unshift(answer);

    // console.log("REMAINING OP: " + remainingOp);


    let finalAnswer = false;

    for (let i = 0; i < remainingOp.length; i++) {
        finalAnswer = true;
        if (validOperators.includes(remainingOp[i])) {
            // console.log("OP NOT COMPLETE! Running again...");
            finalAnswer = false;
            testNum(remainingOp);          
            break;
        }
    }
    
    if (finalAnswer == true) {
        console.log("FINAL ANSWER " + answer);
        return answer;
    }
    

}

let arr = [5, "*", 3, "*", 10, "-", 1, "/", 2];

// testNum(arr);
getOperationArray(arr);

/*
ok this is a DOOZY! haha, but it works. 

all i need to do;
-track what key was pressed and add it to an array (like above)
    -if it's a number, it needs to be a NUMBER! won't work if i add a number as a string, i.e. "5"
    -operators need to be strings
-when = key is pressed, send the array to this function
-it will return the FINAL ANSWER

-*can also modify to send operation, or do that in separate function-- for the display

*/


function getOperationArray(arr) {
    /*
    iterate thru array
    if digit is a number, concat to num
    if digit is NOT a number:
        -parseFloat num
        -add num to opArr
        -add operator to opArr
        -clear num
    */

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


    // console.log("Previous Operation (no PEMDAS): " + opArr);
    // opArr = getOrderOfOperations(opArr);
    // console.log("Operation w/ PEMDAS: " + opArr);
}

function getOrderOfOperations(arr) {
    // takes an operation as array
    // returns it in correct order of operations

    // by nature, an operation will ALWAYS have one more number than operator
    // ex. 2 + 2 -- [2 nums, 1 op]   or   3 * 5 + 10 - 4 -- [4 nums, 3 ops]

    // if array is [5, "+", 3, "*", 10, "-", 1, "/", 2] (equals 19 w/ order of operations PEMDAS)
    // we want [3, "*", 10, "/", 2, "+", 5, "-", 1]

    // len of array = 9
    // operators will always be at ODD indexes (in this case) 1, 3, 5, (len - 2)

    // first, get an array of operators 
    let operators = [];
    for (let i = 0; i < arr.length; i++) {
        if (i % 2 == 1) {
            operators.push(arr[i]);
        }
    }

    // console.log(operators);
    let i = 1;
    
    for (i; i < operators.length; i++) {
        // console.log(i);
        let thisOp = operators[i];
        let prevOp = operators[i-1];
        // console.log("thisOp: " + thisOp + "\nprevOp: " + prevOp);
        if (thisOp == "*" || thisOp == "/") {
            if (prevOp == "+" || prevOp == "-") {
                operators[i-1] = thisOp;
                operators[i] = prevOp;
                i = 0;
            }
        }

        // console.log(operators);
    }

    console.log(operators);

    // okay, now we have ops in correct order
    /*
    first, find index operators[0] in arr
    for first element in NEW OP ARR, add the arr at; index - 1, operators[0], index + 1
    just for first element!!

    for the next, we need to just find the index of the next operator, and then add that and arr[index+1]
    */
    let firstOpIndex = arr.indexOf(operators[0]);
    // console.log(firstOpIndex); // expecting 3

    let firstNum = arr[firstOpIndex - 1];
    let secondNum = arr[firstOpIndex + 1];
    let newArr = [firstNum, operators[0], secondNum];
    // console.log(newArr); // expecting 3, "*", 10


    // filter this out of array, then reverse
    let sliceOp = arr.slice(0, firstOpIndex-1).reverse();

    for (let i = 0; i < sliceOp.length; i++) {
        digitIndex = arr.indexOf(sliceOp[i]);
        arr.splice(digitIndex, 1);
        arr.push(sliceOp[i]);
    }

    console.log(arr);
    console.log("newArr; " + newArr);

    let k = 3;
    for  (k = 3; k < arr.length; k++) {
        op = arr[k];
        num = arr[k+1];
        newArr.push(op);
        newArr.push(num);
        k += 1;
    }
    
    console.log("newArr == > ; " + newArr);

    // for (let i = 1; i < operators.length; i++) {
    //     opIndex = arr.indexOf(operators[i]);
    //     num = arr[opIndex + 1];
    //     console.log(num );
    //     newArr.push(operators[i]);
    //     newArr.push(num);
    // }

    // console.log(newArr);

    return newArr;

}

/* 

taking a break;

good thing was that i got the full operation as it's typed so i can

but even then do i need that? cuz i can display stuff w/o that
*/