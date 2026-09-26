# GHI CHÚ KỸ THUẬT — SPORT STREAM / SportsTV GETOUT REAL SERVERS

Ngày hoàn thiện: 2026-09-26  
Người quản lý: Bình Pro

## 1. Bộ APK bàn giao

### SportsTV tích hợp tất cả — bản mới nhất

- Tệp: `SportsTV_5.2.3_BinhPro_v535_FullSchedule_AsyncLogos.apk`
- Package: `com.sports.tv`
- Version code: `535`
- Version name: `5.2.3-BinhPro.13-FullSchedule`
- SHA-256: `91BE86BCF0D7724C956B44AAB3920547DCC628683D7680D5794947A654AD0C9E`
- Chứng thư ký SHA-256: `B86FA822BA42414127635B5D830CF98855043B892A1480AA2EC446C599C847EA`

### SPORT STREAM TV độc lập

- Tệp: `SPORT_STREAM_TV_2.6_BinhPro_GETOUT_RealServers_FilmActivation.apk`
- Package: `com.vxm.sport.mobile`
- Version code: `15`
- Version name: `2.6-BinhPro-Adaptive1080-BLV-TV-Activation`
- SHA-256: `8046B8A6DD1D2E7388CF6A87705A57A6772DBCF613430DB10E96B56369CCB7AC`
- Chứng thư ký SHA-256: `4044294B7A4EC4A1E88A6EF082EADD7CCD344F9509CE49D4BFF65F00E656216A`

### SPORT STREAM Mobile độc lập

- Tệp: `SPORT_STREAM_Mobile_2.6_BinhPro_GETOUT_RealServers_FilmActivation.apk`
- Package: `com.vxm.sport.mobile`
- Version code: `14`
- Version name: `2.6-BinhPro-Adaptive1080-BLV-Mobile`
- SHA-256: `591A2E979B82DBC9E029852C1F0A421935EF1FA9B3E4EF2DD47882F6E3B01421`
- Chứng thư ký SHA-256: `4044294B7A4EC4A1E88A6EF082EADD7CCD344F9509CE49D4BFF65F00E656216A`

Hai APK SPORT STREAM TV và Mobile cùng package, vì vậy chỉ cài một bản phù hợp
thiết bị. Bản TV code 15 cao hơn bản Mobile code 14.

## 2. Cloudflare Worker giữ nguyên URL

URL cố định:

`https://sportstv-playlists.tongbinhnguyen9090.workers.dev`

Không đổi URL này vì SportsTV và các APK cũ đang sử dụng. Bản triển khai hoàn tất:

- Worker health version: `13`
- Deployment version ID: `4c80d9ae-5546-4c8a-b25a-7603dbc6e47e`
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
| Xôi Lạc | `xoilacxth` | API lịch bóng đá + referer quản lý từ xa |

`Khán Đài`, `Phá Làng TV` và `Xôi Chè` vẫn có ID/ảnh dự phòng nhưng không được
lấy từ playlist Truyền Hình hoặc Thanh TV nữa. Chúng chỉ được hiện lại khi có
adapter API GETOUT riêng trả đúng trận bóng đá. Provider lỗi/rỗng tự ẩn.

### Khóa football-only ở Worker version 6

- Bỏ hoàn toàn `fetchM3uRows()` khỏi luồng dựng catalog SPORT STREAM. Ba playlist
  Truyền Hình, Thanh TV và VietAnhTV vẫn hoạt động ở màn hình riêng, không còn
  bị trộn thành trận/BLV của GETOUT.
- Giờ Vàng bắt buộc `match.type == football`; loại `basketball`, `esport`,
  `bongchuyen`, `bongchay` và `vothuat`.
- Mỗi adapter API gắn `sport: football`; tầng dựng catalog kiểm tra lần cuối và
  bỏ mọi dòng không phải bóng đá.
- `home_logo` và `away_logo` chỉ nhận URL HTTPS hợp lệ, giữ đúng thứ tự đội nhà
  và đội khách. APK đã có tag kiểm tra ảnh tải bất đồng bộ nên không gắn ảnh trễ
  vào nhầm ô.

Tại thời điểm kiểm thử Worker trả 6 provider có dữ liệu thật; số trận thay đổi theo
upstream (lần kiểm tra Worker v13 trả 148 trận bóng đá):
Chuối Chiên, Bông Lau, COLA TV, Giờ Vàng, SoCoLive và Xôi Lạc. Resolver mẫu của
cả 6 provider đều trả nguồn. Gà Vàng 33 tự ẩn vì API thật đang không có trận.

Worker không còn giới hạn tạm 3 trận mỗi provider. Thứ tự từ xa là: Xôi Lạc,
Giờ Vàng, COLA TV, Chuối Chiên, SoCoLive, rồi Bông Lau cuối cùng. Provider lỗi
hoặc rỗng vẫn tự ẩn nên thứ tự thực tế chỉ gồm các nguồn đang hoạt động.

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

### Bản vá ANR khi trả toàn bộ lịch và logo đội

Nguyên nhân treo/out không phải do Worker mất trận. `MainActivity.r(...)` đọc file
logo đã cache bằng `BitmapFactory.decodeFile` ngay trên UI thread; sau đó
`MainActivity.J(Bitmap)` còn quét từng pixel để cắt nền. Khi gần 80 thẻ trở lên,
box 32-bit có thể báo ANR trong lúc dựng danh sách.

Bản v535 và hai APK độc lập mới xử lý như sau:

- File cache cũng được chuyển qua executor tải ảnh nền có sẵn trong app.
- `J(Bitmap)` trả lại bitmap đã chuẩn bị, không quét toàn bộ pixel trên UI thread.
- Vẫn giữ tag URL trên `ImageView`, tránh ảnh tải trễ gắn nhầm trận.
- Worker trả toàn bộ lịch thật và đủ `home_logo`/`away_logo`; không thay bằng icon
  quả bóng chung.

Các file đã vá:

- TV độc lập: `sportstream_tv26_activation_20260925/smali/com/vxm/sport/mobile/MainActivity.smali`
- Mobile: `sportstream_26_adaptive1080_20260925/mobile/smali/com/vxm/sport/mobile/MainActivity.smali`
- SportsTV nhúng: `sportstv_v532_getout_allinone_20260925/decoded/smali_classes4/com/vxm/sport/mobile/MainActivity.smali`

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

`update.json` của bản 535:

- `enabled`: `true`
- `version_code`: `535`
- `version_name`: `5.2.3-BinhPro.13-FullSchedule`
- `apk_url`: URL raw tới APK `SportsTV_5.2.3_BinhPro_v535_FullSchedule_AsyncLogos.apk`
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

- Worker `/health`: version 13.
- Catalog: 6 provider có dữ liệu thật, 148 trận tại thời điểm kiểm tra; số lượng
  thay đổi theo upstream và không còn bị cắt xuống 3 trận mỗi nguồn.
- Cả 148 thẻ kiểm tra đều có `home_logo` và `away_logo`; thứ tự provider đúng yêu cầu.
- Kiểm tra `bad_count=0`: không còn bóng rổ, eSports, bóng chuyền, võ thuật hoặc
  thẻ BLV lấy từ playlist truyền hình.
- Gọi resolver mẫu của cả 6 provider: đều có nguồn.
- Cài đè SportsTV v534 trên Box R 4K Plus qua ADB: thành công, giữ dữ liệu.
- SportsTV mở danh sách chính và mục SPORT STREAM nhúng không crash.
- Catalog SPORT STREAM hiển thị nhóm provider động; logcat không có
  `FATAL EXCEPTION` của app trong ca kiểm thử.
- Chọn một trận SoCoLive bằng remote mở đúng bảng **Chọn bình luận viên**, hiển
  thị các nguồn CACAO, BLV PEWPEW, A PÁO với HLS/FLV riêng.
- Ba APK: zipalign đạt; chữ ký v1/v2/v3 đạt.

Việc phát hình còn phụ thuộc trận đang live và upstream tại thời điểm bấm. Resolver
được thiết kế lấy link mới ngay lúc chọn trận để hạn chế link hết hạn.

### Sửa Bông Lau và Chuối Chiên không phát ngày 2026-09-26

Nguyên nhân không nằm ở URL HLS: CDN còn hoạt động nhưng trả HTTP `403` vì resolver
dùng Referer của trang danh sách thay cho Referer riêng của máy phát. Hai provider
cũng yêu cầu User-Agent desktop giống GETOUT.

Worker version 13 tiếp tục giữ bản sửa phát từ version 7 như sau:

- Chuối Chiên đọc `liveStreamUrl` từ trang chủ đang hoạt động và dùng giá trị này
  làm `Referer` khi phát.
- Bông Lau đọc `playerBaseUrl` từ trang chủ đang hoạt động và dùng giá trị này làm
  `Referer` khi phát.
- Dùng User-Agent Chrome desktop 116; không gửi `Origin` thừa.
- Nếu không đọc được trang chủ, lấy domain máy phát sau dấu `|` trong cấu hình
  dự phòng GETOUT trên GitHub; cuối cùng mới dùng giá trị an toàn tích hợp sẵn.
- Giữ nguyên Worker URL nên cả ba APK nhận bản sửa từ xa, không cần build/cài lại.

Đã kiểm tra trực tiếp cả hai provider: resolver trả 2 nguồn HD/FHD, manifest FHD
HTTP `200`, tải thử 4096 byte của segment video HTTP `206`. Version triển khai
Cloudflare mới nhất: `4c80d9ae-5546-4c8a-b25a-7603dbc6e47e`.

## 10. Quy trình build lại ngắn gọn

1. Sửa source/smali cần thiết.
2. Tăng version code cho bản có cập nhật từ xa.
3. Build bằng Apktool 3.0.3 (`-f` khi đổi version trong `apktool.yml`).
4. `zipalign -P 16 -f 4`.
5. Ký đúng keystore cũ; không ghi mật khẩu vào tài liệu hoặc GitHub.
6. Kiểm tra `aapt dump badging`, `zipalign -c` và `apksigner verify --print-certs`.
7. Cài đè bằng ADB và test catalog, chọn nguồn, Back, tắt/mở lại app.
8. Cập nhật APK + `update.json` trên GitHub, sau đó kiểm tra URL raw trả HTTP 200.
