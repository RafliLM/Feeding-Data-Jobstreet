from .serializers import JobsSerializers
from .models import Jobs
from .pagination import JobsResultPagination
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import status
from rest_framework.decorators import api_view
from drf_excel.mixins import XLSXFileMixin
from drf_excel.renderers import XLSXRenderer
from requests import get
from bs4 import BeautifulSoup
from json import loads
from dateutil.parser import parse
from time import time


# Create your views here.
class ListCreateJobsView(ListCreateAPIView):
    serializer_class = JobsSerializers
    pagination_class = JobsResultPagination

    def get_queryset(self):
        queryset = Jobs.objects.all()
        keyword = self.request.query_params.get('keyword')
        if keyword is not None and keyword != "":
            queryset = queryset.filter(keyword=keyword)
        return queryset

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        return Response(status=status.HTTP_201_CREATED, data="Successfully created job data!")

class RetrieveUpdateDestroyJobsView(RetrieveUpdateDestroyAPIView):
    serializer_class = JobsSerializers
    queryset=Jobs.objects.all()

    def delete(self, request, *args, **kwargs):
        super().delete(request, *args, **kwargs)
        return Response(status=status.HTTP_204_NO_CONTENT, data="Successfully deleted job data!")
    
    def update(self, request, *args, **kwargs):
        super().update(request, *args, **kwargs)
        return Response(status=status.HTTP_200_OK, data="Successfully updated job data!")
    
@api_view(['GET'])
def ScrapeJobs(request, keyword):
    if request.method == 'GET':
        r = get(f"https://id.jobstreet.com/id/{ keyword.lower().replace(' ', '-') }-jobs")
        soup = BeautifulSoup(r.content, 'html.parser')
        jobs = soup.select('[data-automation=server-state]')[0].get_text().split("\n")[2]
        jobs = loads(jobs[jobs.index('{'):-1])['results']['results']['jobs']
        jobs = [
            Jobs(
                id= job['id'],
                title= job['title'],
                teaser= job.get('teaser', ""),
                companyName= job.get('companyName', ""),
                location= job.get('location', ""),
                workType= job.get('workType', ""),
                role= job.get('roleId', ""),
                salary= job.get('salary', ""),
                keyword= keyword,
                listingDate= parse(job['listingDate']),
                bulletPoints= job['bulletPoints']
            )
            for job in jobs]
        before = Jobs.objects.count()
        jobs = Jobs.objects.bulk_create(objs=jobs, ignore_conflicts=True)
        after = Jobs.objects.count()
        return Response(status=status.HTTP_200_OK, data=f"Successfully scraped {after - before} jobs data with {keyword} keyword!")
    
class GenerateExcelView(XLSXFileMixin, ReadOnlyModelViewSet):
    queryset = Jobs.objects.all()
    pagination_class = None
    serializer_class = JobsSerializers
    renderer_classes = (XLSXRenderer,)
    filename = f"job-report-{int(time())}.xlsx"
    column_header = {
        'titles' : [
            "id",
            "Title",
            "Teaser",
            "Company Name",
            "Location",
            "Work Type",
            "Role",
            "Salary",
            "keyword",
            "Bullet Points",
            "Listing Date"
        ]
    }

    def finalize_response(self, request, response, *args, **kwargs):
        res = super().finalize_response(request, response, *args, **kwargs)
        res['Content-Type'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        res['Content-Disposition'] = f"attachment; filename={self.filename}"
        res['Access-Control-Expose-Headers'] = 'Content-Disposition'
        return res
    