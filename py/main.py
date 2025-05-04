import flet as ft
from transaction import TransactionManager
from header import Header
from diagrama import ChartView
from history import HistoryView
from navbar import NavBar
from camera import CameraView


def main(page: ft.Page):
    # Инициализация менеджера транзакций
    transaction_manager = TransactionManager()

    # Инициализация компонентов
    header = Header(page)
    chart_view = ChartView(transaction_manager, page)  # Добавляем page в параметры
    history_view = HistoryView(transaction_manager)
    navbar = NavBar(page)

    # Настройка страницы
    page.title = "Главный экран"
    page.vertical_alignment = ft.MainAxisAlignment.SPACE_BETWEEN
    page.theme_mode = ft.ThemeMode.LIGHT

    def create_main_page():
        return ft.Column(
            controls=[
                # Заголовок с центрированным текстом и иконкой темы
                ft.Container(
                    content=ft.Stack(
                        controls=[
                            # Центрированный текст
                            ft.Container(
                                content=ft.Text("Мои расходы", size=20, weight="bold"),
                                alignment=ft.alignment.center,
                                expand=True,
                            ),
                            # Иконка темы в правом углу
                            ft.Container(
                                content=header.theme_icon,
                                alignment=ft.alignment.center_right,
                            ),
                        ],
                    ),
                    padding=ft.padding.symmetric(horizontal=20, vertical=10),
                    height=50,
                ),
                chart_view.create(),
            ],
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            spacing=20,
        )

    def create_history_page():
        return ft.Column(
            controls=[
                header.create("История покупок", middle_left=True),
                history_view.create(),
            ],
            spacing=0,
            expand=True,
        )

    def route_change(e):
        page.views.clear()

        if page.route == "/":
            page.views.append(
                ft.View(
                    "/",
                    [
                        ft.Container(
                            content=create_main_page(),
                            alignment=ft.alignment.center,
                            expand=True,
                        ),
                        navbar.create()
                    ],
                    padding=0,
                    spacing=0,
                )
            )

        elif page.route == "/camera":
            page.views.append(
                ft.View(
                    "/camera",
                    [
                        ft.Container(
                            content=CameraView(page).create(),
                            expand=True,
                        ),
                        navbar.create()
                    ],
                    padding=10,
                    spacing=0,
                )
            )

        elif page.route == "/history":
            page.views.append(
                ft.View(
                    "/history",
                    [
                        ft.Container(
                            content=create_history_page(),
                            expand=True,
                        ),
                        navbar.create()
                    ],
                    padding=10,
                    spacing=0,
                )
            )

        page.update()

    page.on_route_change = route_change
    page.go("/")  # Устанавливаем начальный маршрут


ft.app(main)