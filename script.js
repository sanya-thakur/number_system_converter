const numberInput = document.getElementById("numberInput");
const fromBase = document.getElementById("fromBase");
const toBase = document.getElementById("toBase");

const convertBtn = document.getElementById("convertBtn");

const resultCard = document.getElementById("resultCard");
const resultNumber = document.getElementById("resultNumber");

const steps = document.getElementById("steps");
const stepsContent = document.getElementById("stepsContent");

const error = document.getElementById("error");


/* Convert button */

convertBtn.addEventListener("click", convertNumber);


/* Click result to expand steps */

resultNumber.addEventListener("click", () => {

    steps.classList.toggle("open");

});


/* Main conversion */

function convertNumber() {

    error.textContent = "";

    const input = numberInput.value.trim();

    const sourceBase = Number(fromBase.value);
    const targetBase = Number(toBase.value);


    if (input === "") {

        showError("Please enter a number.");

        return;
    }


    if (!isValidNumber(input, sourceBase)) {

        showError(
            `Invalid number for base ${sourceBase}.`
        );

        return;
    }


    /*
        First convert the input into decimal.
    */

    const decimalValue = parseInt(input, sourceBase);


    /*
        Convert decimal into target base.
    */

    const convertedValue =
        decimalValue.toString(targetBase).toUpperCase();


    /*
        Display result.
    */

    resultNumber.textContent =
        `${convertedValue}${getSubscript(targetBase)}`;


    /*
        Generate explanation.
    */

    generateSteps(
        input,
        sourceBase,
        targetBase,
        decimalValue,
        convertedValue
    );


    resultCard.style.display = "block";

    steps.classList.remove("open");

}


/* Validate input */

function isValidNumber(number, base) {

    const validCharacters = {

        2: /^[01]+$/,

        8: /^[0-7]+$/,

        10: /^[0-9]+$/,

        16: /^[0-9a-fA-F]+$/

    };


    return validCharacters[base].test(number);
}


/* Generate steps */

function generateSteps(
    input,
    sourceBase,
    targetBase,
    decimalValue,
    convertedValue
) {

    let html = "";

    let stepCount = 1;


    /*
        Same base
    */

    if (sourceBase === targetBase) {

        html += createStep(
            stepCount++,
            `The number is already in base ${sourceBase}. No conversion is required.`
        );

    }


    /*
        Source → Decimal
    */

    else if (targetBase === 10) {

        html += createStep(
            stepCount++,
            `${input} is converted from base ${sourceBase} to decimal.`
        );


        const digits = input
            .toUpperCase()
            .split("")
            .reverse();


        let calculation = [];


        digits.forEach((digit, index) => {

            const value = parseInt(digit, sourceBase);

            calculation.push(
                `${value} × ${sourceBase}^${index}`
            );

        });


        html += createStep(
            stepCount++,
            calculation.join(" + ")
        );


        html += createStep(
            stepCount++,
            `Adding the values gives ${decimalValue}.`
        );

    }


    /*
        Decimal → another base
    */

    else if (sourceBase === 10) {

        html += createDivisionSteps(
            decimalValue,
            targetBase,
            stepCount
        );

        stepCount +=
            Math.max(
                1,
                Math.floor(
                    Math.log(decimalValue) /
                    Math.log(targetBase)
                ) + 1
            );

    }


    /*
        Other base → another base
        First convert to decimal,
        then decimal → target.
    */

    else {

        html += createStep(
            stepCount++,
            `${input}${getSubscript(sourceBase)} is first converted to decimal.`
        );


        const digits = input
            .toUpperCase()
            .split("")
            .reverse();


        let calculation = [];


        digits.forEach((digit, index) => {

            const value = parseInt(digit, sourceBase);

            calculation.push(
                `${value} × ${sourceBase}^${index}`
            );

        });


        html += createStep(
            stepCount++,
            calculation.join(" + ")
        );


        html += createStep(
            stepCount++,
            `Decimal value = ${decimalValue}`
        );


        html += createDivisionSteps(
            decimalValue,
            targetBase,
            stepCount
        );

    }


    html += `
        <div class="final-answer">
            Final Answer:
            ${convertedValue}${getSubscript(targetBase)}
        </div>
    `;


    stepsContent.innerHTML = html;
}


/* Division method */

function createDivisionSteps(
    decimalValue,
    targetBase,
    startingStep
) {

    let html = "";

    let number = decimalValue;

    let remainders = [];

    let step = startingStep;


    if (number === 0) {

        return createStep(
            step,
            `0 ÷ ${targetBase} = 0 remainder 0`
        );

    }


    while (number > 0) {

        const quotient =
            Math.floor(number / targetBase);

        const remainder =
            number % targetBase;


        remainders.push(remainder);


        html += createStep(
            step++,
            `${number} ÷ ${targetBase} = ${quotient} remainder ${remainderToHex(remainder)}`
        );


        number = quotient;
    }


    html += createStep(
        step++,
        `Read the remainders from bottom to top: ${remainders.reverse().map(remainderToHex).join("")}`
    );


    return html;
}


/* Create step */

function createStep(number, text) {

    return `
        <div class="step">
            <span class="step-number">
                ${number}
            </span>

            ${text}
        </div>
    `;
}


/* Hexadecimal remainder */

function remainderToHex(number) {

    if (number < 10) {
        return number.toString();
    }

    return String.fromCharCode(
        55 + number
    );
}


/* Base subscript */

function getSubscript(base) {

    const subscripts = {

        2: "₂",

        8: "₈",

        10: "₁₀",

        16: "₁₆"

    };

    return subscripts[base];
}


/* Error */

function showError(message) {

    error.textContent = message;

    resultCard.style.display = "none";
}