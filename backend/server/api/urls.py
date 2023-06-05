from django.urls import path
from .views import QuestionView, UserView, DiligenceView, AnswerView, LoginView, LogoutView, ProfileView, RegisterUserView, DocumentView, MappingView, DashboardView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('register/', RegisterUserView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('questions/', QuestionView.as_view(), name='questions'),
    path('questions/<int:numQ>/', QuestionView.as_view(), name='questions_process'),
    path('users/', UserView.as_view(), name='users'),
    path('users/<int:id>', UserView.as_view(), name='users_process'),
    path('diligences/', DiligenceView.as_view(), name='diligences'),
    path('diligences/<int:id>', DiligenceView.as_view(), name='diligences_process'),
    path('answers/<int:id_dili>/<int:doc_id>', AnswerView.as_view(), name='answers'),
    path('answers/', AnswerView.as_view(), name='answers_process'),
    path('documents/', DocumentView.as_view(), name='documents'),
    path('documents/<int:id_dili>/<int:id_doc>/', DocumentView.as_view(), name='documents_process'),
    path('mapping/<int:id_dili>/', MappingView.as_view()),
    path('dashboard/<int:id_dili>/', DashboardView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)