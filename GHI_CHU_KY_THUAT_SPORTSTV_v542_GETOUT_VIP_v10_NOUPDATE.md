# Ghi chú kỹ thuật SportsTV v542 + GETOUT V.I.P v10

Ngày hoàn tất: 2026-10-23

## APK phát hành

- File: `SportsTV_5.2.3_BinhPro_v542_GETOUT_VIP_v10_NoUpdate.apk`
- Package: `com.sports.tv`
- Version code: `542`
- Version name: `5.2.3-BinhPro.20-GetOut-VIP-v10-NoUpdate`
- SHA-256: `5B712EB21C5584559C223C184E14358E0D3E20E392C3E20EBFB4D044CC937ED4`
- Chữ ký: chứng thư Bình Pro SportsTV cũ; APK Signature Scheme v1, v2 và v3 đều đạt.
- Zipalign: đạt kiểm tra căn chỉnh 16 KiB.

## GETOUT tích hợp

- APK nguồn: `C:\Users\Admin\Downloads\getout_vip.apk`
- Package nguồn: `com.linor.vn.getout`
- Version code nguồn: `10` (bản tích hợp trước là `8`)
- Version name nguồn: `V.I.P`
- SHA-256 nguồn: `C309E22DDAE33A766BD2AB65DD0D3FFAD92280C73290ACE0092D3C725094EE5C`
- Số lớp ứng dụng GETOUT sau khi ghép: `975`.
- Tổng smali GETOUT và thư viện cô lập: `20451` file.
- Tổng tài nguyên ánh xạ: `7733`.

GETOUT tiếp tục chạy nội bộ trong package SportsTV. Thư viện phụ thuộc được chuyển vào namespace `go.*`; tài nguyên GETOUT dùng tiền tố `go_` để không đè AndroidX, Kotlin, Media3, OkHttp hoặc tài nguyên của SportsTV.

## Tắt cập nhật riêng của GETOUT

Đã vô hiệu hóa toàn bộ các điểm vào của updater độc lập:

- Không gọi kiểm tra/tải cập nhật khi mở GETOUT.
- `UpdateManager.downloadAndInstall()` trả về ngay.
- `UpdateManager.installApk()` không mở quyền cài ứng dụng không rõ nguồn và không gọi trình cài APK.
- `UpdateManager.installPending()` bỏ qua bản cập nhật đang chờ còn sót trong preferences.
- Callback quay lại từ màn cấp quyền cài đặt không tiếp tục cài APK.

SportsTV vẫn giữ hệ thống cập nhật riêng qua `update.json` của repository `TNB88/Sport.tv`.

## Phần SportsTV được giữ nguyên

- Film Activation và chữ ký phát hành Bình Pro.
- SPORT STREAM tích hợp.
- Nguồn Truyền Hình/Thanh TV và cấu hình playlist của bản v541.
- Cloudflare Worker, cache danh sách và các bản vá phát kênh hiện có.
- Package `com.sports.tv`, dữ liệu người dùng và khả năng cài đè từ các bản Bình Pro cũ.

## Kiểm tra

- Apktool 3.0.3 build thành công 7 DEX.
- `aapt2 dump badging` xác nhận package/versionCode/versionName đúng.
- `zipalign -c -P 16 4` thành công.
- `apksigner verify --verbose --print-certs` xác nhận v1/v2/v3 và đúng chứng thư Bình Pro SportsTV.
- Tại thời điểm build, ADB không thấy thiết bị USB nên chưa thực hiện kiểm tra giao diện trực tiếp; không xóa dữ liệu hay gỡ ứng dụng trên thiết bị.

## Source làm việc

- Project: `C:\SportTV\work\sportstv_v542_getout_vip_20261023`
- GETOUT decode: `C:\SportTV\work\getout_vip_decode_20261023`
- Output: `C:\SportTV\outputs\SportsTV_5.2.3_BinhPro_GETOUT_VIP_v10_2026-10-23`
