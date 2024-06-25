from django.urls import path

from . import views

urlpatterns = [
    path("api/v1/games", views.games, name="games"),
    path("api/v1/games/<str:grid_id>", views.get_game, name="get_game"),
    path("api/v1/games/<str:grid_id>/flag", views.set_flag, name="set_flag"),
    path("api/v1/games/<str:grid_id>/reveal", views.reveal_cell, name="reveal_cell"),
    path("api/v1/games/<str:grid_id>/lose", views.lose_game, name="lose_game"),
]