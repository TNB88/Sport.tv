# GHI CHÚ KỸ THUẬT SPORTSTV V530 ALL-IN-ONE

Ngày hoàn tất: 25/09/2026

## Thành phẩm

- APK: `SportsTV_5.2.3_BinhPro_SportStream_AllInOne_v530.apk`
- Package duy nhất: `com.sports.tv`
- Version code: `530`
- Version name: `5.2.3-BinhPro.8-AllInOne`
- SHA-256: `25DD54924BA90D48F30B369269A60E2DD2BE1A0922BB094EDB75144C3C02617B`
- Chữ ký Bình Pro của SportsTV; verify đạt v1, v2 và v3.

SPORT STREAM TV 2.6 đã được ghép trực tiếp vào SportsTV. Không cần cài package `com.vxm.sport.mobile`, không xin quyền cài ứng dụng không rõ nguồn gốc và không có màn kích hoạt riêng.

## Kiến trúc ghép

- Activity nội bộ: `com.vxm.sport.mobile.MainActivity` chạy trong package `com.sports.tv`.
- Mã module đặt tại `smali_classes4`.
- Namespace desugar được cô lập thành `ss.j$`.
- AndroidX riêng của module được cô lập thành `ss.androidx.*`.
- Layout Media3 dùng tiền tố `ss_` để tránh trùng tài nguyên.
- Resource ID được remap nguyên tử từ nguồn gốc; không thay tuần tự trên file đã sửa.
- Kiểm tra package/chữ ký của module được đổi sang package và chứng thư SportsTV.

## Phát và điều hướng

- Media3 1.9.3 chọn chất lượng thích ứng, ưu tiên track cao nhất mà nguồn, băng thông và thiết bị hỗ trợ.
- Ca thử Box R 4K Plus đã tự nâng từ 1280×720 lên 1920×1080, có hình và tiếng.
- Back khi đang phát: về danh sách SPORT STREAM.
- Back tại danh sách: về SportsTV ngay; không hỏi xác nhận thoát.

## Kiểm thử độc lập

Đã vô hiệu hóa package `com.vxm.sport.mobile` trên box và xác nhận SPORT STREAM nội bộ vẫn mở, tải danh sách, phát kênh và quay lại SportsTV bình thường. Điều này chứng minh bản v530 không phụ thuộc ứng dụng SPORT STREAM cài riêng.

Chi tiết đầy đủ và bảng remap được lưu trong bộ build tại `C:\SportTV\work\sportstv_v530_allinone_20260925`.
