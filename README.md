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

- Version code: `533`
- Version name: `5.2.3-BinhPro.11-AllInOne-GetOut-SourceFix`
- Tệp cập nhật chính: `SportsTV_5.2.3_BinhPro_SportStream_GetOut_AllInOne_v533_SourceFix.apk`
- SHA-256 SportsTV: `C72B6E360857307D22F7972E36B06F226D5CE86083D501115A4AFD0CC0916A94`
- Package duy nhất: `com.sports.tv`
- Nội dung: SPORT STREAM TV 2.6 và GETOUT đều chạy trực tiếp bên trong SportsTV. Không cài app riêng, không xin quyền cài ứng dụng không rõ nguồn gốc và không có kích hoạt thứ hai. Giữ nguyên Film Activation, Cloudflare Worker, VietAnhTV, cache danh sách tức thời và các bản vá phát kênh của SportsTV.

## Cách mở SPORT STREAM

1. Cập nhật SportsTV lên bản 533.
2. Bấm thẻ **SPORT STREAM** nằm ngay sau **Thêm nguồn**.
3. SPORT STREAM mở trực tiếp trong SportsTV, không có bước cài đặt ứng dụng phụ.
4. Khi đang xem, Back trở về danh sách SPORT STREAM; Back thêm lần nữa về SportsTV ngay, không hỏi xác nhận thoát.

## Cách mở GETOUT

1. Bấm thẻ **GETOUT** nằm ngay sau **SPORT STREAM**.
2. GETOUT mở trực tiếp trong SportsTV, không cần cài APK riêng.
3. Có thể chọn Truyền hình, Bóng đá hoặc Tennis và phát bằng trình phát tích hợp.
4. Back thoát trình phát về GETOUT, sau đó quay lại SportsTV.

## Bản vá nguồn TV v533

- Sửa chỉ số playlist bị lệch sau khi thêm GETOUT.
- Truyền Hình TV, Thanh TV và VietAnhTV nay mở đúng nguồn tương ứng.
- Đã phát thử từng nguồn trên Box R 4K Plus: có hình, có tiếng và không crash.
