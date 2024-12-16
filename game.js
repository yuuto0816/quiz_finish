const quizData = [
    { question: "プログラムの実行に必要な命令の集合を何と言いますか？", answer: "ソフトウェア" },
    { question: "コンピューターに最も基本的な命令を与えるプログラムを何と呼びますか？", answer: "オペレーティングシステム" },
    { question: "HTMLは主に何を作成するために使われますか？", answer: "ウェブページ" },
    { question: "PythonやJavaScriptなどの言語は何と呼ばれますか？", answer: "プログラミング言語" }
];

let shuffledQuestions, currentQuestionIndex;
let player1Name, player2Name, currentPlayer = 1;
let player1Score = 0, player2Score = 0;
let timer, timeLeft;
let hintUsed = false; // ヒント使用フラグ

// HTML要素の取得
const startScreen = document.getElementById("startScreen");
const quizContainer = document.getElementById("quizContainer");
const resultScreen = document.getElementById("resultScreen");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const player1Input = document.getElementById("player1Name");
const player2Input = document.getElementById("player2Name");
const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const submitButton = document.getElementById("submitButton");
const hintButton = document.getElementById("hintButton");
const feedbackText = document.getElementById("feedbackText");
const playerScores = document.getElementById("playerScores");
const timerDisplay = document.getElementById("timer");
const currentPlayerDisplay = document.getElementById("currentPlayer");
const finalResult = document.getElementById("finalResult");
const nextQuestionButton = document.getElementById("nextQuestionButton");
const goToTopButton = document.getElementById("goToTopButton");

// ゲーム開始
startButton.addEventListener("click", () => {
    // スコアのリセット
    player1Score = 0;
    player2Score = 0;
    currentQuestionIndex = 0;
    currentPlayer = 1;

    player1Name = player1Input.value || "プレイヤー1";
    player2Name = player2Input.value || "プレイヤー2";
    shuffledQuestions = quizData.sort(() => Math.random() - 0.5);
    startScreen.style.display = "none";
    quizContainer.style.display = "block";
    loadQuestion();
});

// 質問のロード
function loadQuestion() {
    clearInterval(timer);
    timeLeft = 20;
    hintUsed = false;
    timerDisplay.textContent = `残り時間: ${timeLeft}秒`;
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    feedbackText.textContent = "";
    feedbackText.className = ""; // 正解・不正解のスタイルをリセット
    answerInput.value = "";
    currentPlayerDisplay.textContent = `${currentPlayer === 1 ? player1Name : player2Name}のターン`;
    updateScores();
    startTimer();
}

// タイマー機能
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `残り時間: ${timeLeft}秒`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleAnswer(""); // 時間切れは空の回答として処理
        }
    }, 1000);
}

// 答えをチェック
function handleAnswer(userAnswer) {
    clearInterval(timer);
    const correctAnswer = shuffledQuestions[currentQuestionIndex].answer;
    if (userAnswer === correctAnswer) {
        feedbackText.textContent = "正解！";
        feedbackText.className = "correct";
        currentPlayer === 1 ? player1Score++ : player2Score++;
    } else {
        feedbackText.textContent = `不正解！ 正解は「${correctAnswer}」でした。`;
        feedbackText.className = "incorrect";
    }
    currentQuestionIndex++;
    currentPlayer = currentPlayer === 1 ? 2 : 1; // プレイヤーを切り替え

    // 「次の問題に進む」ボタンを表示
    nextQuestionButton.style.display = "block";
}

// ヒント機能
hintButton.addEventListener("click", () => {
    const correctAnswer = shuffledQuestions[currentQuestionIndex].answer;
    if (!hintUsed) {
        feedbackText.textContent = `ヒント: ${correctAnswer.charAt(0)}...`;
        feedbackText.classList.add("hint");
        hintUsed = true;
        hintButton.textContent = "ヒントを非表示にする";
    } else {
        feedbackText.textContent = "";
        feedbackText.classList.remove("hint");
        hintUsed = false;
        hintButton.textContent = "ヒントを見る";
    }
});

// 「次の問題に進む」ボタンのイベントリスナー
nextQuestionButton.addEventListener("click", () => {
    if (currentQuestionIndex < shuffledQuestions.length) {
        loadQuestion();
        nextQuestionButton.style.display = "none"; // ボタンを非表示
    } else {
        endGame();
    }
});

// ゲーム終了
function endGame() {
    quizContainer.style.display = "none";
    resultScreen.style.display = "block";
    const resultText = player1Score > player2Score
        ? `${player1Name}の勝ち！`
        : player1Score < player2Score
        ? `${player2Name}の勝ち！`
        : "引き分け！";
    finalResult.textContent = `結果: ${resultText}\n${player1Name}: ${player1Score}点 | ${player2Name}: ${player2Score}点`;
}

// トップに戻るボタン
goToTopButton.addEventListener("click", () => {
    startScreen.style.display = "block";  // スタート画面を表示
    resultScreen.style.display = "none";  // 結果画面を非表示
    quizContainer.style.display = "none"; // クイズ画面を非表示

    // 名前を入力する画面に戻す
    player1Input.value = "";
    player2Input.value = "";

    // スコアをリセット
    player1Score = 0;
    player2Score = 0;
    currentQuestionIndex = 0;
    currentPlayer = 1;
});

// スコアの更新
function updateScores() {
    playerScores.textContent = `${player1Name}: ${player1Score}点 | ${player2Name}: ${player2Score}点`;
}

// イベントリスナー
submitButton.addEventListener("click", () => {
    handleAnswer(answerInput.value.trim());
});

// エンターキーで回答を送信
answerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // デフォルトの動作（改行）を防ぐ
        handleAnswer(answerInput.value.trim()); // 回答を処理
    }
});

// リスタートボタン
restartButton.addEventListener("click", () => {
    player1Score = 0;
    player2Score = 0;
    currentQuestionIndex = 0;
    currentPlayer = 1;
    shuffledQuestions = quizData.sort(() => Math.random() - 0.5); // クイズ問題をシャッフル
    quizContainer.style.display = "block";  // クイズ画面を表示
    resultScreen.style.display = "none";   // 結果画面を非表示
    loadQuestion(); // 最初の質問を読み込む
});
