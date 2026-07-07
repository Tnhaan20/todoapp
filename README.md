# ✅ My Tasks — Ứng dụng To-Do

Ứng dụng quản lý công việc gọn gàng, đầy đủ tính năng, xây dựng với **Vite + React + TypeScript + Tailwind CSS v4**.
Toàn bộ dữ liệu được lưu trữ trong `localStorage` của trình duyệt — không cần backend.

---

## 🚀 Bắt đầu

### Yêu cầu

Đảm bảo bạn đã cài đặt các công cụ sau:

| Công cụ | Phiên bản |
|---------|-----------|
| [Node.js](https://nodejs.org/) | v18 trở lên |
| npm | v9 trở lên (đi kèm với Node.js) |

### Cài đặt & Chạy

```bash
# 1. Clone repo và di chuyển vào thư mục dự án
git clone https://github.com/Tnhaan20/todoapp.git && cd todoapp

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Khởi động server phát triển
npm run dev
```

Sau đó mở trình duyệt tại **[http://localhost:5173](http://localhost:5173)**

### Build cho Production

```bash
# Biên dịch và đóng gói cho production
npm run build

# Xem trước bản build production ở local
npm run preview
```

---

## 🐳 Chạy với Docker

Đảm bảo đã cài [Docker](https://www.docker.com/), sau đó:

```bash
# Build và khởi động container
docker compose up --build
```

Sau đó mở trình duyệt tại **[http://localhost:3000](http://localhost:3000)**

```bash
# Dừng container
docker compose down
```

Image được build theo 2 giai đoạn:
1. **Builder** — Node 20 Alpine cài dependencies và chạy `npm run build`
2. **Runner** — Node 20 Alpine dùng `serve` để phục vụ thư mục `dist/` trên cổng `3000`

---

## ✨ Tính năng

| Tính năng | Chi tiết |
|-----------|----------|
| **Thêm công việc** | Tiêu đề (bắt buộc) + ghi chú/mô tả (tùy chọn) |
| **Chỉnh sửa công việc** | Chỉnh sửa trực tiếp — tiêu đề, nội dung, độ ưu tiên, deadline |
| **Xóa công việc** | Có hộp thoại xác nhận để tránh xóa nhầm |
| **Hoàn thành công việc** | Bật/tắt hoàn thành; công việc đã hoàn thành không thể chỉnh sửa |
| **Mức độ ưu tiên** | Không có / Trung bình / Cao — hiển thị badge màu sắc |
| **Deadline** | Đặt deadline cho từng công việc; badge hiển thị Quá hạn / Sắp đến hạn / Còn thời gian |
| **Cảnh báo deadline** | Toast trong app + thông báo trình duyệt khi đến hạn |
| **Lọc** | Xem Tất cả / Đang làm / Đã hoàn thành |
| **Lưu trữ** | Tất cả công việc tự động lưu vào `localStorage` |
| **Cập nhật trực tiếp** | Badge deadline tự động làm mới mỗi phút |

---

## 🗂️ Cấu trúc dự án

```
src/
├── types/
│   └── task.ts                  # Interface Task & các kiểu dùng chung (Priority, FilterType, ...)
│
├── utils/
│   ├── date.ts                  # now(), formatDate(), formatDeadline(), getDeadlineStatus()
│   └── storage.ts               # loadFromStorage(), saveToStorage(), schema migration
│
├── hooks/
│   ├── useTasks.ts              # Logic CRUD chính + lưu trữ localStorage
│   ├── useToast.ts              # Hàng đợi Toast (thêm / tự ẩn / xóa)
│   └── useDeadlineAlarm.ts      # Polling deadline + thông báo trình duyệt
│
├── components/
│   ├── TaskInput/               # Form thêm công việc (tiêu đề, nội dung, deadline, độ ưu tiên)
│   ├── FilterTabs/              # Nút lọc Tất cả / Đang làm / Đã hoàn thành
│   ├── TaskList/                # Hiển thị danh sách công việc hoặc trạng thái rỗng
│   ├── TaskItem/                # Card công việc (xem + chỉnh sửa trực tiếp)
│   ├── ConfirmDialog/           # Modal xác nhận có thể tái sử dụng
│   └── Toast/                   # Toast thông báo slide-in + container
│
├── App.tsx                      # Root — kết nối tất cả hooks và components
├── main.tsx                     # Điểm vào React
└── index.css                    # Tailwind v4 import + custom keyframes
```

---

## 🛠️ Công nghệ sử dụng

| Tầng | Công nghệ |
|------|-----------|
| Framework | [React 19](https://react.dev/) |
| Build tool | [Vite 8](https://vite.dev/) |
| Ngôn ngữ | TypeScript |
| Giao diện | [Tailwind CSS v4](https://tailwindcss.com/) |
| Lưu trữ | `localStorage` của trình duyệt |
| Thông báo | [Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API) |
| Container | [Docker](https://www.docker.com/) + `serve` |

---

## 📦 Các lệnh có sẵn

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Khởi động server phát triển tại `localhost:5173` |
| `npm run build` | Build bundle production tối ưu vào `dist/` |
| `npm run preview` | Chạy thử bản build production ở local |
| `npm run lint` | Chạy ESLint |

---

## 🔔 Lưu ý về Cảnh báo Deadline

- App sẽ **yêu cầu quyền thông báo trình duyệt** lần đầu tải trang.
- Deadline được kiểm tra **mỗi 30 giây** trong nền.
- Khi deadline của một công việc đến, bạn sẽ thấy **toast trong app** và **thông báo trình duyệt**.
- Mỗi công việc chỉ cảnh báo **một lần mỗi phiên**. Nếu bạn chỉnh sửa deadline, cảnh báo sẽ tự reset.
- Thông báo vẫn xuất hiện ngay cả khi bạn đang ở tab trình duyệt khác.
