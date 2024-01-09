from rest_framework import pagination

class SearchPagination(pagination.PageNumberPagination):
    page_size = 9
    max_page_size = 2