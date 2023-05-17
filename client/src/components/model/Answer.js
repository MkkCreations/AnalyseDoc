
export class Answer {
    id;
    idQuestion;
    answer;
    answerType;
    aiAnswer;
    idDili;
    idUser;

    constructor(id, idQuestion, answer, answerType, aiAnswer, idDili, idUser) {
        this.id = id;
        this.idQuestion = idQuestion;
        this.answer = answer;
        this.answerType = answerType;
        this.aiAnswer = aiAnswer;
        this.idDili = idDili;
        this.idUser = idUser;
    }

    getId() {
        return this.id;
    }

    getIdQuestion() {
        return this.idQuestion;
    }

    getAnswer() {
        return this.answer;
    }

    getAnswerType() {
        return this.answerType;
    }

    getAiAnswer() {
        return this.aiAnswer;
    }

    getIdDili() {
        return this.idDili;
    }

    getIdUser() {      
        return this.idUser;
    }

    setId(id) {
        this.id = id;
    }

    setIdQuestion(idQuestion) {
        this.idQuestion = idQuestion;
    }

    setAnswer(answer) {
        this.answer = answer;
    }

    setAnswerType(answerType) {
        this.answerType = answerType;
    }

    setAiAnswer(aiAnswer) {
        this.aiAnswer = aiAnswer;
    }

    setIdDili(idDili) {
        this.idDili = idDili;
    }

    setIdUser(idUser) {
        this.idUser = idUser;
    }

}