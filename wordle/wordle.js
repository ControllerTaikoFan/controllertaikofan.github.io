let dictionary = []
const fileInput = document.querySelector("#dictInput");
const solutionWordInput = document.querySelector("#textInput");
const enterButton = document.querySelector("#theButton");

fileInput.addEventListener("change", readFile);

enterButton.addEventListener("click", determineWord);

function readFile() {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        // this will then display a text file
        dictionary = reader.result.split("\n");

    });

    if (file) {
        reader.readAsText(file);
    }
}

let pattern = [
    "G_GGG",
    "G_G__",
    "YYYYY",
    "__G_G",
    "GGG_G"
]


function determineWord() {
    let solutionPattern = [];
    const solutionWord = solutionWordInput.value;

    let letterCount = new Map();
    for (const letter of solutionWord) {
        if (letterCount.has(letter)) {
            letterCount.set(letter, letterCount.get(letter) + 1);
        } else {
            letterCount.set(letter, 1);
        }
    }

    for (const line of pattern) {
        console.log(line)
        let patternWord = check(solutionWord, letterCount, line);
        solutionPattern.push(patternWord);

    }
    console.log(solutionPattern)
}

function check(solution, solutionLetterCount, line) {
    let found_word = ""
    for (const word of dictionary) {

        if (word == solution) {
            continue;
        }
        let wordLetterCount = new Map();

        var valid = true;
        for (let i = 0; i < 5; i++) {
            const characterIncluded = line[i];
            const currentLetter = word[i];

            switch (characterIncluded) {
                case "X":
                    if (!solution.includes(currentLetter)) {
                        valid = false;
                    }
                    break;
                case "Y":
                    if (!solution.includes(currentLetter)) {
                        valid = false;
                    }
                    if (currentLetter == solution[i]) {
                        valid = false;
                    }
                    break;
                case "G":
                    if (currentLetter != solution[i]) {
                        valid = false;
                    }
                    break;
                default:
                    if (solution.includes(currentLetter)) {
                        valid = false;
                    }
                    break;

            }


            if (wordLetterCount.has(currentLetter)) { // update wordLetterCount
                wordLetterCount.set(currentLetter, wordLetterCount.get(currentLetter) + 1);
            } else {
                wordLetterCount.set(currentLetter, 1);
            }

            if (solutionLetterCount.has(currentLetter)) {
                if (wordLetterCount.get(currentLetter) > solutionLetterCount.get(currentLetter)) {
                    valid = false;
                    break;
                }
            }
        }

        if (valid) {
            found_word = word;
            break
        }
    }


    return found_word;
}
