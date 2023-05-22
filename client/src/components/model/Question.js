

export class Question {
    id;
    numQ;
    question;
    type;
    parent;
    idAnswer;
    aiAnswer;
    answer;
    answerType;

    constructor(id, numQ, question, type, parent, idAnswer, aiAnswer, answer, answerType) {
        this.id = id;
        this.numQ = numQ;
        this.question = question;
        this.type = type;
        this.parent = parent;
        this.idAnswer = idAnswer;
        this.aiAnswer = aiAnswer;
        this.answer = answer;
        this.answerType = answerType;
    }

    getId() {
        return this.id;
    }

    getNumQ() {
        return this.numQ;
    }
    getQuestion() {
        return this.question;
    }

    getType() {
        return this.type;
    }

    getParent() {
        return this.parent;
    }

    getAnswer() {
        return this.answer;
    }

    getAnswerType() {
        return this.answerType;
    }

    setId(id) {
        this.id = id;
    }

    setQuestion(question) {
        this.question = question;
    }

    setType(type) {
        this.type = type;
    }

    setParent(parent) {
        this.parent = parent;
    }

    setAnswer(answer) {
        this.answer = answer;
    }

    setAnswerType(answerType) {
        this.answerType = answerType;
    }

    getAiAnswer() {
        return this.aiAnswer;
    }

    setAiAnswer(aiAnswer) {
        this.aiAnswer = aiAnswer;
    }

    getIdAnswer() {
        return this.idAnswer;
    }

    setIdAnswer(idAnswer) {
        this.idAnswer = idAnswer;
    }

}