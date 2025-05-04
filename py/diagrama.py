import flet as ft
from transaction import TransactionManager


class ChartView:
    def __init__(self, transaction_manager, page):
        self.transaction_manager = transaction_manager
        self.page = page

    def create(self):
        category_amounts, percentages = self.transaction_manager.calculate_chart_data()

        # Создаем элементы категорий
        category_items = [
            ft.Container(
                content=ft.Row(
                    controls=[
                        # Цвет категории
                        ft.Container(
                            width=20,
                            height=20,
                            bgcolor=self.transaction_manager.category_colors[cat],
                            border_radius=5,
                        ),
                        # Название категории
                        ft.Text(cat, size=16, weight="bold", width=180),
                        # Цена (выровнена по правому краю)
                        ft.Container(
                            content=ft.Text(f"{amount:.2f} ₽", size=16),
                            width=100,
                            alignment=ft.alignment.center_right,
                        ),
                    ],
                    spacing=10,
                    vertical_alignment=ft.CrossAxisAlignment.CENTER,
                ),
                padding=10,
            )
            for cat, amount in category_amounts
        ]

        # Диаграмма
        pie_chart = ft.PieChart(
            sections=[
                ft.PieChartSection(
                    percentages[i],
                    title=f"{percentages[i]}%",
                    color=self.transaction_manager.category_colors[cat],
                    radius=80,
                    title_style=ft.TextStyle(size=12, color=ft.colors.WHITE),
                )
                for i, (cat, _) in enumerate(category_amounts)
            ] if category_amounts else [],
            sections_space=0,
            center_space_radius=60,
            height=250,
            width=250,
        )

        # Вычисляем доступную высоту для списка
        available_height = self.page.height - 450  # 450px - примерная высота остальных элементов

        # Контейнер списка с прокруткой
        list_container = ft.ListView(
            controls=category_items,
            spacing=5,
            height=available_height if available_height > 200 else 200,  # Минимум 200px
            padding=0,
        )

        # Скрываем полосу прокрутки через стиль
        list_container.scrollbar_theme = ft.ScrollbarTheme(
            track_visibility=False,
            thumb_visibility=False,
            track_color=ft.colors.TRANSPARENT,
            thumb_color=ft.colors.TRANSPARENT,
        )

        return ft.Column(
            controls=[
                # Диаграмма по центру
                pie_chart,

                # Центрированный заголовок
                ft.Container(
                    content=ft.Text("Категории расходов:", size=18, weight="bold"),
                    alignment=ft.alignment.center,
                    padding=ft.padding.only(top=20, bottom=10),
                ),

                # Растянутый список с прокруткой
                ft.Container(
                    content=list_container,
                    width=350,
                    alignment=ft.alignment.center,
                    margin=ft.margin.only(bottom=10),  # Отступ от нижней панели
                ),
            ],
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            spacing=0,
            expand=True,  # Растягиваем колонку на всю доступную высоту
        )