
const wordApp = {};
wordApp.url = "https://api.datamuse.com/words";
wordApp.baseWord = "";
wordApp.randomWordLoop;
wordApp.fallbackWords = ["toronto", "raccoon", "love", "champions", "monster", "celebrity", "fame", "gender"];
wordApp.$inputWord = $('#inputWord');

$(() => {
    wordApp.init();
});

wordApp.init = () => {
    wordApp.baseWord = wordApp.pickRandomWord([]);
    let wordString;
    wordApp.generateRandomName();
    clearInterval();
    wordApp.$inputWord.prop('placeholder', wordApp.baseWord);
    // wordApp.randomWordLoop = setInterval(wordApp.loopInterval, 5000);  
    wordApp.loopListener();
    wordApp.jjaListener();
}

wordApp.generateRandomName = () => {
    clearInterval(wordApp.randomWordLoop);
    let firstWord, secondWord, thirdWord;
    const starterWordsArray = wordApp.getWords("", {topics: wordApp.baseWord, v: "enwiki"});
    $.when(starterWordsArray).done((firstSet) => {
        firstWord = wordApp.pickRandomWord(firstSet);
        const secondWordArray = wordApp.getWords("", {rel_bga: firstWord, v: "enwiki"});
        $.when(secondWordArray).done((secondSet) => {
            secondWord = wordApp.pickRandomWord(secondSet);
            const thirdWordArray = wordApp.getWords("", {rel_rhy: secondWord, v: "enwiki"});
            $.when(thirdWordArray).done((thirdSet) => {
                thirdWord = wordApp.pickRandomWord(thirdSet);
                console.log(wordApp.baseWord + ": " + " " + firstWord + " [" + secondWord + "] " + thirdWord);
                $('#rhymeString').text(`${firstWord} ${secondWord} ${thirdWord}`)
            });
        });
    });
    wordApp.randomWordLoop = setInterval(wordApp.generateRandomName, 5000);
}

wordApp.pickRandomWord = (result) => {
    let randomNumber = Math.floor(Math.random() * result.length);
    if(result[randomNumber] !== undefined) {
        return result[randomNumber].word;
    } else {
        console.log("fallback");
        return wordApp.fallbackWords[Math.floor(Math.random() * wordApp.fallbackWords.length)];
    }
}

wordApp.loopInterval = () => {
};

wordApp.loopListener = () => {
    $('#playLoop').click(function() {
        $('#playLoop').prop('disabled', true);
        $('#pauseLoop').prop('disabled', false);
        wordApp.loopInterval();
        wordApp.generateRandomName();
        // wordApp.randomWordLoop = setInterval(wordApp.generateRandomName, 5000);     
    });
    
    $('#pauseLoop').click(function() {
        $('#playLoop').prop('disabled', false);
        $('#pauseLoop').prop('disabled', true);
        clearInterval(wordApp.randomWordLoop);
    });
};

wordApp.jjaListener = () => {
    $('#nounForm').submit((ev) => {
        ev.preventDefault();
        clearInterval(wordApp.randomWordLoop);
        $('#playLoop').prop('disabled', true);
        // $('#rhymeString').empty();
        if(wordApp.$inputWord.val() !== "") {
            wordApp.baseWord = wordApp.$inputWord.val();    
        }
        wordApp.generateRandomName(wordApp.baseWord);
    })
}

wordApp.requestObject = {
    url: wordApp.url,
    method: "GET",
    dataType: "json",
    data: {}
}

// wordApp.buildRequest = (params) => {
//     // wordApp.requestObject.data = {};                
//     wordApp.requestObject.data = params;                
//     // for (let key in params) {
//     //     wordApp.requestObject.data[key] = params[key];
//     // }
//     wordApp.getWord();
// }

wordApp.getWords = (word, params) => {   
    // console.log("getWds");
    // console.log("title",$('.lead').text());         
    wordApp.requestObject.data = params; 
    const result = $.ajax(wordApp.requestObject)
    // .then(
    //     (result) => {
    //         // const randomNumber = 0;
    //         
    //     }
    //     );
    return result;
}