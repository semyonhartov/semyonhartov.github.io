class MyExpensesApp {
    // ... ��⠫�� ��⮤�
    
    updateRecentTransactions() {
        const transactions = this.transactionManager
            .getTransactions()
            .slice(-3) // ��᫥���� 3 �࠭���樨
            .reverse(); // ���� ᢥ���
        
        const container = document.getElementById('recent-list');
        container.innerHTML = '';
        
        if (transactions.length === 0) {
            container.innerHTML = '<div class="recent-item">��� ����権</div>';
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
    
    // �������� �� ���樠����樨 � ��᫥ ���������� ����� ������
    init() {
        this.updateChart();
        this.updateRecentTransactions();
    }
}

// � ��⮤ addTransaction ������� ���������� ᯨ᪠
class TransactionManager {
    addTransaction(transaction) {
        this.transactions.push(transaction);
        this.saveToLocalStorage();
        // ������塞 ᯨ᮪ �� ���������� ����� �࠭���樨
        if (window.app) window.app.updateRecentTransactions();
    }
}