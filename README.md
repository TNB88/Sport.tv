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

- Version code: `532`
- Version name: `5.2.3-BinhPro.10-AllInOne-GetOut`
- Tệp cập nhật chính: `SportsTV_5.2.3_BinhPro_SportStream_GetOut_AllInOne_v532.apk`
- SHA-256 SportsTV: `588E89C8D7A1488BD44C46E1EE75D093FAB1F963E4439D09537C19DECC2FB799`
- Package duy nhất: `com.sports.tv`
- Nội dung: SPORT STREAM TV 2.6 và GETOUT đều chạy trực tiếp bên trong SportsTV. Không cài app riêng, không xin quyền cài ứng dụng không rõ nguồn gốc và không có kích hoạt thứ hai. Giữ nguyên Film Activation, Cloudflare Worker, VietAnhTV, cache danh sách tức thời và các bản vá phát kênh của SportsTV.

## Cách mở SPORT STREAM

1. Cập nhật SportsTV lên bản 532.
2. Bấm thẻ **SPORT STREAM** nằm ngay sau **Thêm nguồn**.
3. SPORT STREAM mở trực tiếp trong SportsTV, không có bước cài đặt ứng dụng phụ.
4. Khi đang xem, Back trở về danh sách SPORT STREAM; Back thêm lần nữa về SportsTV ngay, không hỏi xác nhận thoát.

## Cách mở GETOUT

1. Bấm thẻ **GETOUT** nằm ngay sau **SPORT STREAM**.
2. GETOUT mở trực tiếp trong SportsTV, không cần cài APK riêng.
3. Có thể chọn Truyền hình, Bóng đá hoặc Tennis và phát bằng trình phát tích hợp.
4. Back thoát trình phát về GETOUT, sau đó quay lại SportsTV.
