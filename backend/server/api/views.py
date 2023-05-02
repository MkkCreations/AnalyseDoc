from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import Question, User, Diligence, Answer, Mapping
import json
from datetime import datetime
from django.contrib.auth import login, logout
from rest_framework import generics
from rest_framework import permissions
from rest_framework import status
from rest_framework import views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from . import serializers
from rest_framework.authentication import SessionAuthentication

# Create your views here.


class LoginView(views.APIView):
    # This view should be accessible also for unauthenticated users.
    
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format=None):
        serializer = serializers.LoginSerializer(data=self.request.data, context={ 'request': self.request })
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return Response(None, status=status.HTTP_202_ACCEPTED)


class LogoutView(views.APIView):

    def post(self, request, format=None):
        logout(request)
        return Response(None, status=status.HTTP_204_NO_CONTENT)

class RegisterUserView(generics.CreateAPIView):
    
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    authentication_classes = ()
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = serializers.RegisterSerializer


class ProfileView(views.APIView):
    
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    
    def get(self, request):
        serializer = serializers.UserSerializer(request.user)
        return Response({'user':serializer.data}, status=status.HTTP_200_OK)



#========================================
class QuestionView(View):
    
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, numQ=0):
        if numQ > 0:
            questions = list(Question.objects.filter(num_q=numQ).values())
            if len(questions) > 0:
                question = questions[0]
                datos={'message': 'Success', 'question': question}
            else:
                datos={'message': 'Not found...'}
            return JsonResponse(datos)
        else:
            questions = Question.objects.all()
            if len(questions) > 0:
                datos={'message': 'Success', 'questions': list(questions.values())}
            else:
                datos={'message': 'Not found...'}
            return JsonResponse(datos)
    
    def post(self, request):
        jd = json.loads(request.body)
        Question.objects.create(num_q=jd['num_q'], question=jd['question'], type=jd['type'], parent=jd['parent'])
        datos={'message': 'Success'}
        return JsonResponse(datos)
    
    def put(self, request, id):
        jd = json.loads(request.body)
        questions = list(Question.objects.filter(id=id).values())
        if len(questions) > 0:
            question = Question.objects.get(id=id)
            question.num_q=jd['num_q']
            question.question=jd['question']
            question.type=jd['type']
            question.parent=jd['parent']
            question.save()
            datos={'message': 'Success'}
        else: 
            datos={'message': 'Not found...'}
        return JsonResponse(datos)
        
    
    def delete(self, request, id):
        questions = list(Question.objects.filter(id=id).values())
        if len(questions) > 0:
            Question.objects.filter(id=id).delete()
            datos={'message': 'Success'}
        else:
            datos={'message': 'Not found...'}
        return JsonResponse(datos)
    

#========================================
class UserView(View):
        
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request):
        print(request)
        jd = json.loads(request.body)
        print(jd)
        if jd['usr'] != "" and jd['pwd'] != "":
            users = list(User.objects.filter(username=jd['usr'], password=jd['pwd']).values())
            if len(users) > 0:
                user = users[0]
                datos={'message': 'Success', 'user': user}
                self.update_login(id=user['id'])
            else:
                datos={'message': 'Not found...'}
            return JsonResponse(datos)
        else:
            datos={'message': 'Not found...'}
            return JsonResponse(datos)
    
    def post(self, request):
        jd = json.loads(request.body)
        User.objects.create(name=jd['name'], email=jd['email'], username=jd['usr'], password=jd['pwd'], last_login=str(datetime.now()))
        datos={'message': 'Success'}
        return JsonResponse(datos)
    
    def put(self, request, id):
        print(request)
        jd = json.loads(request.body)
        users = list(User.objects.filter(id=id).values())
        if len(users) > 0:
            user = User.objects.get(id=id)
            user.name=jd['name']
            user.email=jd['email']
            user.username=jd['usr']
            user.password=jd['pwd']
            user.last_login=str(datetime.now())
            user.save()
            datos={'message': 'Success'}
        else: 
            datos={'message': 'Not found...'}
        return JsonResponse(datos)
        
    
    def delete(self, request, id):
        users = list(User.objects.filter(id=id).values())
        if len(users) > 0:
            User.objects.filter(id=id).delete()
            datos={'message': 'Success'}
        else:
            datos={'message': 'Not found...'}
        return JsonResponse(datos)

    def update_login(self, id):
        user = User.objects.get(id=id)
        user.last_login=str(datetime.now())
        user.save()
        return JsonResponse({'message': 'Success'})


#========================================
class DiligenceView(View):
            
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request, id=0):
        if id > 0:
            diligences = list(Diligence.objects.filter(id=id).values())
            if len(diligences) > 0:
                diligence = diligences[0]
                datos={'message': 'Success', 'diligence': diligence}
            else:
                datos={'message': 'Not found...'}
            return JsonResponse(datos)
        else:
            diligences = Diligence.objects.all()
            if len(diligences) > 0:
                datos={'message': 'Success', 'diligences': list(diligences.values())}
            else:
                datos={'message': 'Not found...'}
            return JsonResponse(datos)
    
    def post(self, request):
        jd = json.loads(request.body)
        Diligence.objects.create(dili_name=jd['dili_name'], date=str(datetime.now()))
        newDili = list(Diligence.objects.filter(dili_name=jd['dili_name']).values())[0]
        questions = list(Question.objects.all().values())
        for question in questions:
            quest = Question.objects.get(id=question['id'])
            Answer.objects.create(question=quest, diligence_id=newDili['id'], user_id=jd['user_id'])
        datos={'message': 'Success', 'diligence': newDili}
        return JsonResponse(datos)
    
    def put(self, request, id):
        jd = json.loads(request.body)
        diligences = list(Diligence.objects.filter(id=id).values())
        if len(diligences) > 0:
            diligence = Diligence.objects.get(id=id)
            diligence.dili_name=jd['dili_name']
            diligence.save()
            datos={'message': 'Success'}
        else: 
            datos={'message': 'Not found...'}
        return JsonResponse(datos)
        
    
    def delete(self, request, id):
        diligences = list(Diligence.objects.filter(id=id).values())
        if len(diligences) > 0:
            Diligence.objects.filter(id=id).delete()
            datos={'message': 'Success'}
        else:
            datos={'message': 'Not found...'}
        return JsonResponse(datos)


#========================================
class AnswerView(View):
            
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request):
        jd = json.loads(request.body)
        if jd['id_dili'] != "" and not jd['id_question']:
            answers = list(Answer.objects.filter(diligence=jd['id_dili']).values())
            if len(answers) > 0:
                datos={'message': 'Success', 'data': answers}
            else:
                datos={'message': 'Not found...'}
            return JsonResponse(datos)
        elif jd['id_dili'] != "" and jd['id_question'] != "":
            answers = list(Answer.objects.filter(diligence=jd['id_dili'], question=jd['id_question']).values())
            if len(answers) > 0:
                datos={'message': 'Success', 'data': answers}
            else:
                datos={'message': 'Not found...'}
            return JsonResponse(datos)
        else:
            datos={'message': 'Not found...'}
            return JsonResponse(datos)
    
    def post(self, request):
        jd = json.loads(request.body)
        questions = list(jd['questions'])
        
        for question in questions:
            self.put(question['id_question'], question['id_dili'], question['answer'], question['answer_type'])
            
        datos={'message': 'Success'}
        return JsonResponse(datos)
            
    def put(self, question, diligence, answer, answer_type):
        answers = list(Answer.objects.filter(diligence_id=diligence, question_id=question).values())
        if len(answers) > 0:
            ans = Answer.objects.get(diligence_id=diligence, question_id=question)
            ans.answer=answer
            ans.answer_type=answer_type
            ans.save()
            datos={'message': 'Success'}
        else: 
            datos={'message': 'Not found...'}
        return JsonResponse(datos)
        
    def delete(self, request, id):
        answers = list(Answer.objects.filter(id=id).values())
        if len(answers) > 0:
            ans = Answer.objects.get(id=id)
            ans.answer=""
            ans.answer_type=""
            ans.save()
            datos={'message': 'Success'}
        else: 
            datos={'message': 'Not found...'}
        return JsonResponse(datos)
            


#========================================
class MappingView(View):
                
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request):
        jd = json.loads(request.body)
        mappings = list(Mapping.objects.filter(num_map=jd['num_map'], num_q=Answer.objects.filter(diligence=jd['id_dili'])).values())
        if len(mappings) > 0:
            mapping = mappings[0]
            datos={'message': 'Success', 'mapping': mapping}
        else:
            datos={'message': 'Not found...'}
        return JsonResponse(datos)
    