import json
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.shortcuts import get_object_or_404

from .models import Grid, Cell
from .services import get_grids, create_grid, get_grid, update_grid

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
        try:
            data = json.loads(request.body)  # Parse JSON request body
            updated_grid = update_grid(data['grid_id'], data['row'], data['column'])
            return JsonResponse(updated_grid)
        except json.JSONDecodeError:
            return HttpResponseBadRequest('Invalid JSON')
    elif request.method == 'GET':
        grid = get_grid(grid_id)
        return JsonResponse(grid)

    elif request.method == 'DELETE':
        obj = get_object_or_404(Grid, id=grid_id)
        obj.delete()
        return JsonResponse({'message': 'Grid deleted successfully'}, status=204)

    return HttpResponseBadRequest('Invalid Request')
