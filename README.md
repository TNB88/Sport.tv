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

- Version code: `534`
- Version name: `5.2.3-BinhPro.12-GETOUT-RealServers`
- Tệp cập nhật chính: `SportsTV_5.2.3_BinhPro_v534_GETOUT_RealServers_AllInOne.apk`
- SHA-256 SportsTV: `57E1980F8A790EF3D403B5AE326B6F484B47BE17F2F5940DAB297AD95AB82FEB`
- Package duy nhất: `com.sports.tv`
- Nội dung: SPORT STREAM TV 2.6 và GETOUT đều chạy trực tiếp bên trong SportsTV. Không cài app riêng, không xin quyền cài ứng dụng không rõ nguồn gốc và không có kích hoạt thứ hai. Giữ nguyên Film Activation, Cloudflare Worker, VietAnhTV, cache danh sách tức thời và các bản vá phát kênh của SportsTV.

## Cách mở SPORT STREAM

1. Cập nhật SportsTV lên bản 534.
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

## SPORT STREAM server thật v534

- Worker catalog version 5 lấy dữ liệu riêng theo từng hệ thống của GETOUT, không
  còn nhân một danh sách thành nhiều tên server.
- Đang hỗ trợ: Chuối Chiên, Bông Lau, COLA TV, Gà Vàng 33, Giờ Vàng, SoCoLive,
  Khán Đài và Xôi Lạc.
- Server hỏng hoặc không có dữ liệu tự ẩn; khi upstream hoạt động lại sẽ tự hiện.
- Bổ sung logo Khán Đài, SoCoLive nền trong suốt, Bông Lau và logo bóng đá chung
  trong thư mục `provider-icons`.
- SPORT STREAM TV, SPORT STREAM Mobile và bản tích hợp trong SportsTV đều nhận
  provider mới từ Worker, không bị whitelist tên server cũ.
- Mã nguồn Worker bàn giao tại `cloudflare-worker`; URL Worker cũ được giữ nguyên
  để mọi APK đang dùng không bị gián đoạn.

## APK độc lập kèm theo

- `SPORT_STREAM_TV_2.6_BinhPro_GETOUT_RealServers_FilmActivation.apk`
- `SPORT_STREAM_Mobile_2.6_BinhPro_GETOUT_RealServers_FilmActivation.apk`
