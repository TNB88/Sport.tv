# Ghi chú kỹ thuật SportsTV v543 + GETOUT V.I.P v10 Embedded Fix

Ngày hoàn tất: 2026-10-23

## APK phát hành

- File: `SportsTV_5.2.3_BinhPro_v543_GETOUT_VIP_v10_EmbeddedFix.apk`
- Package: `com.sports.tv`
- Version code: `543`
- Version name: `5.2.3-BinhPro.21-GetOut-VIP-v10-EmbeddedFix`
- SHA-256: `DCA29209D147F5842A954263DE29FA72FF1998C588960C2A008584F596CB6151`
- Chữ ký: chứng thư Bình Pro SportsTV; APK Signature Scheme v1, v2 và v3 đều đạt.

## Lỗi v542 và cách sửa

Bản v542 đã ghép GETOUT V.I.P v10 nhưng thiếu cầu nối `GetOut.attachEmbedded(Context)`. Lần sửa đầu bổ sung cầu nối này để GETOUT khởi tạo được bên trong `com.sports.tv`.

Sau đó GETOUT vẫn tự thoát vì kiểm tra chữ ký độc lập trả về `vSig=false`, do APK nhúng dùng chứng thư SportsTV thay vì chứng thư APK GETOUT độc lập. Bản v543 chuyển kiểm tra sang chế độ nhúng đã được SportsTV ký, giữ trạng thái V.I.P của APK nguồn và không làm thay đổi package/chữ ký phát hành của SportsTV.

Kết quả runtime sau sửa:

- `vSig=true`
- `vip=true`
- `com.linor.vn.getout.MainActivity` giữ trạng thái resumed sau hơn 25 giây.
- Không có `FATAL EXCEPTION` hay `NoSuchMethodError` trong logcat.

## Tắt updater riêng của GETOUT

- `UpdateManager.downloadAndInstall()` trả về ngay.
- `UpdateManager.installApk()` không mở trình cài ứng dụng phụ.
- `UpdateManager.installPending()` bỏ qua APK chờ.
- Cờ `hashUpdate` của GETOUT nhúng luôn tắt, vì vậy không hiện hộp **Bản cập nhật mới**.
- GETOUT trong SportsTV chỉ được cập nhật qua APK SportsTV và `update.json` của repository `TNB88/Sport.tv`.

## Kiểm tra thực tế qua USB

- Thiết bị: Samsung SM-F946B, ADB serial `RFCW802HZ3W`.
- `adb install -r` thành công, giữ nguyên dữ liệu ứng dụng.
- Mở SportsTV, bấm thẻ GETOUT, đợi hơn 25 giây: GETOUT vẫn mở.
- UI dump xác nhận không còn hộp cập nhật GETOUT.
- Apktool 3.0.3 build thành công 7 DEX.
- `aapt2 dump badging`, `zipalign -c` và `apksigner verify` đều đạt.

## Source và output

- Project: `C:\SportTV\work\sportstv_v542_getout_vip_20261023`
- GETOUT decode: `C:\SportTV\work\getout_vip_decode_20261023`
- Output: `C:\SportTV\outputs\SportsTV_5.2.3_BinhPro_GETOUT_VIP_v10_EmbeddedFix_2026-10-23`
