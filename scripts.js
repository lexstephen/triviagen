
const wordApp = {};
wordApp.url = "https://api.datamuse.com/words";
wordApp.iteration = 0;
wordApp.randomWordLoop;

$(() => {
    wordApp.init();
});

wordApp.init = () => {
    let wordString;
    wordApp.randomOnLoad();
    wordApp.randomWordLoop = setInterval(wordApp.loopInterval, 2000);  
    wordApp.loopListener();
    wordApp.jjaListener();
}

wordApp.randomOnLoad = () => {
    wordApp.getWord("", {topics: "celebrity", v: "enwiki"});
    wordApp.getWord("", {rel_jja: "answer", topics: "sports", v: "enwiki"});
}

wordApp.loopInterval = () => {
    $('#rhymeString').empty();
    wordApp.iteration = 0;
    wordApp.getWord("", {topics: "celebrity", v: "enwiki"});
    wordApp.getWord("", {rel_jja: "answer", topics: "sports", v: "enwiki"});
};

wordApp.loopListener = () => {
    $('#loop').change(function() {
        if(this.checked) {
            wordApp.randomWordLoop = setInterval(wordApp.loopInterval, 2000);  
        } else {
            clearInterval(wordApp.randomWordLoop);
        }
    })
};

wordApp.jjaListener = () => {
    $('#nounForm').submit((ev) => {
        ev.preventDefault();
        wordApp.iteration = 0;
        $('#rhymeString').empty();
        const word = $('#inputWord').val();
        wordApp.getWord(`${word}`,{topics: word, rel_jja: word});
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

wordApp.getWord = (word, params) => {   
    // console.log("title",$('.lead').text());         
    wordApp.requestObject.data = params; 
    $.ajax(wordApp.requestObject).then(
        (result) => {
            // const randomNumber = 0;
            const randomNumber = Math.floor(Math.random() * result.length);
            const thisWord = result[randomNumber].word;
            // console.log("data object:",wordApp.requestObject.data);
            // console.log(`${randomNumber}: ${result[randomNumber].word}`, result);
            // console.log("decision",`Chose ${thisWord} from index ${randomNumber}`);
            $('#rhymeString').append(` ${word} ${thisWord}`);
            wordApp.iteration++;
            if(wordApp.iteration < 2) {
                wordApp.getWord(``,{ rel_rhy: thisWord});
            }
        });
}