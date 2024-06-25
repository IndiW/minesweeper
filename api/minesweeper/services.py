from django.shortcuts import get_object_or_404
from minesweeper.models import Grid, Cell
import random
from django.http import HttpResponseBadRequest
from typing import List, Dict, Union
from datetime import datetime
from django.utils.timezone import now


type GridData = Dict[str, Union[str, int]]
type CellData = List[Dict[str, Union[str, int, bool]]]
type GameData = Dict[str, Union[GridData, CellData]]

SECRET_KEY = 'scrtindi'

def get_grids():
    grid_list = Grid.objects.all()
    data = list(grid_list.values('id', 'size', 'status', 'total_mines'))
    return { 'data': data }

class GameManager:
    def __init__(self, game_id: str):
        self.game_id = game_id
        self.game = get_object_or_404(Grid, id=game_id)
    
    def get_game(self):
        cells = Cell.objects.filter(grid=self.game_id)

        grid_data = { "id": self.game.id, "size": self.game.size, "status": self.game.status, "total_mines": self.game.total_mines }
        cells_data = []
        for cell in cells:
            if cell.is_revealed:
                cells_data.append({ "row": cell.row, "column": cell.column, "is_revealed": cell.is_revealed, "is_mine": cell.is_mine, "id": str(cell.grid.id), "value": cell.value  })
            else:
                cells_data.append({ "row": cell.row, "column": cell.column, "is_flagged": cell.is_flagged })

        return {"data":{"grid": grid_data,"cells":cells_data}}

    def delete_game(self):
        self.game.delete()
    
    def lose_game(self):
        if self.game.status != 'P': return
        cells = Cell.objects.filter(grid=self.game_id)
        for cell in cells:
            if cell.is_mine:
                cell.is_revealed = True
                cell.save()
        self.game.status = 'L'
        self.game.save()


    def set_flag(self, row: int, column: int):
        c = Cell.objects.get(grid=self.game_id, row=row, column=column)
        c.is_flagged = not(c.is_flagged)
        c.save()
    
    def reveal_cell(self, row: int, column: int)->GameData:
        cell = get_object_or_404(Cell, grid=self.game, row=row, column=column)

        cell.is_revealed = True
        cell.save()
        if cell.is_mine:
            self.lose_game()
            return
        
        self.reveal_and_validate_cells(row, column) 
    
    def reveal_and_validate_cells(self, row: int, column: int)->None:
        size = self.game.size

        game_map = [[None] * size for _ in range(size)]
        cells = Cell.objects.filter(grid=self.game)

        for cell in cells:
            game_map[cell.row][cell.column] = { 'value': cell.value, 'is_mine': cell.is_mine, 'is_revealed': cell.is_revealed }
        
        updated_cells = []
        # Reveal all connected cells
        def bfs(row, col):
            for offset in [(0,1),(1,0),(1,1),(-1,1),(-1,-1),(1,-1),(-1,0),(0,-1)]:
                offset_x = row+offset[0]
                offset_y = col+offset[1]
                if 0 <= offset_x < size and 0 <= offset_y < size and not(game_map[offset_x][offset_y]['is_revealed']):

                    cell = game_map[offset_x][offset_y]
                    if cell['is_mine']:
                        return

                    # Track updated cells
                    updated_cells.append({ 'row': offset_x, 'col': offset_y, 'value': cell['value'], 'is_mine': cell['is_mine'], 'is_revealed': True})

                    game_map[offset_x][offset_y]['is_revealed'] = True
                    if cell['value'] == 0:
                        bfs(offset_x, offset_y)
            return
                
        
        bfs(row, column)

        # Reveal updated cells. 
        for updated_cell in updated_cells:
                c = Cell.objects.get(grid=self.game_id, row=updated_cell['row'], column=updated_cell['col'])
                c.is_revealed = updated_cell['is_revealed']
                c.save()
        

        revealed_count = 0
        for row in range(len(game_map)):
            for col in range(len(game_map[0])):
                if game_map[row][col]['is_mine'] and game_map[row][col]['is_revealed']:
                    self.game.status = "L"
                    self.game.save()
                    return
                elif game_map[row][col]['is_revealed']:
                    revealed_count += 1
        
        if revealed_count == (self.game.size**2 - self.game.total_mines):
            self.game.status = "W"
            self.game.save()


class GameGenerator:
    def __init__(self,size:int=8,total_mines:int=10,is_daily:bool=False):
        if total_mines >= size*size:
            raise HttpResponseBadRequest('Invalid game settings')
        if is_daily:
            today_date_id = now().strftime('daily-%Y-%m-%d')
            new_grid = Grid.objects.create(id=today_date_id,size=size)
            print('created daily game')
        else:
            new_grid = Grid.objects.create(size=size)
            print('created normal game')
        new_grid.save()
        self.is_daily = is_daily
        self.grid_size = size
        self.total_mines = total_mines
        self.grid = new_grid
        self.game_map = [[0] * size for _ in range(size)]
    
    def get_random_mine_coordinates(self):
        coordinates = set()
        while len(coordinates) < self.total_mines:
            new_pair = (random.randint(0, self.grid_size-1), random.randint(0, self.grid_size-1))
            coordinates.add(new_pair)
        return list(coordinates)

    def generate_daily_mine_coordinates(self):
        date = datetime.now().date()
        # Convert date to string and use it as the seed
        seed = date.strftime('%Y-%m-%d') + SECRET_KEY
        random.seed(seed)

        coordinates = set()

        while len(coordinates) < self.total_mines:
            new_pair = (random.randint(0, self.grid_size-1), random.randint(0, self.grid_size-1))
            coordinates.add(new_pair)
        return list(coordinates)

    def add_hints_to_game_grid(self, mine_locations):
        for x,y in mine_locations:
            for offset in [(0,0), (0,1),(1,0),(-1,0),(0,-1),(1,1),(-1,1),(1,-1),(-1,-1)]:
                    offset_x = x+offset[0]
                    offset_y = y+offset[1]
                    if 0 <= offset_x < self.grid_size and 0 <= offset_y < self.grid_size:
                        self.game_map[offset_x][offset_y] += 1
    
    def create_cell_records(self, mine_locations):
        for row in range(self.grid_size):
            for col in range(self.grid_size):
                is_mine = (row,col) in mine_locations
                c = Cell.objects.create(grid=self.grid, row=row, column=col, value=self.game_map[row][col], is_mine=is_mine, is_revealed=False)
                c.save()
    
    def generate_game(self)->str:
        if self.is_daily:
            coordinates = self.generate_daily_mine_coordinates()
        else:
            coordinates = self.get_random_mine_coordinates()
        
        self.add_hints_to_game_grid(coordinates)
        self.create_cell_records(coordinates)

        return str(self.grid.id)        



