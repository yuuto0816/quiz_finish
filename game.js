const quizData = [
    { question: "プログラムが予期しない状態になったときに発生するエラーを何と呼びますか？", answer: ["例外", "エクセプション", "例外処理"], hint: "E○○○○○○○○" },
    { question: "ウェブページを構築するために使用されるスタイルシート言語は何ですか？", answer: ["CSS", "css"], hint: "C○○" },
    { question: "Linuxでスーパーユーザーになるために使用されるコマンドは何ですか？", answer: ["sudo"], hint: "s○○○" },
    { question: "ドメイン名をIPアドレスに変換する仕組みは何ですか？", answer: ["DNS", "dns"], hint: "D○○" },
    { question: "プログラミングにおいて、特定の条件を満たすまで繰り返し実行される構造を何と呼びますか？", answer: ["while文", "while", "WHILE", "WHILE文"], hint: "W○○○○文" },
    { question: "ネットワーク上でデータを暗号化して送信するプロトコルは何ですか？", answer: ["HTTPS", "https"], hint: "H○○○S" },
    { question: "コンピューターが起動時に基本的なハードウェアの初期化を行うシステムは何ですか？", answer: ["BIOS", "bios"], hint: "B○○○" },
    { question: "データベースでデータを操作するための言語は何ですか？", answer: ["SQL", "sql"], hint: "S○○" },
    { question: "IPv4アドレスのビット数は何ビットですか？", answer: ["32ビット", "32bit", "32ビットアドレス"], hint: "2の32乗" },
    { question: "コンピュータープログラムの繰り返し処理を中断するために使用されるキーワードは何ですか？", answer: ["break", "BREAK"], hint: "b○○○○" },
    { question: "JavaScriptで文字列を結合するために使用される演算子は何ですか？", answer: ["+", "プラス"], hint: "P○○○" },
    { question: "Gitでリモートリポジトリから変更を取得するコマンドは何ですか？", answer: ["git pull", "pull"], hint: "P○○○" },
    { question: "仮想マシンを管理するために使用されるオープンソースソフトウェアは何ですか？", answer: ["VirtualBox", "KVM", "VMware", "Hyper-V"], hint: "V○○○○○○○○" },
    { question: "ウェブサイトのサーバー応答速度を測定するためのコマンドは何ですか？", answer: ["ping"], hint: "p○○○" },
    { question: "JavaScriptで条件分岐を行うために使用されるキーワードは何ですか？", answer: ["if", "IF"], hint: "I○" },
    { question: "Pythonでリストの長さを取得するために使用される関数は何ですか？", answer: ["len", "LEN"], hint: "L○○" },
    { question: "暗号通信においてSSLを置き換えるために使用される技術は何ですか？", answer: ["TLS", "tls"], hint: "T○○" },
    { question: "HTTPリクエストでサーバーにリソースを送信する際に使用されるメソッドは何ですか？", answer: ["POST", "post"], hint: "P○○○" },
    { question: "コンピューターで時間を測定するために使用されるクロックの単位は何ですか？", answer: ["Hz", "ヘルツ"], hint: "H○" },
    { question: "Pythonで例外処理を行うために使用されるキーワードは何ですか？", answer: ["try", "TRY"], hint: "T○○" }
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
    shuffledQuestions = quizData.sort(() => Math.random() - 0.5).slice(0, 30);
    
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

    // 正解の配列（小文字で正規化）
    const correctAnswers = shuffledQuestions[currentQuestionIndex].answer;

    // ユーザーの回答（小文字で正規化）
    const userAnswerNormalized = userAnswer.trim();

    // ユーザーの回答が正解のどれかと一致するかをチェック
    if (correctAnswers.includes(userAnswerNormalized)) {
        feedbackText.textContent = "正解！";
        feedbackText.className = "correct";
        currentPlayer === 1 ? player1Score++ : player2Score++;
    } else {
        feedbackText.textContent = `不正解！ 正解は「${correctAnswers[0]}」でした。`;
        feedbackText.className = "incorrect";
    }
    
    // 次の質問に進むために設定
    currentQuestionIndex++;
    currentPlayer = currentPlayer === 1 ? 2 : 1; // プレイヤーを切り替え
    nextQuestionButton.style.display = "block";
    nextQuestionButton.focus(); // 「次の問題」ボタンにフォーカスを当てる

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
    } else {
        // ヒントを非表示
        feedbackText.textContent = "";
        feedbackText.classList.remove("hint"); // ヒントのスタイルを削除
        hintUsed = false; // ヒント未使用状態に戻す
    }
    // ヒントボタンの文言を変更せず常に「ヒント」
    hintButton.textContent = "ヒント"; 
});


// 「次の問題に進む」ボタンのイベントリスナー
nextQuestionButton.addEventListener("click", () => {
    // 次の問題に進む前にヒントボタンの状態をリセット
    hintButton.textContent = "ヒント";  // ヒントボタンのテキストを元に戻す
    feedbackText.textContent = "";  // フィードバックをクリア（ヒントが表示されていた場合も含めて）
    feedbackText.className = "";  // 正解・不正解のクラスもリセット

    if (currentQuestionIndex < shuffledQuestions.length) {
        loadQuestion();  // 新しい問題をロード
        nextQuestionButton.style.display = "none";  // 「次の問題に進む」ボタンを非表示
    } else {
        endGame();  // すべての問題が終わった場合はゲーム終了
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
    shuffledQuestions = quizData.sort(() => Math.random() - 0.5).slice(0, 10); // クイズ問題をシャッフル
    quizContainer.style.display = "block";  // クイズ画面を表示
    resultScreen.style.display = "none";   // 結果画面を非表示
    loadQuestion(); // 最初の質問を読み込む
});

// 「強制終了してトップに戻る」ボタンのイベントリスナーを追加
const forceExitButton = document.getElementById("forceExitButton");

forceExitButton.addEventListener("click", () => {
    // クイズ画面を非表示にして、トップ画面に戻す
    quizContainer.style.display = "none"; // クイズ画面を非表示
    startScreen.style.display = "block";  // スタート画面を表示
    resultScreen.style.display = "none"; // 結果画面を非表示
    
    // プレイヤー名やスコアなどをリセット
    player1Input.value = "";
    player2Input.value = "";
    player1Score = 0;
    player2Score = 0;
    currentQuestionIndex = 0;
    currentPlayer = 1;

    // 「次の問題」ボタンも非表示にする
    nextQuestionButton.style.display = "none"; // 非表示にする
});

// リスタートボタン
forceRestartButton.addEventListener("click", () => {
    player1Score = 0;
    player2Score = 0;
    currentQuestionIndex = 0;
    currentPlayer = 1;
    shuffledQuestions = quizData.sort(() => Math.random() - 0.5); // クイズ問題をシャッフル
    quizContainer.style.display = "block";  // クイズ画面を表示
    resultScreen.style.display = "none";   // 結果画面を非表示
    loadQuestion(); // 最初の質問を読み込む
});