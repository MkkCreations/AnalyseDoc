

export class Question {
    _id;
    _numQ;
    _question;
    _type;
    _parent;
    _idAnswer;
    _aiAnswer;
    _aiConfidence;
    _answer;
    _answerType;
    _documentName;
    _resAccepted;
    _checkboxs;

    constructor(id, numQ, question, type, parent, idAnswer, aiAnswer, answer, answerType, aiConfidence, documentName, resAccepted, checkboxs=[]) {
        this._id = id;
        this._numQ = numQ;
        this._question = question;
        this._type = type;
        this._parent = parent;
        this._idAnswer = idAnswer;
        this._aiAnswer = aiAnswer;
        this._answer = answer;
        this._answerType = answerType;
        this._aiConfidence = aiConfidence;
        this._documentName = documentName;
        this._resAccepted = resAccepted;
        this._checkboxs = checkboxs;
    }

    get Id() {
        return this._id;
    }

    get NumQ() {
        return this._numQ;
    }
    get Question() {
        return this._question;
    }

    get Type() {
        return this._type;
    }

    get Parent() {
        return this._parent;
    }

    get Answer() {
        return this._answer;
    }

    get AnswerType() {
        return this._answerType;
    }

    set Id(id) {
        this._id = id;
    }

    set Question(question) {
        this._question = question;
    }

    set Type(type) {
        this._type = type;
    }

    set Parent(parent) {
        this._parent = parent;
    }

    set Answer(answer) {
        this._answer = answer;
    }

    set AnswerType(answerType) {
        this._answerType = answerType;
    }

    get AiAnswer() {
        return this._aiAnswer;
    }

    set AiAnswer(aiAnswer) {
        this._aiAnswer = aiAnswer;
    }

    get IdAnswer() {
        return this._idAnswer;
    }

    set IdAnswer(idAnswer) {
        this._idAnswer = idAnswer;
    }

    get AiConfidence() {
        return this._aiConfidence;
    }

    set AiConfidence(aiConfidence) {
        this._aiConfidence = aiConfidence;
    }

    get documentName() {
        return this._documentName;
    }

    set documentName(value) {
        this._documentName = value;
    }

    get resAccepted() {
        return this._resAccepted;
    }

    set resAccepted(value) {
        this._resAccepted = value;
    }

    get checkboxs() {
        return this._checkboxs;
    }

    set checkboxs(value) {
        this._checkboxs = value;
    }

}