class MyExpensesApp {
    // ... остальные методы
    
    updateRecentTransactions() {
        const transactions = this.transactionManager
            .getTransactions()
            .slice(-3) // Последние 3 транзакции
            .reverse(); // Новые сверху
        
        const container = document.getElementById('recent-list');
        container.innerHTML = '';
        
        if (transactions.length === 0) {
            container.innerHTML = '<div class="recent-item">Нет операций</div>';
            return;
        }
        
        transactions.forEach(transaction => {
            const item = document.createElement('div');
            item.className = 'recent-item';
            item.innerHTML = `
                <span class="recent-date">${this.formatDate(transaction.date)}</span>
                <span class="recent-category">${transaction.category}</span>
                <span class="recent-amount">${transaction.amount} ?</span>
            `;
            container.appendChild(item);
        });
    }
    
    // Обновить при инициализации и после добавления новых данных
    init() {
        this.updateChart();
        this.updateRecentTransactions();
    }
}

// В метод addTransaction добавьте обновление списка
class TransactionManager {
    addTransaction(transaction) {
        this.transactions.push(transaction);
        this.saveToLocalStorage();
        // Обновляем список при добавлении новой транзакции
        if (window.app) window.app.updateRecentTransactions();
    }
}