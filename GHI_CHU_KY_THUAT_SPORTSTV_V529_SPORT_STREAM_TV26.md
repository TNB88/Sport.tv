# Ghi chú kỹ thuật SportsTV v529 + SPORT STREAM TV 2.6

Ngày hoàn thiện: 24/09/2026

## Thành phẩm

- `SportsTV_5.2.3_BinhPro_SportStreamTV26_v529.apk`
  - Package: `com.sports.tv`
  - Version code: `529`
  - Version name: `5.2.3-BinhPro.7`
  - SHA-256: `4B400D1201FDA3B06E7A273C58C89A56A0EC8460FBD3D50E1C723BE5A68D1C4A`
- `SPORT_STREAM_TV_2.6_BinhPro_7Providers_NoActivation.apk`
  - Package: `com.vxm.sport.mobile`
  - Version code: `12`
  - Version name: `2.6-SportsTV`
  - SHA-256: `DA348D4DC219F6B444C80570B6F1983495A302CB70AD745EDC602EC7EEAC25A6`

Hai APK đều đã zipalign và ký hợp lệ bằng APK Signature Scheme v1, v2 và v3.

## Yêu cầu đã thực hiện

1. Thẻ **SPORT STREAM** nằm ngay sau **Thêm nguồn** trong SportsTV.
2. Thẻ mở đúng bản TV 2.6, package `com.vxm.sport.mobile`; không còn mở bản 2.4 package `com.vxm.sport`.
3. Module SPORT STREAM giữ giao diện TV và 7 nhà cung cấp của bản nguồn.
4. Module đi kèm không có màn kích hoạt riêng. Film Activation của SportsTV chính vẫn được giữ nguyên.
5. Bản module đã được nhúng trực tiếp vào SportsTV tại `assets/sport_stream_tv26.apk`.
6. Nếu chưa cài module hoặc module thấp hơn version code 12, bấm thẻ sẽ chép APK nhúng vào cache và mở trình cài đặt Android.
7. Nếu module version code 12 trở lên đã có, bấm thẻ mở thẳng `com.vxm.sport.mobile/.MainActivity`.

## Vị trí mã đã sửa

- SportsTV decode:
  - `C:\SportTV\work\sportstv_v528_sportstream_launcher_20260924\decoded`
  - Launcher: `smali_classes3/vn/hpo/sport/SportStreamClick.smali`
  - APK nhúng: `assets/sport_stream_tv26.apk`
  - Manifest query: package `com.vxm.sport.mobile`
- SPORT STREAM TV 2.6 decode:
  - `C:\SportTV\work\sportstream_tv26_noactivation_module_20260924`
  - Bỏ lời gọi `ActivationActivity.isActivated()` và `ActivationActivity.show()` ở đầu `MainActivity.onCreate()`.

## Luồng cài module nhúng

SportsTV kiểm tra package bằng `PackageManager.getLaunchIntentForPackage()` và đọc `PackageInfo.versionCode`.

- `versionCode >= 12`: mở app ngay.
- Chưa cài hoặc thấp hơn 12:
  1. Đọc `assets/sport_stream_tv26.apk`.
  2. Chép thành `cacheDir/sport_stream_tv26.apk`.
  3. Tạo URI qua provider có sẵn: `content://com.sports.tv.update.provider/app_update/sport_stream_tv26.apk`.
  4. Gọi `android.intent.action.INSTALL_PACKAGE` với MIME `application/vnd.android.package-archive` và quyền đọc URI.

SportsTV đã có `REQUEST_INSTALL_PACKAGES` và `UpdateApkFileProvider`; `res/xml/update_apk_paths.xml` cho phép chia sẻ file trong cache.

Lần đầu trên một thiết bị, Android có thể yêu cầu bật **Cho phép từ nguồn này** cho SportsTV. Đây là bảo vệ bắt buộc của Android. Sau khi cho phép và cài module một lần, các lần sau bấm thẻ sẽ mở trực tiếp.

## Ký APK

- SPORT STREAM tiếp tục dùng keystore riêng cũ để có thể nâng cấp đè lên bản đã cài.
  - Certificate SHA-256: `4044294B7A4EC4A1E88A6EF082EADD7CCD344F9509CE49D4BFF65F00E656216A`
- SportsTV tiếp tục dùng keystore SportsTV cũ.
  - Certificate SHA-256: `B86FA822BA42414127635B5D830CF98855043B892A1480AA2EC446C599C847EA`

Không đổi chữ ký ở các lần build sau. Nếu đổi chữ ký, Android sẽ không cho cập nhật đè và người dùng phải gỡ app.

## Kiểm thử thực tế

Thiết bị: Android TV box `192.168.1.13:5555`, màn hình 1920×1080.

- Cài đè SportsTV version 529: đạt.
- Tình huống module cũ version 11: SportsTV nhận đúng và mở thẳng trình cài đặt cập nhật version 12.
- Sau khi cài version 12, bấm lại SPORT STREAM: mở đúng giao diện TV, không xuất hiện QR/mã kích hoạt của module.
- Mở trận `Hàn Quốc vs Ecuador`: video và audio khởi tạo thành công; decoder đổi độ phân giải lên 1920×1080; không có `FATAL EXCEPTION`.

## Phát hành GitHub

Kho cập nhật: `https://github.com/TNB88/Sport.tv`

- `update.json` phải giữ `version_code` là 529 hoặc cao hơn.
- `apk_url` trỏ trực tiếp tới `SportsTV_5.2.3_BinhPro_SportStreamTV26_v529.apk` trên nhánh `main`.
- Module rời cũng được lưu trong repo để cài thủ công khi cần, nhưng người dùng bình thường chỉ cần cập nhật SportsTV.

## Khi nâng cấp lần sau

1. Tăng version code của module nếu nội dung module thay đổi.
2. Sửa ngưỡng version tương ứng trong `SportStreamClick.smali`.
3. Build, zipalign và ký module bằng đúng chữ ký SPORT STREAM cũ.
4. Chép APK module đã ký vào `assets/sport_stream_tv26.apk` trước khi build SportsTV.
5. Tăng version code/version name của SportsTV.
6. Build, zipalign và ký SportsTV bằng đúng chữ ký SportsTV cũ.
7. Kiểm tra cả hai trường hợp: module chưa cài/module cũ và module mới đã cài.
8. Mở một trận thật, kiểm tra đồng thời video, audio và log crash trước khi cập nhật `update.json`.
