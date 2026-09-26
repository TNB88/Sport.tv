# Bình Pro SportsTV + SPORT STREAM Worker

Worker cố định: `https://sportstv-playlists.tongbinhnguyen9090.workers.dev`

## SportsTV cũ (giữ tương thích)

- `/v1/config`
- `/v1/playlist/truyen-hinh`
- `/v1/playlist/thanh-tv`
- `/v1/playlist/vietanh-tv`

Các URL thật nằm trong biến `SOURCES`. Muốn thay link thì sửa `upstream`; muốn tắt
nguồn thì đổi `enabled` thành `false`.

## SPORT STREAM Mobile 2.6

- Danh sách trận: `/v1/sport-stream/catalog`
- Lấy link mới khi bấm xem: `/v1/sport-stream/resolve`
- Cấu hình app: `/v1/sport-stream/config`

Nguồn chính là API lịch trận bóng đá. Link phát có thời hạn nên Worker luôn gọi lại
API khi người dùng bấm một trận. Nếu API lỗi, Worker tự chuyển sang các nhóm bóng đá
COLA TV/Gà Vàng/Khán Đài trong M3U dự phòng.

Domain Xôi Lạc được quản lý từ xa tại:

`https://github.com/TNB88/Sport.tv/blob/main/sport-stream-domains.json`

Đổi domain bằng cách đặt domain mới ở đầu mảng `referers`. Không đổi URL Worker và
không cần build lại APK. Worker đọc lại cấu hình sau tối đa khoảng 5 phút. Danh sách
domain tích hợp sẵn trong `worker.js` luôn được giữ làm dự phòng nếu GitHub lỗi.

## Bố cục nhà cung cấp TV (catalog version 7)

Worker lấy dữ liệu riêng theo kiến trúc thật của GETOUT, không nhân một danh sách
thành nhiều server giả. Các nguồn đang hoạt động gồm Chuối Chiên, Bông Lau,
COLA TV, Gà Vàng 33, Giờ Vàng, SoCoLive, Khán Đài và Xôi Lạc. Phá Làng TV/Xôi
Chè vẫn có định nghĩa dự phòng nhưng chỉ hiện khi playlist thật trả dữ liệu.

Mỗi provider có resolver riêng và Worker chỉ trả link mới khi người dùng bấm xem.
Provider lỗi hoặc rỗng tự ẩn khỏi giao diện; khi upstream hoạt động lại sẽ tự hiện,
không cần sửa APK. Bản APK từ ngày 2026-09-26 đã bỏ whitelist cố định nên nhận
được provider mới từ Worker.

Logo provider được lưu ở GitHub:

- `provider-icons/khandai-logo.webp`
- `provider-icons/socolive-logo-transparent.png` (đã tách nền alpha)
- `provider-icons/bonglau-logo.png`
- `provider-icons/football-logo.png` (logo bóng đá chung, dự phòng)

Không đổi các ID hiện có. Nếu thêm server mới, thêm provider vào Worker, tạo hàng
catalog/resolver tương ứng và để icon bằng URL HTTPS ổn định.
