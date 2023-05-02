from django.urls import path
from .views import QuestionView, UserView, DiligenceView, AnswerView, LoginView, LogoutView, ProfileView, RegisterUserView

urlpatterns = [
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('register/', RegisterUserView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('questions/', QuestionView.as_view(), name='questions'),
    path('questions/<int:id>', QuestionView.as_view(), name='questions_process'),
    path('users/', UserView.as_view(), name='users'),
    path('users/<int:id>', UserView.as_view(), name='users_process'),
    path('diligences/', DiligenceView.as_view(), name='diligences'),
    path('diligences/<int:id>', DiligenceView.as_view(), name='diligences_process'),
    path('answers/', AnswerView.as_view(), name='answers'),
    path('answers/<int:id>', AnswerView.as_view(), name='answers_process'),
    
]