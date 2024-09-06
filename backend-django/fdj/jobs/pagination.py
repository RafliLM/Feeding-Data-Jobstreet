from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class JobsResultPagination(PageNumberPagination):
    page_query_param = "page"
    page_size_query_param = "size"

    def get_paginated_response(self, data):
        super().get_paginated_response(data)
        return Response({
            "totalData" : self.page.paginator.count,
            "jobs" : data
        })