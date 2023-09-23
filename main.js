// link website: http://ninhdan.byethost7.com/
document.addEventListener("DOMContentLoaded", function () {
    // Lấy dữ liệu từ API và hiển thị lên trang web
    fetchExchangeRates();
    // Cập nhật dữ liệu tỷ giá ngoại tệ mỗi 10 phút
    setInterval(fetchExchangeRates, 600000); // 10 phút = 600000 mili giây
});

function sendExchangeRatesToServer(data) {
    const url = 'http://localhost/rate/save_exchange_rates.php';

    // Tạo một đối tượng FormData để gửi dữ liệu dưới dạng POST request
    const formData = new FormData();
    formData.append('exchangeRates', JSON.stringify(data));

    // Tạo một POST request và gửi dữ liệu lên máy chủ
    fetch(url, {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Lỗi khi gửi dữ liệu lên máy chủ.');
        }
        return response.text();
    })
    .then(message => {
        console.log(message); // Hiển thị thông báo từ máy chủ
    })
    .catch(error => {
        console.error('Lỗi: ' + error);
    });
}

function fetchExchangeRates() {
    //API https://fixer.io/quickstart
    fetch("http://data.fixer.io/api/latest?access_key=42b5dfb8d7fbc9fd33679c21173475f6")
        .then(response => response.json())
        .then(data => {
            if (data && data.success) {
                const timestamp = new Date(data.timestamp * 1000).toLocaleString();
                const base = data.base;
                const rates = data.rates;
                const sortedRates = Object.entries(rates).sort((a, b) => b[1] - a[1]);
                // Tính thời gian của lần cập nhật tiếp theo (10 phút sau)
                const nextUpdateTimestamp = new Date();
                nextUpdateTimestamp.setMinutes(nextUpdateTimestamp.getMinutes() + 10);
                const nextUpdateFormatted = nextUpdateTimestamp.toLocaleString();
                
                // Hiển thị thời gian cập nhật trên giao diện
                let html1 = `<p><strong>Base:</strong> ${base}</p>`;
                html1 += `<p><strong>Timestamp:</strong> ${timestamp}</p>`;
                html1 += `<p><strong>TimeUpdate:</strong> ${nextUpdateFormatted }</p>`;

                document.getElementById("selectTime").innerHTML = html1;

                let html = "";
                let stt = 1;
                for (const [currencyCode, rate] of sortedRates) {
                    html += `<tr><td>${stt}</td><td>${currencyCode}</td><td>${rate}</td></tr>`;
                    stt++;
                }

                // Hiển thị dữ liệu trên trang web
                document.getElementById("exchangeRates").innerHTML = html;
               //sendExchangeRatesToServer(data);
            } else {
                console.error("Không thể lấy dữ liệu từ API.");
            }
            
        })
        .catch(error => {
            console.error("Lỗi: " + error);
        });
}

