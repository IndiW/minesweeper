from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.shortcuts import get_object_or_404

from .models import Grid, Cell
from .services import get_grids, create_grid, get_grid

from django.views.decorators.csrf import csrf_exempt
# Create your views here.

# TODO Add CSRF Support
@csrf_exempt
def index(request):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'

    # if not is_ajax:
    #     return HttpResponseBadRequest('Invalid Request')

    if request.method == 'POST':
        new_grid = create_grid(8)
        return JsonResponse({"grid_id": new_grid})

    elif request.method == 'GET':
        grids = get_grids()
        return JsonResponse(grids)

    return HttpResponseBadRequest('Invalid Request')


@csrf_exempt
def grid(request, grid_id):
    if request.method == 'PUT':
        # handle updating game
        return HttpResponseBadRequest('Unsupported operation')
    elif request.method == 'GET':
        grid = get_grid(grid_id)
        return JsonResponse(grid)

    return HttpResponseBadRequest('Invalid Request')
