from django.db import models
import uuid
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class Grid(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    size = models.PositiveSmallIntegerField()
    status = models.CharField(max_length=1, default="P", choices=[
        ("W", "Win"),
        ("L", "Loss"),
        ("P", "In Progress")
    ])

class Cell(models.Model):
    grid = models.ForeignKey(Grid, on_delete=models.CASCADE)
    row = models.PositiveSmallIntegerField()
    column = models.PositiveSmallIntegerField()
    value = models.IntegerField(
        default=0,
        validators=[MaxValueValidator(8), MinValueValidator(0)]
    )
    isMine = models.BooleanField()
    isRevealed = models.BooleanField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['grid', 'row', 'column'], name='unique_grid_cell')
        ]
