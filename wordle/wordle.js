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






const url = "https://raw.githubusercontent.com/ControllerTaikoFan/controllertaikofan.github.io/refs/heads/main/wordle/dictionary/dictionary.txt";
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

let triedWords = [
    [],
    [],
    [],
    [],
    [],
    []
];
syncPatternAndGrid();


allTiles.forEach(child => {
    child.addEventListener("click", function () {
        const tileRow = rows.indexOf(child.id[0]);
        const tileCol = Number(child.id[1]);
        const tileImage = child.querySelector(".tile-image");
        switch (pattern[tileRow][tileCol]) { //  cycle between _, Y, G, and X
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

        triedWords[tileRow] = [];
    })
});

for (let i = 0; i < 6; i++) {
    const row = rows[i];
    document.getElementById("refresh-" + row).addEventListener("click", function () {
        const solutionWord = solutionWordInput.value.trim().toLowerCase();

        let letterCount = new Map();
        for (const letter of solutionWord) {
            if (letterCount.has(letter)) {
                letterCount.set(letter, letterCount.get(letter) + 1);
            } else {
                letterCount.set(letter, 1);
            }
        }
        let word = check(solutionWord, letterCount, pattern[i], triedWords[i]);
        if (word == triedWords[i][0]) {
            triedWords[i] = [word];
        } else {
            triedWords[i].push(word);
        }



        if (word !== "") {
            for (let j = 0; j < 5; j++) {
                document.getElementById("error-" + rows[i]).style.visibility = "hidden";
                document.getElementById(row + j).querySelector(".tile-text").innerText = word[j].toUpperCase();
            }
        } else {
            document.getElementById("error-" + rows[i]).style.visibility = "visible";
            for (let j = 0; j < 5; j++) {
                document.getElementById(rows[i] + j).querySelector(".tile-text").innerText = "";
            }
        }
    });
}

function determineWord() {
    let solutionPattern = [];
    const solutionWord = solutionWordInput.value.trim().toLowerCase();

    triedWords = [
        [],
        [],
        [],
        [],
        [],
        []
    ];

    let letterCount = new Map();
    for (const letter of solutionWord) {
        if (letterCount.has(letter)) {
            letterCount.set(letter, letterCount.get(letter) + 1);
        } else {
            letterCount.set(letter, 1);
        }
    }

    for (let i = 0; i < pattern.length; i++) {
        const line = pattern[i];
        let patternWord = check(solutionWord, letterCount, line, triedWords[i]);
        solutionPattern.push(patternWord);

        if (patternWord != "") {
            triedWords[i].push(patternWord);
            document.getElementById("refresh-" + rows[i]).style.visibility = "visible";
        } else {
            document.getElementById("refresh-" + rows[i]).style.visibility = "hidden";
        }
    }

    displayResults(solutionPattern);
    syncPatternAndGrid();

}

function check(solution, solutionLetterCount, line, forbiddenWords) {
    let found_word = ""
    for (const word of dictionary) {
        if (forbiddenWords.includes(word)) {
            continue;
        }
        if (word == solution) {
            let solutionValid = true;
            for (let i = 0; i < 5; i++) { // check if the line is all green
                if (line[i] != "G") {
                    solutionValid = false;
                    break;
                }
            }
            if (solutionValid) {
                return word;
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
                    } else {
                        if (solution[i] == currentLetter) { // change the X to either Y or G
                            line[i] = "G";
                        } else {
                            line[i] = "Y";
                        }
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

    if (found_word === "") {
        if (forbiddenWords.length > 0) {
            found_word = forbiddenWords[0];
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
                    tileImage.src = "assets/green.png";
                    break;
                case "X":
                    tileImage.src = "assets/any.png";
                    break;
            }
        }
    }
}