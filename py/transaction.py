from datetime import datetime, timedelta
from collections import defaultdict
import random
import flet as ft

# Словарь для перевода названий месяцев на русский
RUS_MONTHS = {
    1: "января", 2: "февраля", 3: "марта", 4: "апреля",
    5: "мая", 6: "июня", 7: "июля", 8: "августа",
    9: "сентября", 10: "октября", 11: "ноября", 12: "декабря"
}

class TransactionManager:
    def __init__(self):
        self.categories = ["Мясо", "Напитки", "Сладкое", "Фрукты", "Овощи", "Молочные продукты",
                          "Хлеб", "Бакалея", "Бытовая химия", "Алкоголь", "Косметика", "Другое"]
        self.stores = ["Ашан", "Пятерочка", "Магнит", "Перекресток", "Лента", "Метро"]
        self.colors = [ft.colors.BLUE, ft.colors.YELLOW, ft.colors.PINK, ft.colors.GREEN,
                      ft.colors.RED, ft.colors.PURPLE, ft.colors.ORANGE, ft.colors.TEAL,
                      ft.colors.INDIGO, ft.colors.CYAN, ft.colors.AMBER, ft.colors.LIME]
        self.category_colors = {cat: color for cat, color in zip(self.categories, self.colors)}
        self.transactions = []
        self.generate_initial_data()

    def random_datetime(self):
        now = datetime.now()
        random_days = random.randint(0, 30)
        random_hours = random.randint(0, 23)
        random_minutes = random.randint(0, 59)
        return now - timedelta(days=random_days, hours=random_hours, minutes=random_minutes)

    def format_date_russian(self, dt):
        return f"{dt.day} {RUS_MONTHS[dt.month]}"

    def generate_initial_data(self):
        for _ in range(30):
            dt = self.random_datetime()
            category = random.choice(self.categories)
            quantity = random.randint(1, 10)
            price = round(random.uniform(50, 500), 2)
            self.transactions.append({
                "date": dt,
                "formatted_date": self.format_date_russian(dt),
                "time": dt.strftime("%H:%M"),
                "store": random.choice(self.stores),
                "category": category,
                "quantity": quantity,
                "price": price,
                "total": round(quantity * price, 2),
                "color": self.category_colors[category]
            })

    def calculate_chart_data(self):
        category_totals = defaultdict(float)
        for trans in self.transactions:
            category_totals[trans["category"]] += trans["total"]

        total = sum(category_totals.values())
        if total == 0:
            return [], []

        percentages = [int((amount / total) * 100) for amount in category_totals.values()]
        return list(category_totals.items()), percentages

    def get_sorted_transactions(self):
        return sorted(self.transactions, key=lambda x: x["date"], reverse=True)

class ChartView:
    def __init__(self, transaction_manager):
        self.transaction_manager = transaction_manager

    def create(self):
        category_amounts, percentages = self.transaction_manager.calculate_chart_data()

        # Создаем элементы категорий с фиксированной шириной
        category_items = [
            ft.Container(
                content=ft.Row(
                    controls=[
                        ft.Container(
                            width=20,
                            height=20,
                            bgcolor=self.transaction_manager.category_colors[cat],
                            border_radius=5,
                        ),
                        ft.Text(cat, size=16, weight="bold", width=150),  # Фиксированная ширина
                        ft.Container(
                            content=ft.Text(f"{amount:.2f} ₽", size=16),
                            width=100,  # Фиксированная ширина для суммы
                            alignment=ft.alignment.center_right
                        ),
                    ],
                    spacing=10,
                    vertical_alignment=ft.CrossAxisAlignment.CENTER,
                ),
                padding=ft.padding.symmetric(vertical=8, horizontal=15),
                border=ft.border.all(1, ft.colors.GREY_300),
                bgcolor=ft.colors.WHITE if i % 2 == 0 else ft.colors.GREY_100,  # Чередующийся фон
            )
            for i, (cat, amount) in enumerate(category_amounts)
        ]

        # Контейнер с фоном для списка категорий
        categories_container = ft.Container(
            content=ft.Column(
                controls=category_items,
                spacing=0,  # Убираем промежутки между элементами
            ),
            border_radius=10,
            border=ft.border.all(1, ft.colors.GREY_300),
            bgcolor=ft.colors.GREY_50,
            padding=ft.padding.only(top=10, bottom=10),
            width=400,  # Фиксированная ширина контейнера
        )

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

        return ft.Column(
            controls=[
                pie_chart,
                ft.Text("Категории расходов:", size=18, weight="bold"),
                categories_container,  # Используем контейнер с фоном вместо ListView
            ],
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            padding=0,
            spacing=20,
        )
