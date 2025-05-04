import flet as ft


class ManualInputDialog:
    def __init__(self, page: ft.Page, on_save_callback):
        self.page = page
        self.on_save_callback = on_save_callback
        self.dialog = ft.AlertDialog(
            title=ft.Text("Ручной ввод данных"),
            content=ft.Column(
                controls=[
                    ft.TextField(label="Дата (ДД.ММ.ГГГГ)", hint_text="01.01.2023"),
                    ft.TextField(label="Цена", hint_text="100.00", input_filter=ft.NumbersOnlyInputFilter()),
                    ft.TextField(label="Количество", hint_text="1", input_filter=ft.NumbersOnlyInputFilter()),
                    ft.TextField(label="Магазин", hint_text="Пятерочка"),
                    ft.Dropdown(
                        label="Категория",
                        options=[
                            ft.dropdown.Option("Продукты"),
                            ft.dropdown.Option("Бытовая химия"),
                            ft.dropdown.Option("Одежда"),
                            ft.dropdown.Option("Другое"),
                        ],
                    ),
                ],
                tight=True,
            ),
            actions=[
                ft.TextButton("Сохранить", on_click=self.save_data),
                ft.TextButton("Отмена", on_click=self.close_dialog),
            ],
            actions_alignment=ft.MainAxisAlignment.END,
        )

    def save_data(self, e):
        """Собираем данные из полей и передаем в callback"""
        data = {
            "date": self.dialog.content.controls[0].value,
            "price": self.dialog.content.controls[1].value,
            "quantity": self.dialog.content.controls[2].value,
            "store": self.dialog.content.controls[3].value,
            "category": self.dialog.content.controls[4].value,
        }
        self.on_save_callback(data)
        self.close_dialog(e)

    def close_dialog(self, e):
        self.dialog.open = False
        self.page.update()

    def open_dialog(self):
        self.dialog.open = True
        self.page.dialog = self.dialog
        self.page.update()