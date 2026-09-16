# SportsTV · cập nhật từ xa Bình Pro

Ứng dụng đọc cấu hình cập nhật tại `update.json`. Mặc định đang tắt nên người dùng không thấy thông báo khi mở app.

Khi có APK mới:

1. Tăng `version_code` cao hơn bản đang cài.
2. Điền `version_name` và nội dung `message`.
3. Điền liên kết tải APK trực tiếp vào `apk_url`.
4. Đổi `enabled` thành `true`.
5. Đặt `required` thành `true` nếu bắt buộc cập nhật; để `false` nếu cho phép chọn **ĐỂ SAU**.

Muốn tắt ngay thông báo cập nhật chỉ cần đổi `enabled` về `false`. Không xóa hoặc đổi tên file `update.json`.

## Bản đang phát hành

- Version code: `524`
- Version name: `5.2.3-BinhPro.2`
- Tệp: `SportsTV_5.2.3_BinhPro_CloudflareSources_RestartFix_v524.apk`
- SHA-256: `C16FC2A7B67C99583B79C9C395B1064D31046C1B98267FF25ED343450F810240`
- Nội dung: Cloudflare Worker cho nguồn từ xa, bổ sung VietAnhTV, giữ Playback Fix và sửa nút khởi động lại bị kẹt logo.
