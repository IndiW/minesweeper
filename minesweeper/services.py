from django.shortcuts import get_object_or_404
from minesweeper.models import Grid, Cell
import random
from django.http import HttpResponseBadRequest
from typing import List, Dict, Union
from django.forms.models import model_to_dict


type GridData = Dict[str, Union[str, int]]
type CellData = List[Dict[str, Union[str, int, bool]]]
type GameData = Dict[str, Union[GridData, CellData]]

def get_grids():
    grid_list = Grid.objects.all()
    data = list(grid_list.values('id', 'size', 'status'))
    return { 'data': data }

def create_grid(size: int=8):
    new_grid = Grid.objects.create(size=size)
    new_grid.save()

    generate_cells(new_grid.id, size)
    return new_grid.id

def update_grid(grid_id: str, row: int, column: int)->GameData:
    # get cell
    grid = get_object_or_404(Grid, id=grid_id)
    cell = get_object_or_404(Cell, grid=grid, row=row, column=column)
    cell.isRevealed = True
    cell.save()
    if cell.isMine:
        grid.status = 'L'
        grid.save()
        return get_grid(grid_id)
    
    reveal_and_validate_cells(grid_id, row, column)

    return get_grid(grid_id)

def reveal_and_validate_cells(grid_id: str, row: int, column: int):
    grid = get_object_or_404(Grid, id=grid_id)
    size = grid.size

    game_map = [[None] * size for _ in range(size)]
    cells = Cell.objects.filter(grid=grid)

    for cell in cells:
        game_map[cell.row][cell.column] = { 'value': cell.value, 'isMine': cell.isMine, 'isRevealed': cell.isRevealed }
    
    updated_cells = []
    # Reveal all connected cells
    def bfs(row, col):
        for offset in [(0,1),(1,0),(1,1),(-1,1),(-1,-1),(1,-1),(-1,0),(0,-1)]:
            offset_x = row+offset[0]
            offset_y = col+offset[1]
            if 0 <= offset_x < size and 0 <= offset_y < size and not(game_map[offset_x][offset_y]['isRevealed']):

                cell = game_map[offset_x][offset_y]
                if cell['isMine']:
                    return

                # Track updated cells
                updated_cells.append({ 'row': offset_x, 'col': offset_y, 'value': cell['value'], 'isMine': cell['isMine'], 'isRevealed': True})

                game_map[offset_x][offset_y]['isRevealed'] = True
                if cell['value'] == 0:
                    bfs(offset_x, offset_y)
        return
            
    
    bfs(row, column)

    # TODO reevaluate performance
    # Reveal updated cells. 
    for updated_cell in updated_cells:
            c = Cell.objects.get(grid=grid_id, row=updated_cell['row'], column=updated_cell['col'])
            c.isRevealed = updated_cell['isRevealed']
            c.save()
    

    # Validate game
    mine_count = 0
    hidden_count = 0
    for row in range(len(game_map)):
        for col in range(row):
            if game_map[row][col]['isMine']:
                mine_count += 1
            if not game_map[row][col]['isRevealed']:
                hidden_count += 1
    
    if mine_count == hidden_count:
        grid.status = "W"
        grid.save()
    


def get_grid(grid_id: str)->GameData:
    grid = get_object_or_404(Grid, id=grid_id)
    cells = Cell.objects.filter(grid=grid_id)

    grid_data = { "id": grid.id, "size": grid.size, "status": grid.status }
    cells_data = []
    for cell in cells:
        if cell.isRevealed:
            cells_data.append({ "row": cell.row, "column": cell.column, "isRevealed": cell.isRevealed, "isMine": cell.isMine, "id": str(cell.grid.id), "value": cell.value  })
        else:
            cells_data.append({ "row": cell.row, "column": cell.column })

    return {"data": { "grid": grid_data, "cells": cells_data}}


def generate_cells(grid_id: str, size: int, totalMines: int=10)->None:
    grid = get_object_or_404(Grid, id=grid_id)
    if totalMines >= size*size:
        raise HttpResponseBadRequest('Invalid game settings')
    game_map = [[0] * size for _ in range(size)]
    print(game_map)


    # randomly place mines    
    def get_random_coordinates():
        x = random.randint(0,size-1)
        y = random.randint(0, size-1)
        return (x, y)

    random_coords = get_random_coordinates()
    mine_locations = set()
    for _ in range(totalMines):
        while random_coords in mine_locations:
            random_coords = get_random_coordinates()
        
        mine_locations.add(random_coords)


    # update hints around mines
    for x,y in mine_locations:
         for offset in [(0,0), (0,1),(1,0),(1,1),(-1,1),(-1,-1),(1,-1),(-1,0),(0,-1)]:
                offset_x = x+offset[0]
                offset_y = y+offset[1]
                if 0 <= offset_x < size and 0 <= offset_y < size:
                    game_map[offset_x][offset_y] += 1

    

    for row in range(size):
        for col in range(size):
            isMine = (row,col) in mine_locations
            c = Cell.objects.create(grid=grid, row=row, column=col, value=game_map[row][col], isMine=isMine, isRevealed=False)
            c.save()
        



