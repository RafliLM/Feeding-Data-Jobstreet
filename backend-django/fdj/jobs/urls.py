from django.urls import path
from .views import ListCreateJobsView, RetrieveUpdateDestroyJobsView, ScrapeJobs, GenerateExcelView

urlpatterns = [
    path('', ListCreateJobsView.as_view(), name='Get and Create Jobs'),
    path('<int:pk>/', RetrieveUpdateDestroyJobsView.as_view(), name="Get By Id, Update, and Delete Jobs"),
    path('scrape/<keyword>/', ScrapeJobs, name='Scrape Jobs based on the given keyword'),
    path('excel/', GenerateExcelView.as_view({'get': 'list'}), name='Generate an Excel Report which contains all Jobs data')
]