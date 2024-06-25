import pytest
from django.test import TestCase
from minesweeper.models import Grid
from minesweeper.views import get_grids

@pytest.mark.django_db
def test_get_grids():
    grid1 = Grid.objects.create(size=10, status='active', total_mines=20)
    grid2 = Grid.objects.create(size=15, status='completed', total_mines=25)

    result = get_grids()

    expected_data = {
        'data': [
            {'id': grid1.id, 'size': grid1.size, 'status': grid1.status, 'total_mines': grid1.total_mines},
            {'id': grid2.id, 'size': grid2.size, 'status': grid2.status, 'total_mines': grid2.total_mines}
        ]
    }

    assert result == expected_data