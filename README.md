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

- Version code: `528`
- Version name: `5.2.3-BinhPro.6`
- Tệp: `SportsTV_5.2.3_BinhPro_SportStreamLauncher_v528.apk`
- SHA-256: `F356960B0520CA40E9C4F6575C64BF4C03CCB8F8C22FE236ECADF1C9C9E89A27`
- Nội dung: giữ toàn bộ Film Activation, Cloudflare Worker, VietAnhTV, cache danh sách tức thời và bản vá phát kênh của v527; thêm thẻ SPORT STREAM ngay sau `Thêm nguồn`. Bấm thẻ sẽ mở ứng dụng `com.vxm.sport`, còn khi chưa cài SPORT STREAM thì hiện thông báo rõ ràng và không làm SportsTV bị lỗi.
