from rest_framework import pagination

class SearchPagination(pagination.PageNumberPagination):
    page_size = 2
    default_limit = 2
    page_size_query_param = 'p_size'
    page_query_param = 'p'
    max_page_size = 2