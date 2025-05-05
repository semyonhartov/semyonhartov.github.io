document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('history-container');
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');

    try {
        // Показываем загрузку
        loadingEl.style.display = 'block';
        container.innerHTML = '';
        errorEl.style.display = 'none';

        // 1. Загружаем данные (используем тестовые данные, если файл не найден)
        let purchases;
        try {
            const response = await fetch('purchases.json');
            if (!response.ok) throw new Error('Файл не найден');
            purchases = await response.json();
        } catch (e) {
            console.warn('Используем тестовые данные');
            purchases = [
                {
                    "date": "03.05.2024",
                    "time": "23:55",
                    "store": "Пятерочка",
                    "items": [
                        {"name": "Молоко Молочный замок", "price": 85.99, "quantity": 2, "sum": 171.98},
                        {"name": "Шоколад", "price": 60.00, "quantity": 2, "sum": 120.00}
                    ],
                    "total": 297.38
                }
            ];
        }

        // 2. Группируем по датам
        const grouped = purchases.reduce((acc, purchase) => {
            const date = purchase.date;
            acc[date] = acc[date] || [];
            acc[date].push(purchase);
            return acc;
        }, {});

        // 3. Рендерим
        container.innerHTML = '';
        for (const [date, transactions] of Object.entries(grouped)) {
            const dayGroup = document.createElement('div');
            dayGroup.className = 'day-group';
            dayGroup.innerHTML = `<div class="day-header">${formatDate(date)}</div>`;
            
            transactions.forEach(t => {
                const transEl = document.createElement('div');
                transEl.className = 'transaction';
                transEl.innerHTML = `
                    <div class="transaction-header">
                        <span class="time">${t.time}</span>
                        <span class="store-name">${t.store}</span>
                    </div>
                    <div class="items-list"></div>
                    <div class="transaction-footer">
                        <span class="items-count">+${t.items.length} ${getItemWord(t.items.length)}</span>
                        <span class="total-sum">${t.total.toFixed(2)} ₽</span>
                    </div>
                `;
                
                const itemsContainer = transEl.querySelector('.items-list');
                t.items.forEach(item => {
                    itemsContainer.innerHTML += `
                        <div class="item">
                            <span class="item-name">${item.name}</span>
                            <span class="item-quantity">${item.quantity} × ${item.price.toFixed(2)}</span>
                            <span class="item-price">${item.sum.toFixed(2)} ₽</span>
                        </div>
                    `;
                });
                
                dayGroup.appendChild(transEl);
            });
            
            container.appendChild(dayGroup);
        }

        loadingEl.style.display = 'none';

    } catch (error) {
        loadingEl.style.display = 'none';
        errorEl.textContent = `Ошибка: ${error.message}`;
        errorEl.style.display = 'block';
        console.error('Ошибка:', error);
    }
});

// Форматирование даты
function formatDate(dateStr) {
    const [d, m, y] = dateStr.split('.');
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return `${parseInt(d)} ${months[parseInt(m)-1]}`;
}

// Склонение слова "товар"
function getItemWord(n) {
    n = n % 100;
    if (n >= 11 && n <= 19) return 'товаров';
    n = n % 10;
    return n === 1 ? 'товар' : n >= 2 && n <= 4 ? 'товара' : 'товаров';
}