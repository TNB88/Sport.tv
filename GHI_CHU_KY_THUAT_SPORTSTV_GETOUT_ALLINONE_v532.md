# SportsTV + SPORT STREAM + GETOUT All-In-One v532

## File bàn giao

- APK: `SportsTV_5.2.3_BinhPro_SportStream_GetOut_AllInOne_v532.apk`
- Package: `com.sports.tv`
- Version code: `532`
- Version name: `5.2.3-BinhPro.10-AllInOne-GetOut`
- Chữ ký: giữ nguyên chứng thư Bình Pro SportsTV để cập nhật đè và giữ dữ liệu/kích hoạt.

## Nội dung đã ghép

- Thẻ **GETOUT** nằm ngay sau **SPORT STREAM** trên trang danh sách nguồn của SportsTV.
- Toàn bộ giao diện, danh mục, trình phát và thư viện của GETOUT nằm trong cùng APK SportsTV.
- Không cần cài `getout.apk` hay SPORT STREAM thành ứng dụng riêng.
- Activity GETOUT chạy nội bộ dưới package `com.sports.tv`.
- Nút Back thoát trình phát về danh sách GETOUT, sau đó quay về SportsTV.

## Xử lý xung đột kỹ thuật

- Giữ nguyên lớp ứng dụng `com.linor.vn.getout.*` để hạn chế sai lệch logic.
- Đổi namespace các thư viện phụ thuộc của GETOUT sang `go.*` để không đè AndroidX, Kotlin, Media3, OkHttp và các thư viện đang có trong SportsTV.
- Đổi toàn bộ tài nguyên GETOUT sang tiền tố `go_` và cấp ID mới để tránh trùng tài nguyên.
- Khởi tạo Application phụ của GETOUT bằng `GetOutBootstrap` trước khi mở MainActivity.
- Bổ sung Java service descriptors cho Kotlin coroutines, Jackson và các dịch vụ dùng reflection.
- Giữ lại cơ sở Public Suffix của OkHttp để DNS/HTTPS hoạt động đúng.
- Tắt bộ tự cập nhật APK độc lập của GETOUT; bản ghép không chuyển người dùng sang tải/cài app thứ ba.
- Xác nhận chữ ký GETOUT theo chế độ nhúng để không hiện nhầm cảnh báo nâng cấp do APK chủ được ký bằng chứng thư SportsTV.

## Các file vá chính

- `smali/v4.1/k.smali`: thêm loại thẻ GETOUT và dịch vị trí playlist.
- `smali/v4.1/m.smali`: ViewHolder cho thẻ GETOUT.
- `smali_classes3/vn/hpo/sport/GetOutClick.smali`: mở GETOUT nội bộ.
- `smali_classes3/vn/hpo/sport/GetOutBootstrap.smali`: khởi tạo runtime GETOUT.
- `res/layout/item_getout_card.xml`: giao diện thẻ.
- `res/drawable-nodpi/getout_brand.png`: icon thẻ.
- `smali_classes7/com/linor/vn/getout/**`: mã GETOUT và thư viện đã tách namespace.

## Kết quả kiểm thử trên Box R 4K Plus

- Cài cập nhật đè: thành công, không xóa dữ liệu.
- Trang SportsTV: thứ tự `Thêm nguồn -> SPORT STREAM -> GETOUT -> Truyền Hình TV` đúng.
- Mở GETOUT: chạy trong `com.sports.tv/com.linor.vn.getout.MainActivity`.
- Không còn cảnh báo sai `Vui lòng nâng cấp ứng dụng`.
- Danh mục Truyền hình tải được VTV, HTV, THVL, ANTV và các nhóm tin tức.
- Phát VTV1: Media3 khởi tạo video/audio thành công, hình và tiếng hoạt động.
- Back: thoát trình phát về GETOUT rồi trở lại SportsTV.
- Không có `FATAL EXCEPTION` trong log kiểm thử.

## Lưu ý nguồn trực tuyến

- Nội dung bóng đá của GETOUT phụ thuộc máy chủ bên ngoài. Tại thời điểm kiểm thử, `lichphatsong.site` có lúc không phân giải DNS nên tab Bóng đá có thể hiện khung chờ; đây là trạng thái máy chủ nguồn, không phải lỗi ghép APK.
- Danh mục Truyền hình dùng nguồn riêng và đã tải/phát thành công trong cùng lần kiểm thử.

