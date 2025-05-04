import flet as ft
import time
from datetime import datetime
import base64
import io
from PIL import Image, ImageDraw, ImageFont


class CameraView:
    def __init__(self, page: ft.Page):
        self.page = page
        self.captured_image = None

        # Центральный контейнер с полноэкранным отображением
        self.photo_container = ft.Container(
            content=ft.Column(
                [
                    ft.Icon(ft.icons.PHOTO_CAMERA, size=100, color=ft.colors.WHITE),
                    ft.Text("Наведите камеру", size=20, color=ft.colors.WHITE)
                ],
                alignment=ft.MainAxisAlignment.CENTER,
                horizontal_alignment=ft.CrossAxisAlignment.CENTER
            ),
            alignment=ft.alignment.center,
            bgcolor=ft.colors.BLACK,
            expand=True,
            width=self.page.width,
            height=self.page.height
        )

        # FilePicker для галереи
        self.gallery_picker = ft.FilePicker(on_result=self._gallery_picked)
        self.page.overlay.append(self.gallery_picker)

        # Новая иконка для QR (используем ft.icons.QrCodeScanner)
        self.scan_qr_btn = ft.IconButton(
            icon=ft.icons.QR_CODE_SCANNER,
            icon_size=30,
            on_click=self.scan_qr_code,
            icon_color=ft.colors.WHITE,
            tooltip="Сканировать QR-код",
            style=ft.ButtonStyle(
                shape=ft.CircleBorder(),
                padding=20
            )
        )

        # Кнопка съемки
        self.capture_btn = ft.Container(
            content=ft.Icon(ft.icons.CAMERA, size=40),
            width=80,
            height=80,
            border_radius=40,
            bgcolor=ft.colors.WHITE,
            alignment=ft.alignment.center,
            on_click=self.capture_image,
            ink=True
        )

        # Нижняя панель
        self.bottom_panel = ft.Container(
            content=ft.Row(
                [
                    ft.IconButton(
                        icon=ft.icons.PHOTO_LIBRARY,
                        icon_size=30,
                        on_click=lambda _: self.gallery_picker.pick_files(
                            allow_multiple=False,
                            allowed_extensions=["jpg", "jpeg", "png"]
                        ),
                        icon_color=ft.colors.WHITE,
                        tooltip="Галерея"
                    ),
                    self.capture_btn,
                    self.scan_qr_btn
                ],
                alignment=ft.MainAxisAlignment.SPACE_EVENLY,
                vertical_alignment=ft.CrossAxisAlignment.CENTER
            ),
            bgcolor=ft.colors.with_opacity(0.5, ft.colors.BLACK),
            padding=20,
            border_radius=ft.border_radius.only(top_left=20, top_right=20),
            bottom=0,
            left=0,
            right=0,
        )

    def capture_image(self, e):
        """Съемка фото с полноэкранным отображением"""
        # Анимация нажатия
        self.capture_btn.bgcolor = ft.colors.GREY_400
        self.page.update()

        time.sleep(0.2)  # Имитация вспышки

        # Генерация полноразмерного изображения
        self.captured_image = self._generate_fullsize_image()
        if self.captured_image:
            self.photo_container.content = ft.Image(
                src_base64=self.captured_image,
                fit=ft.ImageFit.COVER,  # Изменили на COVER для заполнения всего экрана
                width=self.page.width,
                height=self.page.height,
                gapless_playback=True
            )
            self.photo_container.bgcolor = None
            self.page.update()

        # Возвращаем исходный цвет
        self.capture_btn.bgcolor = ft.colors.WHITE
        self.page.update()

    def _generate_fullsize_image(self):
        """Генерация полноразмерного тестового изображения"""
        try:
            width = int(self.page.width)
            height = int(self.page.height)

            img = Image.new('RGB', (width, height), color='navy')
            draw = ImageDraw.Draw(img)

            font = ImageFont.load_default()
            current_time = datetime.now().strftime("%d.%m.%Y %H:%M")
            text = f"Тестовый снимок\n{current_time}\n{width}x{height}"

            # Центрирование текста
            text_width = font.getlength(text)
            text_height = 40
            position = ((width - text_width) / 2, (height - text_height) / 2)

            draw.text(position, text, fill="white", font=font)

            img_bytes = io.BytesIO()
            img.save(img_bytes, format='PNG')
            return base64.b64encode(img_bytes.getvalue()).decode('utf-8')
        except Exception as e:
            self._show_error(f"Ошибка: {str(e)}")
            return None

    def scan_qr_code(self, e):
        """Сканирование QR-кода с новой иконкой"""
        self.page.snack_bar = ft.SnackBar(
            content=ft.Text("Режим сканирования QR-кода активирован", color=ft.colors.WHITE),
            bgcolor=ft.colors.BLUE_700,
            duration=2000
        )
        self.page.snack_bar.open = True
        self.page.update()

    def _gallery_picked(self, e: ft.FilePickerResultEvent):
        """Обработка выбора из галереи с сохранением пропорций"""
        if e.files:
            try:
                with open(e.files[0].path, "rb") as f:
                    img_bytes = f.read()
                    self.captured_image = base64.b64encode(img_bytes).decode('utf-8')

                    self.photo_container.content = ft.Image(
                        src_base64=self.captured_image,
                        fit=ft.ImageFit.CONTAIN,
                        width=self.page.width,
                        height=self.page.height,
                        gapless_playback=True
                    )
                    self.photo_container.bgcolor = None
                    self.page.update()
            except Exception as e:
                self._show_error(f"Ошибка: {str(e)}")

    def _show_error(self, message):
        self.page.snack_bar = ft.SnackBar(
            ft.Text(message, color=ft.colors.WHITE),
            bgcolor=ft.colors.RED_700
        )
        self.page.snack_bar.open = True
        self.page.update()

    def create(self):
        return ft.Stack(
            [
                self.photo_container,
                self.bottom_panel
            ],
            expand=True
        )