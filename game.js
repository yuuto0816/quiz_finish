const quizData = [
    { question: "プログラムの実行に必要な命令の集合を何と言いますか？", answer: "ソフトウェア",hint:"○○ウェア" },
    { question: "コンピューターに最も基本的な命令を与えるプログラムを何と呼びますか？（カタカナ、正式名所）", answer: "オペレーティングシステム",hint:"OS" },
    { question: "ウェブページの基本的な構造を定義する言語は何ですか？", answer: "HTML",hint:"H○○○" },
    { question: "コンピューターが実行するプログラムのコードを何と言いますか？", answer: "ソースコード",hint:"○○○コード" },
    { question: "インターネット上で通信を行うためのプロトコルは何ですか？", answer: "TCP/IP",hint:"○○○/○○" },
    { question: "プログラミングにおけるループ処理の一種で、一定回数繰り返すものは何ですか？", answer: "for文" },
    { question: "コンピューターの演算や論理演算を行う部分はどこですか？", answer: "CPU" },
    { question: "インターネット上で使用されるIPアドレスはどのような形式ですか？", answer: "IPv4" },
    { question: "ウェブサイトにアクセスするために使用するプロトコルは何ですか？", answer: "HTTP" },
    { question: "HTMLのタグで最初に記述する必要があるものは何ですか？", answer: "<!DOCTYPE html>" },
    { question: "コンピューターに記憶されたデータを長期間保存するためのデバイスは何ですか？", answer: "ハードディスク" },
    { question: "コンピューターのメモリの中で、最も高速なものは何ですか？", answer: "キャッシュメモリ" },
    { question: "ユーザーインターフェースにおいて、文字の色やサイズを指定するために使う言語は何ですか？", answer: "CSS" },
    { question: "コンピューターにおける2進数で、0と1の間でデータを扱う方式は何ですか？", answer: "バイナリ" },
    { question: "コンピュータープログラムのエラーを発見して修正する作業を何と呼びますか？", answer: "デバッグ" },
    { question: "コンピューターネットワークで、情報をやりとりするために使われる装置は何ですか？", answer: "ルーター" },
    { question: "プログラムの中で一度だけ使われる変数のことを何と言いますか？", answer: "ローカル変数" },
    { question: "HTMLでリンクを作成するタグは何ですか？", answer: "a" },
    { question: "ソフトウェア開発において、コードを定期的に管理するためのシステムは何ですか？", answer: "バージョン管理" },
    { question: "コンピュータープログラムの設計に使われる図で、処理の流れを示すものは何ですか？", answer: "フローチャート" },
    { question: "コンピュータープログラムでデータを一時的に格納するためのメモリは何ですか？", answer: "RAM" },
    { question: "ウェブサイトで表示される画像の形式として最もよく使われるものは何ですか？", answer: "JPEG" },
    { question: "インターネット上でドメイン名をIPアドレスに変換するために使うシステムは何ですか？", answer: "DNS" },
    { question: "コンピューターをネットワークに接続するために必要な識別番号は何ですか？", answer: "IPアドレス" },
    { question: "インターネット上でメールを送信するためのプロトコルは何ですか？", answer: "SMTP" },
    { question: "プログラミングにおいて、条件を判定するための命令は何ですか？", answer: "if文" },
    { question: "OSの中で、最も基本的なシステムリソースを管理する部分は何ですか？", answer: "カーネル" },
    { question: "ウェブブラウザでURLを入力すると最初にアクセスするサーバーは何ですか？", answer: "ウェブサーバー" },
    { question: "コンピューターネットワークで、データを送受信するために使われるものは何ですか？", answer: "パケット" },
    { question: "プログラムの実行時にメモリ領域を動的に割り当てる方法は何ですか？", answer: "ヒープ" },
    { question: "ネットワーク上で安全にデータをやり取りするためのプロトコルは何ですか？", answer: "HTTPS" },
    { question: "プログラムの処理が終了したときに表示されるメッセージは何ですか？", answer: "エラーメッセージ" }
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
    
    // quizDataをシャッフルして5問選択
    shuffledQuestions = quizData.sort(() => Math.random() - 0.5).slice(0, 10);
    
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
    
    // 回答ボタンを有効化
    submitButton.disabled = false;
    hintButton.disabled = false;
    
    // 「次の問題」ボタンを非表示にする
    nextQuestionButton.style.display = "none";

    // インプットボックスにフォーカスを当てる
    answerInput.focus();
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
    
    // 回答ボタンを無効化
    submitButton.disabled = true;
    hintButton.disabled = true;
}

// ヒントボタンのイベントリスナー
hintButton.addEventListener("click", () => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    if (!hintUsed) {
        // ヒントを表示
        feedbackText.textContent = `ヒント: ${currentQuestion.hint}`;
        feedbackText.classList.add("hint"); // ヒント用のスタイルを適用
        hintUsed = true; // ヒント使用済みにする
        hintButton.textContent = "ヒントを非表示にする"; // ボタンの文言を変更
    } else {
        // ヒントを非表示
        feedbackText.textContent = "";
        feedbackText.classList.remove("hint"); // ヒントのスタイルを削除
        hintUsed = false; // ヒント未使用状態に戻す
        hintButton.textContent = "ヒントを見る"; // ボタンの文言を元に戻す
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

    // 「次の問題」ボタンも非表示に
    nextQuestionButton.style.display = "none"; // 非表示にする

});

// スコアの更新
function updateScores() {
    playerScores.textContent = `${player1Name}: ${player1Score}点 | ${player2Name}: ${player2Score}点`;
}

// イベントリスナー
submitButton.addEventListener("click", () => {
    handleAnswer(answerInput.value.trim());
});

// 既存の「エンターキーで回答を送信」のイベントリスナー
answerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // デフォルトの動作（改行）を防ぐ

        // 回答が処理されている場合は、Enterキーを無視
        if (submitButton.disabled) {
            return;
        }

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
