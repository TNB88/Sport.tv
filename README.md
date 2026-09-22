# SportsTV · cập nhật từ xa Bình Pro

Ứng dụng đọc cấu hình cập nhật tại `update.json` để thông báo bản mới khi mở app.

Khi có APK mới:

1. Tăng `version_code` cao hơn bản đang cài.
2. Điền `version_name` và nội dung `message`.
3. Điền liên kết tải APK trực tiếp vào `apk_url`.
4. Đổi `enabled` thành `true`.
5. Đặt `required` thành `true` nếu bắt buộc cập nhật; để `false` nếu cho phép chọn **ĐỂ SAU**.

Muốn tắt ngay thông báo cập nhật chỉ cần đổi `enabled` về `false`. Không xóa hoặc đổi tên file `update.json`.

## Bản đang phát hành

- Version code: `527`
- Version name: `5.2.3-BinhPro.5`
- Tệp: `SportsTV_5.2.3_BinhPro_InstantListCache_v527.apk`
- SHA-256: `7F6067D94021FF8286121552E6C7CA771AD60D7E9B89697A8ECAD5FB3F58CB95`
- Nội dung: giữ Cloudflare Worker và VietAnhTV; thêm HTTP client dự phòng khi Firebase Remote Config lỗi, tăng timeout hợp lý và lưu danh sách kênh gần nhất trên máy. Lần mở sau hiển thị cache trước rồi tự cập nhật ngầm, không phải chờ Worker tải xong mới xem danh sách.
