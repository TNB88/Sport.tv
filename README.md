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

- Version code: `530`
- Version name: `5.2.3-BinhPro.8-AllInOne`
- Tệp cập nhật chính: `SportsTV_5.2.3_BinhPro_SportStream_AllInOne_v530.apk`
- SHA-256 SportsTV: `25DD54924BA90D48F30B369269A60E2DD2BE1A0922BB094EDB75144C3C02617B`
- Package duy nhất: `com.sports.tv`
- Nội dung: SPORT STREAM TV 2.6 với 7 nhà cung cấp chạy trực tiếp bên trong SportsTV. Không cài app riêng, không xin quyền cài ứng dụng không rõ nguồn gốc và không có kích hoạt thứ hai. Giữ nguyên Film Activation, Cloudflare Worker, VietAnhTV, cache danh sách tức thời và các bản vá phát kênh của SportsTV.

## Cách mở SPORT STREAM

1. Cập nhật SportsTV lên bản 530.
2. Bấm thẻ **SPORT STREAM** nằm ngay sau **Thêm nguồn**.
3. SPORT STREAM mở trực tiếp trong SportsTV, không có bước cài đặt ứng dụng phụ.
4. Khi đang xem, Back trở về danh sách SPORT STREAM; Back thêm lần nữa về SportsTV ngay, không hỏi xác nhận thoát.
