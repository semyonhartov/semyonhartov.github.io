import flet as ft
from transaction import TransactionManager

class HistoryView:
    def __init__(self, transaction_manager):
        self.transaction_manager = transaction_manager

    def create(self):
        sorted_trans = self.transaction_manager.get_sorted_transactions()

        return ft.ListView(
            controls=[
                ft.Container(
                    content=ft.Column(
                        controls=[
                            ft.Row(
                                controls=[
                                    ft.Column(
                                        controls=[
                                            ft.Row(
                                                controls=[
                                                    ft.Text(
                                                        trans["formatted_date"],
                                                        size=18,
                                                        weight="bold",
                                                        color=ft.colors.BLACK87
                                                    ),
                                                    ft.Text(
                                                        trans["time"],
                                                        size=16,
                                                        color=ft.colors.GREY_600
                                                    ),
                                                ],
                                                spacing=10
                                            ),
                                            ft.Text(
                                                trans["store"],
                                                size=14,
                                                color=ft.colors.BLACK54
                                            ),
                                            ft.Text(
                                                trans["category"],
                                                size=14,
                                                color=ft.colors.BLACK54
                                            ),
                                        ],
                                        spacing=5,
                                        expand=True
                                    ),
                                ],
                                spacing=10,
                                vertical_alignment=ft.CrossAxisAlignment.START
                            ),
                            ft.Container(
                                content=ft.Column(
                                    controls=[
                                        ft.Text(
                                            f"×{trans['quantity']} {trans['price']:.2f} ₽",
                                            size=14,
                                            color=ft.colors.GREY_600,
                                            text_align=ft.TextAlign.RIGHT
                                        ),
                                        ft.Text(
                                            f"{trans['total']:.2f} ₽",
                                            size=16,
                                            weight="bold",
                                            color=ft.colors.BLACK87,
                                            text_align=ft.TextAlign.RIGHT
                                        ),
                                    ],
                                    spacing=0,
                                    horizontal_alignment=ft.CrossAxisAlignment.END
                                ),
                                alignment=ft.alignment.top_right,
                                padding=ft.padding.only(top=5)
                            )
                        ],
                        spacing=5,
                    ),
                    padding=ft.padding.all(15),
                    margin=ft.margin.symmetric(vertical=5),
                    border=ft.border.all(1, ft.colors.GREY_300),
                    border_radius=ft.border_radius.only(
                        top_left=35, top_right=35,
                        bottom_left=35, bottom_right=35
                    ),
                    bgcolor=ft.colors.GREY_50
                )
                for trans in sorted_trans
            ],
            expand=True,
            padding=ft.padding.symmetric(horizontal=15, vertical=10),
        )