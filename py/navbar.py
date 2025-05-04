import flet as ft

class NavBar:
    def __init__(self, page):
        self.page = page

    def create(self):
        return ft.Container(
            content=ft.Row(
                controls=[
                    ft.IconButton(
                        icon=ft.icons.HOME,
                        icon_size=40,
                        icon_color=ft.colors.WHITE,
                        tooltip="Главная",
                        on_click=lambda e: self.page.go("/")
                    ),
                    ft.IconButton(
                        icon=ft.icons.LIST_ALT,
                        icon_size=40,
                        icon_color=ft.colors.WHITE,
                        tooltip="История покупок",
                        on_click=lambda e: self.page.go("/history")
                    ),
                    ft.IconButton(
                        icon=ft.icons.ADD_A_PHOTO,
                        icon_size=40,
                        icon_color=ft.colors.WHITE,
                        tooltip="Камера",
                        on_click=lambda e: self.page.go("/camera")  # Изменено здесь
                    ),
                    ft.IconButton(
                        icon=ft.icons.MANAGE_ACCOUNTS,
                        icon_size=40,
                        icon_color=ft.colors.WHITE,
                        tooltip="Аккаунт",
                        on_click=lambda e: print("Аккаунт")
                    ),
                ],
                alignment=ft.MainAxisAlignment.SPACE_AROUND,
                width=self.page.width,
            ),
            padding=10,
            bgcolor=ft.colors.GREEN_ACCENT_700,
        )