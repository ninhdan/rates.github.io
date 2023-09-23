<!-- link website: http://ninhdan.byethost7.com/ -->
<?php
// Kết nối đến cơ sở dữ liệu MySQL
$mysqli = new mysqli("localhost", "root", "", "currency_exchange");

if ($mysqli->connect_error) {
    die("Kết nối đến MySQL thất bại: " . $mysqli->connect_error);
}

// Lấy dữ liệu từ POST request (chú ý: cần validate và xử lý dữ liệu thật cẩn thận ở đây)
$data = json_decode($_POST['exchangeRates'], true);

if ($data && isset($data['success']) && isset($data['timestamp']) && isset($data['base']) && isset($data['date']) && isset($data['rates'])) {
    $success = $data['success'];
    $timestamp = $data['timestamp'];
    $base = $data['base'];
    $date = $data['date'];

    // Lưu dữ liệu vào bảng exchange_rates
    $insert_query = "INSERT INTO exchange_rates (success, timestamp, base, date, created_at) VALUES (?, ?, ?, ?, NOW())";
    $stmt = $mysqli->prepare($insert_query);
    $stmt->bind_param("iiss", $success, $timestamp, $base, $date);
    $stmt->execute();
    $exchange_rate_id = $stmt->insert_id; // Lấy ID của bản ghi mới được thêm vào
    $stmt->close();

    // Lưu tỷ giá ngoại tệ vào bảng rate_data
    foreach ($data['rates'] as $currency_code => $rate) {
        $insert_rate_query = "INSERT INTO rate_data (currency_code, rate, exchange_rate_id) VALUES (?, ?, ?)";
        $stmt = $mysqli->prepare($insert_rate_query);
        $stmt->bind_param("sdi", $currency_code, $rate, $exchange_rate_id);
        $stmt->execute();
        $stmt->close();
    }

    echo "Dữ liệu tỷ giá ngoại tệ đã được lưu vào cơ sở dữ liệu.";
} else {
    echo "Không có dữ liệu hợp lệ.";
}

// Đóng kết nối MySQL
$mysqli->close();
?>
