let dictionary = []
const solutionWordInput = document.querySelector("#textInput");
const enterButton = document.querySelector("#theButton");

const wordleGrid = document.getElementById("wordle-grid");
const allTiles = wordleGrid.querySelectorAll(".tile");
const rows = ["a", "b", "c", "d", "e", "f"];

enterButton.addEventListener("click", determineWord);

function readFile() {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        // this will then display a text file


    });

    if (file) {
        reader.readAsText(file);
    }
}






const url = "https://raw.githubusercontent.com/ControllerTaikoFan/controllertaikofan.github.io/refs/heads/main/wordle/dictionary/dictionary.txt"
fetch(url)
    .then(r => r.text())
    .then(t => {
        dictionary = t.split("\n");
    });

let pattern = [
    ["_", "_", "_", "_", "_"],
    ["_", "_", "_", "_", "_"],
    ["_", "_", "_", "_", "_"],
    ["_", "_", "_", "_", "_"],
    ["_", "_", "_", "_", "_"],
    ["_", "_", "_", "_", "_"]
]

syncPatternAndGrid();


allTiles.forEach(child => {
    child.addEventListener("click", function () {
        const tileRow = rows.indexOf(child.id[0]);
        const tileCol = Number(child.id[1]);
        const tileImage = child.querySelector(".tile-image");
        switch (pattern[tileRow][tileCol]) {
            case "_":
                tileImage.src = "assets/yellow.png";
                pattern[tileRow][tileCol] = "Y";
                break;
            case "Y":
                tileImage.src = "assets/green.png";
                pattern[tileRow][tileCol] = "G";
                break;
            case "G":
                tileImage.src = "assets/any.png";
                pattern[tileRow][tileCol] = "X";
                break;
            case "X":
                tileImage.src = "assets/gray.png";
                pattern[tileRow][tileCol] = "_";
                break;
        }
    })
});


function determineWord() {
    let solutionPattern = [];
    const solutionWord = solutionWordInput.value.trim().toLowerCase();

    let letterCount = new Map();
    for (const letter of solutionWord) {
        if (letterCount.has(letter)) {
            letterCount.set(letter, letterCount.get(letter) + 1);
        } else {
            letterCount.set(letter, 1);
        }
    }

    for (const line of pattern) {
        let patternWord = check(solutionWord, letterCount, line);
        solutionPattern.push(patternWord);
    }

    displayResults(solutionPattern);

}

function check(solution, solutionLetterCount, line) {
    let found_word = ""
    for (const word of dictionary) {

        if (word == solution) {
            let solutionValid = true;
            for (let i = 0; i < 5; i++) {
                if (line[i] != "G") {
                    solutionValid = false;
                }
            }
            if (solutionValid) {
                found_word = solution;
                break;
            }
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

function displayResults(pattern) {
    // assume pattern is a 5x6 array
    for (let i = 0; i < 6; i++) {
        if (pattern[i] !== "") {
            for (let j = 0; j < 5; j++) {
                document.getElementById("error-" + rows[i]).style.visibility = "hidden";
                document.getElementById(rows[i] + j).querySelector(".tile-text").innerText = pattern[i][j].toUpperCase();
            }
        } else {
            document.getElementById("error-" + rows[i]).style.visibility = "visible";
            for (let j = 0; j < 5; j++) {
                document.getElementById(rows[i] + j).querySelector(".tile-text").innerText = "";
            }
        }

    }
}

function syncPatternAndGrid() {
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            const tileImage = document.getElementById(rows[i] + j).querySelector(".tile-image")
            switch (pattern[i][j]) {
                case "_":
                    tileImage.src = "assets/gray.png";
                    break;
                case "Y":
                    tileImage.src = "assets/yellow.png";
                    break;
                case "G":
                    tileImage.src = "assets.green.png";
                    break;
                case "X":
                    tileImage.src = "assets/any.png";
                    break;
            }
        }
    }
}