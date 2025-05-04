import flet as ft

class Header:
    def __init__(self, page):
        self.page = page
        self.theme_icon = ft.IconButton(
            icon=ft.icons.DARK_MODE,
            icon_size=30,
            tooltip="Сменить тему",
            on_click=self.toggle_theme,
        )

    def toggle_theme(self, e):
        self.page.theme_mode = (
            ft.ThemeMode.DARK
            if self.page.theme_mode == ft.ThemeMode.LIGHT
            else ft.ThemeMode.LIGHT
        )
        self.theme_icon.icon = (
            ft.icons.DARK_MODE
            if self.page.theme_mode == ft.ThemeMode.LIGHT
            else ft.icons.LIGHT_MODE
        )
        self.page.update()

    def create(self, title, center=False, middle_left=False):
        if middle_left:
            return ft.Container(
                content=ft.Row(
                    controls=[
                        ft.Text(title, size=20, weight="bold", color=ft.colors.BLACK),
                        ft.Container(expand=True),
                        self.theme_icon,
                    ],
                    alignment=ft.MainAxisAlignment.START,
                    vertical_alignment=ft.CrossAxisAlignment.CENTER,
                ),
                padding=ft.padding.only(left=20, right=10),
                width=self.page.width,
                height=50,
                bgcolor=ft.colors.GREY_200,
                border_radius=ft.border_radius.only(bottom_left=15, bottom_right=15),
            )
        else:
            return ft.Container(
                content=ft.Stack(
                    controls=[
                        ft.Container(
                            content=ft.Text(title, size=20, weight="bold"),
                            alignment=ft.alignment.center if center else ft.alignment.top_left,
                            padding=ft.padding.only(left=20) if not center else None,
                            expand=True,
                        ),
                        ft.Container(
                            content=self.theme_icon,
                            alignment=ft.alignment.top_right,
                            padding=10,
                        ),
                    ],
                ),
                width=self.page.width,
            )
