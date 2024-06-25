from django.db import models
import uuid
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class Grid(models.Model):
    id = models.CharField(primary_key=True, max_length=36, unique=True, editable=False)
    size = models.PositiveSmallIntegerField()
    total_mines = models.PositiveSmallIntegerField(default=10)
    status = models.CharField(max_length=1, default="P", choices=[
        ("W", "Win"),
        ("L", "Loss"),
        ("P", "In Progress")
    ])

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = str(uuid.uuid4())  # Assign a UUID if id is not set
        super().save(*args, **kwargs)

class Cell(models.Model):
    grid = models.ForeignKey(Grid, on_delete=models.CASCADE)
    row = models.PositiveSmallIntegerField()
    column = models.PositiveSmallIntegerField()
    value = models.IntegerField(
        default=0,
        validators=[MaxValueValidator(8), MinValueValidator(0)]
    )
    is_mine = models.BooleanField()
    is_revealed = models.BooleanField()
    is_flagged = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['grid', 'row', 'column'], name='unique_grid_cell')
        ]
