let screen = document.getElementById("screen");
let num;
let lastNum;
let refreshOnNextInput = false;
let lastOperation;
let screenContent = [];
let maxChar = 12

function outString(string) {
	let outString = string;
	if (outString.length > maxChar) {
		console.log("Limited " + outString + " to: " + outString.substr(0, maxChar))
		return outString.substr(0, maxChar - 1);
	} else {
		return string;
	}
}

function appendToScreen(event) {
	// Blank string to be filled with output from screenContent
	let output = "";
	let action = getEventType(event);

	if (screenContent.length < maxChar & isFinite(action) || action == ".") {
		// Limit periods to 1

		if (action === "." && screenContent.includes(".")) {
			return;
		}

		// Stops multiple leading 0's
		if (screenContent[0] === "0" && screenContent.length === 1 && action === "0") {
			return;
		}

		screenContent.push(action);

		// Add 0 to start if period is first key pressed
		if (screenContent[0] === "." && action === ".") {
			screenContent.unshift("0");
		}

		screenContent.forEach((element) => {
			// Build output string
			output += element;
		});

		// Remove leading 0 from int, eg 0123 = 123, 0234.123 = 234.123 (must still output decimal when input)
		if (output[0] === "0" && output.length > 1) {
			output = output.replace(/^0+/, "");
		}

		console.log(output);
		screen.innerText = output;
	}
}

function refreshScreen() {
	screen.innerText = "";
	screenContent = [];
}

function convertToNum(input) {
	let num = parseFloat(input);
	return Number(num);
}

function add(a, b) {
	return a + b;
}

function subtract(a, b) {
	return a - b;
}

function multiply(a, b) {
	return a * b;
}

function divide(a, b) {
	return a / b;
}

function evaluate(num, lastNum, operation) {
	if (operation == null) {
		return num;
	}

	if (isNaN(num)) {
		num = lastNum;
	}

	switch (operation) {
		case "+":
			return add(lastNum, num);
			
		case "-":
			return subtract(lastNum, num);
			
		case "x":
			return multiply(lastNum, num);
		
		case "÷":
			if (num === 0) {
				return "ERR!";
			}
			return divide(lastNum, num);
	
		default:
			return null;
	}
}

function getEventType(event) {
	let action;
	if (event.type === "click") {
		action = event.target.innerText.toLowerCase();
	} else {
		action = event.key.toLowerCase();
	}

	return action;
}

function handleKeyPress(event) {
	let action = getEventType(event);

	if (refreshOnNextInput) {
		refreshScreen();
		refreshOnNextInput = false;
	}

	appendToScreen(event);

	num = convertToNum(screen.innerText);

	if (isNaN(action) && action != "=" && action != ".") {
		if (action == "c") {
			refreshScreen()
			num = 0;
			lastNum = 0;
			lastOperation = null;
			return;
		}

		if (lastOperation != null) {
			console.log(lastOperation);
			screen.innerText = outString(evaluate(num, lastNum, lastOperation));
			
			// Reassign num to the new value on the screen
			num = convertToNum(screen.innerText);
		}

		lastOperation = action;
		
		lastNum = num;
		refreshOnNextInput = true;
	}

	if (action == "=") {
		screen.innerText = outString(evaluate(num, lastNum, lastOperation));
		lastOperation = null;
	}
};

document.addEventListener("keydown", (event) => handleKeyPress(event));

document.querySelectorAll(".button").forEach((item) => {
	item.addEventListener("click", (event) => handleKeyPress(event));
});

let footer = document.getElementById("year");
footer.innerText = new Date().getFullYear();