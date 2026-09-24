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

- Version code: `529`
- Version name: `5.2.3-BinhPro.7`
- Tệp cập nhật chính: `SportsTV_5.2.3_BinhPro_SportStreamTV26_v529.apk`
- SHA-256 SportsTV: `4B400D1201FDA3B06E7A273C58C89A56A0EC8460FBD3D50E1C723BE5A68D1C4A`
- Module đi kèm: `SPORT_STREAM_TV_2.6_BinhPro_7Providers_NoActivation.apk`
- Package module: `com.vxm.sport.mobile`
- Version module: `12` / `2.6-SportsTV`
- SHA-256 module: `DA348D4DC219F6B444C80570B6F1983495A302CB70AD745EDC602EC7EEAC25A6`
- Nội dung: giữ toàn bộ Film Activation, Cloudflare Worker, VietAnhTV, cache danh sách tức thời và bản vá phát kênh của SportsTV; thay launcher cũ bằng SPORT STREAM TV 2.6 có 7 nhà cung cấp và giao diện TV. Module không có kích hoạt riêng và đã được nhúng trong APK SportsTV.

## Cách mở SPORT STREAM lần đầu

1. Cập nhật SportsTV lên bản 529.
2. Bấm thẻ **SPORT STREAM** nằm ngay sau **Thêm nguồn**.
3. Nếu Android hỏi quyền cài ứng dụng không xác định, cho phép SportsTV cài ứng dụng.
4. Cài hoặc cập nhật module SPORT STREAM TV 2.6 được mở sẵn.
5. Quay lại SportsTV và bấm thẻ một lần nữa. Các lần sau sẽ mở trực tiếp, không yêu cầu kích hoạt riêng.
