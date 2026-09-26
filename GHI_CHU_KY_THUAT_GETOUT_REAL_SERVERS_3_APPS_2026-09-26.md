# GHI CHÚ KỸ THUẬT — SPORT STREAM / SportsTV GETOUT REAL SERVERS

Ngày hoàn thiện: 2026-09-26  
Người quản lý: Bình Pro

## 1. Bộ APK bàn giao

### SportsTV tích hợp tất cả

- Tệp: `SportsTV_5.2.3_BinhPro_v534_GETOUT_RealServers_AllInOne.apk`
- Package: `com.sports.tv`
- Version code: `534`
- Version name: `5.2.3-BinhPro.12-GETOUT-RealServers`
- SHA-256: `57E1980F8A790EF3D403B5AE326B6F484B47BE17F2F5940DAB297AD95AB82FEB`
- Chứng thư ký SHA-256: `B86FA822BA42414127635B5D830CF98855043B892A1480AA2EC446C599C847EA`

### SPORT STREAM TV độc lập

- Tệp: `SPORT_STREAM_TV_2.6_BinhPro_GETOUT_RealServers_FilmActivation.apk`
- Package: `com.vxm.sport.mobile`
- Version code: `15`
- Version name: `2.6-BinhPro-Adaptive1080-BLV-TV-Activation`
- SHA-256: `5A7E0E0247A6866DC03E6D419D9FE0081674825791AA0BB1CD34919203AC4869`
- Chứng thư ký SHA-256: `4044294B7A4EC4A1E88A6EF082EADD7CCD344F9509CE49D4BFF65F00E656216A`

### SPORT STREAM Mobile độc lập

- Tệp: `SPORT_STREAM_Mobile_2.6_BinhPro_GETOUT_RealServers_FilmActivation.apk`
- Package: `com.vxm.sport.mobile`
- Version code: `14`
- Version name: `2.6-BinhPro-Adaptive1080-BLV-Mobile`
- SHA-256: `7A958155660FE1E71D80C939F336A56A325269C0DDA68515BD133157D335A54F`
- Chứng thư ký SHA-256: `4044294B7A4EC4A1E88A6EF082EADD7CCD344F9509CE49D4BFF65F00E656216A`

Hai APK SPORT STREAM TV và Mobile cùng package, vì vậy chỉ cài một bản phù hợp
thiết bị. Bản TV code 15 cao hơn bản Mobile code 14.

## 2. Cloudflare Worker giữ nguyên URL

URL cố định:

`https://sportstv-playlists.tongbinhnguyen9090.workers.dev`

Không đổi URL này vì SportsTV và các APK cũ đang sử dụng. Bản triển khai hoàn tất:

- Worker health version: `5`
- Deployment version ID: `66c6e450-4cc3-46e9-b388-2acad33f9383`
- Nguồn local: `C:\SportTV\work\sportstv-playlists-worker\worker.js`
- Bản sao GitHub: `cloudflare-worker/worker.js`

Các endpoint:

- `/health`
- `/v1/sport-stream/catalog`
- `/v1/sport-stream/config`
- `/v1/sport-stream/resolve?match=...&provider=...`
- `/v1/config`
- `/v1/playlist/truyen-hinh`
- `/v1/playlist/thanh-tv`
- `/v1/playlist/vietanh-tv`

## 3. Logic server thật theo GETOUT

Worker không còn tạo nhiều hàng server từ cùng một danh sách giả. Mỗi provider có
nguồn lấy lịch và resolver riêng:

| Provider | ID | Nguồn/logic |
|---|---|---|
| Chuối Chiên | `chuoichien` | API Chuối Chiên, trường `blvs` |
| Bông Lau | `bonglau` | API Chuối Chiên, trường riêng `blvs_bonglau` |
| COLA TV | `colatv` | Cụm API COLA và danh sách BLV riêng |
| Gà Vàng 33 | `gavang33` | Đọc API base từ cấu hình GETOUT rồi resolve trận |
| Giờ Vàng | `giovang` | API lịch + API chi tiết trận Giờ Vàng |
| SoCoLive | `socolive` | Lịch JSON/JSONP và room detail riêng |
| Khán Đài | `khandai` | Nhóm kênh thật trong M3U |
| Xôi Lạc | `xoilacxth` | API lịch bóng đá + referer quản lý từ xa |

`Phá Làng TV` và `Xôi Chè` vẫn có ID dự phòng trong Worker nhưng không hiện khi
không có dữ liệu thật. Quy tắc chung: provider lỗi/rỗng tự ẩn, khi upstream hoạt
động lại sẽ tự xuất hiện.

Tại thời điểm kiểm thử Worker trả 8 provider, khoảng 110–112 trận. Resolver của cả
8 provider đều trả ít nhất một nguồn; SoCoLive trả nhiều BLV/stream nhất tùy trận.

## 4. Logo nhà cung cấp

Logo provider mới:

- `provider-icons/khandai-logo.webp`
- `provider-icons/socolive-logo-transparent.png` (tách nền alpha từ ảnh gốc)
- `provider-icons/bonglau-logo.png` (Bông Lau + bóng đá)
- `provider-icons/football-logo.png` (logo bóng đá chung, chưa gán provider)

Worker trả URL raw GitHub trong trường `providers[].icon`. APK tự tải logo HTTPS.
Không đổi tên/xóa tệp đang dùng nếu chưa cập nhật URL trong Worker.

## 5. Bản vá APK để nhận provider mới

SPORT STREAM cũ có whitelist ID provider. Bản mới buộc kết quả kiểm tra whitelist
thành hợp lệ tại hai nhánh dựng catalog, nhờ đó provider mới từ Worker không bị
lọc bỏ.

### TV độc lập

`C:\SportTV\work\sportstream_tv26_activation_20260925\smali\com\vxm\sport\mobile\MainActivity.smali`

### Mobile độc lập

`C:\SportTV\work\sportstream_26_adaptive1080_20260925\mobile\smali\com\vxm\sport\mobile\MainActivity.smali`

### SPORT STREAM nhúng trong SportsTV

`C:\SportTV\work\sportstv_v532_getout_allinone_20260925\decoded\smali_classes4\com\vxm\sport\mobile\MainActivity.smali`

Tìm chú thích:

`Bình Pro: provider catalog is remote/dynamic; do not drop new GETOUT ids.`

Không vá nhầm các lệnh `Set.contains` khác. Chỉ hai vị trí nằm trong luồng dựng
nhóm provider của hàm catalog.

## 6. Film Activation

Lần sửa này không thay URL Apps Script, app ID, session hoặc logic kích hoạt. Thư
viện Film Activation hiện có được giữ nguyên. Không được xóa dữ liệu/ngắt khóa để
test UI. Khi làm app mới phải tuân thủ tài liệu:

`work/BinhProActivationAdmin/apps-script/GHI_NHO_BAT_BUOC_KHI_THEM_APP_MOI_FILM_ACTIVATION.md`

Đặc biệt phải kiểm thử trường hợp admin duyệt session cũ nhưng APK đang poll
session mới cùng app + device; `register` không ghi đè trạng thái đã duyệt; license
phải còn sau khi tắt/mở; revoke không được để session trùng tự kích hoạt lại.

## 7. Cập nhật SportsTV từ GitHub

Kho:

`https://github.com/TNB88/Sport.tv`

`update.json` của bản 534:

- `enabled`: `true`
- `version_code`: `534`
- `version_name`: `5.2.3-BinhPro.12-GETOUT-RealServers`
- `apk_url`: URL raw tới APK v534
- `required`: `false`

Lần sau phát hành phải tăng `version_code`; chỉ đổi tên tệp APK mà không tăng mã
thì app đang cài sẽ không báo cập nhật.

## 8. Khi domain/server đổi

Nếu chỉ domain/API upstream đổi, sửa Worker hoặc `sport-stream-domains.json`, triển
khai lại cùng Worker URL; không cần sửa APK. Chỉ phải build APK khi thay giao diện,
player, quyền, package, chữ ký hoặc cấu trúc JSON mà app không còn hiểu.

Xôi Lạc đọc domain theo thứ tự trong:

`https://raw.githubusercontent.com/TNB88/Sport.tv/main/sport-stream-domains.json`

Đặt domain mới lên đầu `referers`, giữ domain cũ phía sau làm dự phòng.

## 9. Kiểm thử đã thực hiện

- Worker `/health`: version 5.
- Catalog: 8 provider hoạt động.
- Gọi resolver mẫu của cả 8 provider: đều có nguồn.
- Cài đè SportsTV v534 trên Box R 4K Plus qua ADB: thành công, giữ dữ liệu.
- SportsTV mở danh sách chính và mục SPORT STREAM nhúng không crash.
- Catalog SPORT STREAM hiển thị nhóm provider động; logcat không có
  `FATAL EXCEPTION` của app trong ca kiểm thử.
- Chọn một trận SoCoLive bằng remote mở đúng bảng **Chọn bình luận viên**, hiển
  thị các nguồn CACAO, BLV PEWPEW, A PÁO với HLS/FLV riêng.
- Ba APK: zipalign đạt; chữ ký v1/v2/v3 đạt.

Việc phát hình còn phụ thuộc trận đang live và upstream tại thời điểm bấm. Resolver
được thiết kế lấy link mới ngay lúc chọn trận để hạn chế link hết hạn.

## 10. Quy trình build lại ngắn gọn

1. Sửa source/smali cần thiết.
2. Tăng version code cho bản có cập nhật từ xa.
3. Build bằng Apktool 3.0.3 (`-f` khi đổi version trong `apktool.yml`).
4. `zipalign -P 16 -f 4`.
5. Ký đúng keystore cũ; không ghi mật khẩu vào tài liệu hoặc GitHub.
6. Kiểm tra `aapt dump badging`, `zipalign -c` và `apksigner verify --print-certs`.
7. Cài đè bằng ADB và test catalog, chọn nguồn, Back, tắt/mở lại app.
8. Cập nhật APK + `update.json` trên GitHub, sau đó kiểm tra URL raw trả HTTP 200.
