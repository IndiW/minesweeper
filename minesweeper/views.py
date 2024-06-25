import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.shortcuts import get_object_or_404

from .models import Grid
from .services import get_grids, GameGenerator, GameManager

from django.views.decorators.csrf import csrf_exempt

# TODO Add CSRF Support
# TODO add validation
@csrf_exempt
def games(request):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'

    if not is_ajax:
        return HttpResponseBadRequest('Invalid Request')

    if request.method == 'POST':
        data = json.loads(request.body)
        if 'daily' in data and data['daily']:
            game_generator = GameGenerator(is_daily=data['daily'])
            game_id = game_generator.generate_game()
            return JsonResponse({"grid_id": game_id})
        
        if 'grid_size' in data:
            game_generator = GameGenerator()
            game_id = game_generator.generate_game()
            return JsonResponse({"grid_id": game_id})

        game_generator = GameGenerator()
        game_id = game_generator.generate_game()
        return JsonResponse({"grid_id": game_id})

    elif request.method == 'GET':
        grids = get_grids()
        return JsonResponse(grids)

    return HttpResponseBadRequest('Invalid Request')

@csrf_exempt
def get_game(request, grid_id):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    if not is_ajax:
        return HttpResponseBadRequest('Invalid Request')

    game_manager = GameManager(game_id=grid_id)
    if request.method == 'GET':
        grid = game_manager.get_game()
        return JsonResponse(grid)
    elif request.method == 'DELETE':
        game_manager.delete_game()
        return JsonResponse({'message': 'Game deleted successfully'}, status=204)
    
    return HttpResponseBadRequest('Unsupported Operation')

@csrf_exempt
def lose_game(request, grid_id):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    if not is_ajax:
        return HttpResponseBadRequest('Invalid Request')
    
    if request.method == 'POST':
        game_manager = GameManager(game_id=grid_id)
        game_manager.lose_game()
        grid = game_manager.get_game()
        return JsonResponse(grid)
    return HttpResponseBadRequest('Unsupported Operation')    

@csrf_exempt
def set_flag(request, grid_id):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    if not is_ajax:
        return HttpResponseBadRequest('Invalid Request')
    
    if request.method == 'POST':
        data = json.loads(request.body)
        game_manager = GameManager(game_id=grid_id)
        game_manager.set_flag(row=data['row'], column=data['column'])
        grid = game_manager.get_game()
        return JsonResponse(grid)
    return HttpResponseBadRequest('Unsupported Operation')



@csrf_exempt
def reveal_cell(request, grid_id):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    if not is_ajax:
        return HttpResponseBadRequest('Invalid Request')
    
    if request.method == 'POST':
        data = json.loads(request.body)
        game_manager = GameManager(game_id=grid_id)
        game_manager.reveal_cell(row=data['row'], column=data['column'])
        grid = game_manager.get_game()
        return JsonResponse(grid)
    return HttpResponseBadRequest('Unsupported Operation')