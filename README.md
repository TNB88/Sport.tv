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

- Version code: `525`
- Version name: `5.2.3-BinhPro.3`
- Tệp: `SportsTV_5.2.3_BinhPro_PlaybackCrash_BufferFix_v525.apk`
- SHA-256: `9D177B8EA7754F9822A27E92140FE408FD2022432DA3A134187DF1190F6BF5F1`
- Nội dung: giữ Cloudflare Worker và VietAnhTV; sửa crash do cấu hình chứng thư sai, vô hiệu cấu hình bộ đệm lỗi từ máy chủ, phát kênh nhanh và không còn loading vô hạn.
