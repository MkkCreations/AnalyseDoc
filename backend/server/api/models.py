from django.db import models

# Create your models here.

class Question(models.Model):
    num_q = models.CharField(max_length=32)
    question = models.CharField(max_length=200)
    type = models.CharField(max_length=32)
    parent = models.CharField(max_length=32, null=True)
    
class User(models.Model):
    email = models.CharField(max_length=32)
    name = models.CharField(max_length=32)
    username = models.CharField(max_length=32)
    password = models.CharField(max_length=32)
    last_login = models.DateTimeField(auto_now=True)
    
class Diligence(models.Model):
    dili_name = models.CharField(max_length=32)
    date = models.DateTimeField(auto_now=True)
    
class Answer(models.Model):
    ai_res = models.CharField(max_length=500)
    answer = models.CharField(max_length=200)
    answer_type = models.CharField(max_length=32)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    diligence = models.ForeignKey(Diligence, on_delete=models.CASCADE)
    
class Mapping(models.Model):
    num_map = models.CharField(max_length=32, primary_key=True)
    num_q = models.ForeignKey(Question, on_delete=models.CASCADE)
    
