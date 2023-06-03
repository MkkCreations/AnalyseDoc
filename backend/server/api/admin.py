from django.contrib import admin
from .models import Question, Document, Diligence, Answer

# Register your models here.

admin.site.register(Question)
admin.site.register(Document)
admin.site.register(Diligence)
admin.site.register(Answer)


