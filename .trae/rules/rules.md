Ngôn ngữ & phản hồi: bắt buộc bằng tiếng Việt.
Khi sinh code:
Comment tiếng Việt ngắn gọn cho logic chính, đoạn khó hiểu.
Nếu code >20 dòng →tách hàm/gom logic, tránh code dài.
Coding standards
Tránh clone/copy object không cần thiết.
Tránh nesting sâu, ưu tiên return sớm.
Dùng cơ chế đồng thời phù hợp (async,lock,atomic…).
Không viết code ngoài phạm vi yêu cầu.
Refactoring
Luôn xác nhận lại giải pháp - cần phê duyệt trước khi code
Không thay đổi hành vi nếu không được yêu cầu.
Đảm bảo có test trước refactor, chạy test sau mỗi thay đổi.
Giữ code luôn ở trạng thái chạy được.
Readability
Tên biến/hàm mô tả rõ ràng, theo convention dự án.
Tránh viết tắt, trừ i, j trong loop.
Mỗi hàm chỉ làm một việc.
Public API phải có documentation.
Performance
Dùng cấu trúc dữ liệu phù hợp,tránh tạo object dư thừa, tính toán lặp, chú ý memory leak.
Áp dụng lazy evaluation khi có thể.
Chỉ đồng bộ khi thật sự cần, đảm bảo thread safety.