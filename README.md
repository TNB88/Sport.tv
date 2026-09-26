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

- Version code: `536`
- Version name: `5.2.3-BinhPro.14-ProviderOrder`
- Tệp cập nhật chính: `SportsTV_5.2.3_BinhPro_v536_ProviderOrder_TransparentLogos.apk`
- SHA-256 SportsTV: `756DBA12A406582EB0BAD4774ABE040BE33486FF211EDE2E0380C2564DC8B852`
- Package duy nhất: `com.sports.tv`
- Nội dung: SPORT STREAM TV 2.6 và GETOUT đều chạy trực tiếp bên trong SportsTV. Không cài app riêng, không xin quyền cài ứng dụng không rõ nguồn gốc và không có kích hoạt thứ hai. Giữ nguyên Film Activation, Cloudflare Worker, VietAnhTV, cache danh sách tức thời và các bản vá phát kênh của SportsTV.

## Cách mở SPORT STREAM

1. Cập nhật SportsTV lên bản 536.
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

## SPORT STREAM server thật v536 / Worker football-only v15

- Worker catalog version 15 lấy dữ liệu riêng theo từng hệ thống của GETOUT, không
  còn nhân một danh sách thành nhiều tên server.
- Catalog chỉ nhận bóng đá. Đã loại bóng rổ, eSports, bóng chuyền, võ thuật và bỏ
  hoàn toàn dữ liệu M3U Truyền Hình/Thanh TV khỏi màn SPORT STREAM.
- Đang có dữ liệu thật: Chuối Chiên, Bông Lau, COLA TV, Giờ Vàng, SoCoLive và
  Xôi Lạc. Gà Vàng 33 chỉ hiện khi API thật có trận.
- Server hỏng hoặc không có dữ liệu tự ẩn; khi upstream hoạt động lại sẽ tự hiện.
- Bổ sung logo Khán Đài, SoCoLive nền trong suốt, Bông Lau và logo bóng đá chung
  trong thư mục `provider-icons`.
- SPORT STREAM TV, SPORT STREAM Mobile và bản tích hợp trong SportsTV đều nhận
  provider mới từ Worker, không bị whitelist tên server cũ.
- Toàn bộ lịch upstream được giữ lại, không còn giới hạn tạm 3 trận mỗi nguồn.
  Cờ/logo hai đội được tải nền; không quét bitmap trên UI thread nên danh sách dài
  không làm ứng dụng treo ở màn hình mở.
- Thứ tự hiển thị từ xa: Xôi Lạc, Giờ Vàng, COLA TV, Chuối Chiên, SoCoLive và
  Bông Lau ở cuối. Provider đang lỗi hoặc không có dữ liệu vẫn tự ẩn.
- Chuối Chiên và Bông Lau dùng endpoint lịch bóng đá đầy đủ. Không dùng
  `type=blv` vì tham số đó chỉ trả 2-3 trận đã có link. Trận chưa tới giờ hiện
  **Chờ BLV**; khi bấm, resolver lấy lại link mới được công bố gần giờ đá.
- SoCoLive dùng `matches.json` thay cho feed đề xuất ngắn, hiện khoảng 85 trận
  có `roomNum`/BLV thật. `match_recommend.json` và `all_live_rooms.json` được
  ghép để đánh dấu trận live và bổ sung phòng, không tạo server hoặc trận giả.
- Bản v536 giữ đúng thứ tự Worker thay vì tự sắp alphabet. Logo HTTPS của
  SoCoLive/Bông Lau được tải nền và không còn rơi về ô chữ viết tắt nền đỏ.
- Mã nguồn Worker bàn giao tại `cloudflare-worker`; URL Worker cũ được giữ nguyên
  để mọi APK đang dùng không bị gián đoạn.

## APK độc lập kèm theo

- `SPORT_STREAM_TV_2.6_BinhPro_GETOUT_RealServers_FilmActivation.apk`
- `SPORT_STREAM_Mobile_2.6_BinhPro_GETOUT_RealServers_FilmActivation.apk`
- SHA-256 TV: `0695F6F845FAC2BB5C3115DCCF0D1D3C5152395BF3D70C1FD9345D67271D8708`
- SHA-256 Mobile: `19369AC52E7C5C07396F4FA91ADA125375A24C20811DA2B28BCE3D41A4615EF3`
