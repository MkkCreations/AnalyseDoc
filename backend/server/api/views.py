from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import Question, Diligence, Answer, Mapping, Document
from django.contrib.auth.models import User
import json
from datetime import datetime
from django.contrib.auth import login, logout
from rest_framework import generics, permissions, status, views, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from . import serializers
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse
import os
from TextractQueries.find_queries_kv import main

# Create your views here.


class LoginView(views.APIView):
    
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = serializers.LoginSerializer(data=self.request.data, context={ 'request': self.request })
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        login(request, user)
        return Response(serializers.UserSerializer(user).data, status=status.HTTP_202_ACCEPTED)


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
    

class ProfileView(generics.RetrieveAPIView):
    
    permission_classes = (permissions.IsAuthenticated,) #permissions.IsAuthenticated

    def get(self, request):
        print(request.user)
        serializer = serializers.UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)



#========================================
class QuestionView(View):
    
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request, numQ=0):
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
        Question.objects.create(num_q=jd['num_q'], question=jd['question'], type=jd['type'], parent=jd['parent'], alias=jd['alias'])
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
    
    def get(self, request, id=0):
        jd = json.loads(request.body)
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
    
    def put(self, request):
        jd = json.loads(request.body)
        users = list(User.objects.filter(id=jd['id']).values())
        if len(users) > 0:
            user = User.objects.get(id=jd['id'])
            user.firs_name=jd['first_name']
            user.last_name=jd['last_name']
            user.email=jd['email']
            user.username=jd['username']
            user.last_login=str(datetime.now())
            user.save()
            userData = {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'last_login': user.last_login
            }
            datos={'message': 'Success', 'user': userData}
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
        user = User.objects.get(id=jd['user_id'])
        newDili = list(Diligence.objects.filter(dili_name=jd['dili_name']).values())[0]
        questions = list(Question.objects.all().values())
        for question in questions:
            quest = Question.objects.get(id=question['id'])
            Answer.objects.create(question=quest, diligence_id=newDili['id'], user_id=user.id)
        datos={'message': 'Success', 'diligence': newDili}
        return JsonResponse(datos)
    
    
    
    def put(self, request):
        jd = json.loads(request.body)
        diligences = list(Diligence.objects.filter(id=jd['id']).values())
        if len(diligences) > 0:
            diligence = Diligence.objects.get(id=jd['id'])
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
            os.remove('media/{path}'.format(path=id))
            datos={'message': 'Success'}
        else:
            datos={'message': 'Not found...'}
        return JsonResponse(datos)

#========================================
class AnswerView(View):
            
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request, id_dili=None, doc_id=0):
        if id_dili != "" and doc_id == 0:
            answers = Diligence.get_questions_answers(self=Diligence ,dili=id_dili)
            if len(answers) > 0:
                datos={'message': 'Success', 'data': answers}
            else:
                datos={'message': 'Not found...'}
            return JsonResponse(datos)
        elif id_dili != "" and doc_id != "":
            answers = Diligence.get_questions_answers(self=Diligence ,dili=id_dili, doc_id=doc_id)
            if len(answers) > 0:
                answer = answers
                datos={'message': 'Success', 'data': answer}
                return JsonResponse(datos)
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
            
    def put(self, request):
        jd = json.loads(request.body)
        answers = list(Answer.objects.filter(diligence_id=jd['id_dili'], question_id=jd['id_q']).values())
        if len(answers) > 0:
            ans = Answer.objects.get(diligence_id=jd['id_dili'], question_id=jd['id_q'])
            ans.answer=jd['answer']
            ans.answer_type=jd['answer_type']
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
class DocumentView(views.APIView):
    
    parser_class = (MultiPartParser, FormParser,)
    permission_classes = (AllowAny,)

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    
    def get(self, request, id_dili=0, id_doc=0):
        if id_dili > 0 and id_doc == 0:
            documents = list(Document.objects.filter(diligence=id_dili).values())
            if len(documents) > 0:
                document = documents
                serializer = serializers.DocumentSerializer2(document, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Not found...'}, status=status.HTTP_204_NO_CONTENT)
        elif id_dili > 0 and id_doc > 0:
            documents = list(Document.objects.filter(id=id_doc).values())
            if len(documents) > 0:
                document = documents[0]
                path = document['document']
                with open('media/{path}'.format(path=path), 'rb') as pdf:
                    response = HttpResponse(pdf.read(), content_type='application/pdf')
                    response['Content-Disposition'] = 'attachment;filename={path}'.format(path=path)
                    return response
            else:
                return Response({'message': 'Not found...'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'Not found...'}, status=status.HTTP_400_BAD_REQUEST)
    

    def post(self, request, *args, **kwargs):
        post_serializer = serializers.DocumentSerializer(data=request.data)
        if post_serializer.is_valid():
            post_serializer.save()
            path = post_serializer.data.get('document')
            doc_type = post_serializer.data.get('docType')
            diligence_id = post_serializer.data.get('diligence')
            
            res_ai = main(path, doc_type, diligence_id)
            print(res_ai)
            Answer.ai_response_parser(ai_res=res_ai, diligence_id=diligence_id)
            return JsonResponse('Success', status=status.HTTP_201_CREATED, safe=False)
        return JsonResponse('Failed', status=status.HTTP_400_BAD_REQUEST, safe=False)
    
    
    def put(self, request):
        jd = json.loads(request.body)
        print(jd)
        documents = list(Document.objects.filter(id=jd['id']).values())
        if len(documents) > 0:
            document = Document.objects.get(id=jd['id'])
            document.name=jd['name']
            document.docType=jd['docType']
            try:
                print(request.FILES['document'])
                document.document=request.FILES['document']
            except:
                pass
            document.save()
            datos={'message': 'Success'}
        else: 
            datos={'message': 'Not found...'}
        return JsonResponse(datos) 
    
    def delete(self, request, id_dili, id_doc):
        documents = list(Document.objects.filter(id=id_doc).values())
        if len(documents) > 0:
            Document.objects.filter(id=id_doc).delete()
            os.remove('TextractQueries/media/{path}'.format(path=documents[0]['document']))
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
    