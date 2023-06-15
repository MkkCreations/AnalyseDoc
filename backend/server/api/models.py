from typing import Any
from django.db import models
from django.contrib.auth.models import User

# Create your models here.


# ======================================== #
class Question(models.Model):
    num_q = models.CharField(max_length=32)
    question = models.CharField(max_length=600)
    type = models.CharField(max_length=32)
    parent = models.CharField(max_length=32, null=True)

# ======================================== #
def path_ici(instance, filename):
    return 'ici/{diligence}/{filename}'.format(filename=filename, diligence=instance.diligence.id)

class Diligence(models.Model):
    dili_name = models.CharField(max_length=32, unique=True)
    date = models.DateTimeField(auto_now=True)
    ici = models.CharField(max_length=64, null=True)
    
    def get_questions_answers(self, dili, doc_id=None) -> Any:
        questions = {}
        if doc_id is None:
            answers = Answer.objects.filter(diligence=dili)
        else:
            print(doc_id)
            doc_type = Document.objects.get(id=doc_id).docType
            answers = Answer.objects.filter(diligence=dili, document_name=doc_type)
            
        for answer in answers:
            questions[answer.question.id] = [
                {
                'id_q': answer.question.id, 
                'num_q': answer.question.num_q, 
                'question': answer.question.question, 
                'type': answer.question.type, 
                'parent': answer.question.parent
                },{
                'id_res': answer.id , 
                'ai_confidence': answer.ai_confidence, 
                'ai_res': answer.ai_res.lower() if answer.ai_res else None, 
                'answer': answer.answer.lower() if answer.answer else None, 
                'answer_type': answer.answer_type, 
                'document_name': answer.document_name, 
                'ai_res_accepted': answer.ai_res_accepted
                },
                []
            ]
            if answer.question.type == 'C':
                checkboxs = Mapping_checkBox.objects.filter(num_q=answer.question.num_q)
                for check in checkboxs:
                    questions[answer.question.id][2].append({
                        'num_q': check.num_q,
                        'data_q': check.data_q
                    })
        return questions

# ======================================== #
class Answer(models.Model):
    ai_res = models.CharField(max_length=500, null=True)
    ai_confidence = models.FloatField(null=True)
    answer = models.CharField(max_length=200, null=True)
    answer_type = models.CharField(max_length=32, null=True)
    document_name = models.CharField(max_length=64, null=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)
    diligence = models.ForeignKey(Diligence, on_delete=models.CASCADE)
    ai_res_accepted = models.IntegerField(default=0)
    
    def ai_response_parser(ai_res, diligence_id):
        for key in ai_res:
            try:
                answer = Answer.objects.filter(diligence_id=diligence_id, question_id=Question.objects.get(num_q=key['no_ici']))
                answer.update(ai_res=key['answer'], answer_type='AI', ai_confidence=key['confidence_score'], document_name=key['document_type'])
            except:
                pass
    
    def clear_ai_answers(diligence_id, doc_name):
        answers = Answer.objects.filter(diligence_id=diligence_id, answer_type='AI', document_name=doc_name)
        answers.update(ai_res=None, ai_confidence=None, answer_type=None, document_name=None)

    # =================== Fonction pour automatiser le mapping ==================== #
    def get_mapping_num(diligence_id):
        resultats = []
        answers = Answer.objects.filter(diligence_id=diligence_id, answer_type__in=['AI', 'H'])
        print(len(answers))


        for answer in answers:
            print(answer.question.type)
            if answer.question.type == 'T':
                mapping = Mapping_text.objects.get(num_q=answer.question.num_q)
                if not answer.answer:
                    resultats.append({'q_type': answer.question.type,'num_q': answer.question.num_q, 'num_map': mapping.num_map, 'answer': answer.ai_res})
                else:
                    resultats.append({'q_type': answer.question.type,'num_q': answer.question.num_q, 'num_map': mapping.num_map, 'answer': answer.answer})
                    
            elif answer.question.type == 'R':
                print(answer.question.num_q)
                mapping = Mapping_radio.objects.get(num_q=answer.question.num_q)
                if str(answer.answer).lower() == 'yes' or str(answer.ai_res).lower() == 'yes':
                    resultats.append({'q_type': answer.question.type,'num_q': answer.question.num_q, 'num_map': mapping.num_map_yes})
                elif str(answer.answer).lower() == 'no' or str(answer.ai_res).lower() == 'no':
                    resultats.append({'q_type': answer.question.type,'num_q': answer.question.num_q, 'num_map': mapping.num_map_no})
                else:
                    pass
            elif answer.question.type == 'C':
                if not answer.answer or not answer.ai_res:
                    pass
                else:
                    mapping = Mapping_checkBox.objects.get(num_q=answer.question.num_q, data_q__in=answer.answer.split(','))
                    resultats.append({'q_type': answer.question.type,'num_q': answer.question.num_q, 'num_map': mapping.num_map})
            else:
                pass

        print(resultats)
        return resultats


# ======================================== #
class Mapping_text(models.Model):
    num_map = models.CharField(max_length=32, primary_key=True, unique=True)
    num_q = models.CharField(max_length=16)
    
class Mapping_radio(models.Model):
    num_q = models.CharField(max_length=16, primary_key=True, unique=True)
    num_map_yes = models.CharField(max_length=32, unique=True)
    num_map_no = models.CharField(max_length=32, unique=True)
    num_map_nan = models.CharField(max_length=32, null=True)
    
class Mapping_checkBox(models.Model):
    num_q = models.CharField(max_length=16)
    data_q = models.CharField(max_length=64)
    num_map = models.CharField(max_length=64, primary_key=True, unique=True)
    
    def get_all_by_question(self, num_q):
        return Mapping_checkBox.objects.filter(num_q=num_q)
    
# ======================================== #
def upload_to(instance, filename):
    return 'documents/{diligence}/{filename}'.format(filename=filename, diligence=instance.diligence.id)
    
class Document(models.Model):
    name = models.CharField(max_length=32)
    document = models.FileField(upload_to=upload_to)
    user = models.IntegerField(User, null=True)
    docType = models.CharField(max_length=32, null=True)
    diligence = models.ForeignKey(Diligence, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now=True)
