from django.contrib import admin
from .models import Question, Document, User, Diligence, Answer

# Register your models here.

admin.site.register(Question)
admin.site.register(Document)
admin.site.register(User)
admin.site.register(Diligence)
admin.site.register(Answer)


