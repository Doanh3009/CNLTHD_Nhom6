# ⚡ TechShop Frontend

Giao diện người dùng cho hệ thống thương mại điện tử TechShop — bán thiết bị công nghệ cao cấp. Xây dựng bằng **React 19 + Vite 8 + Tailwind CSS**.

---

## 📋 Mục lục

- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Cấu hình Backend](#-cấu-hình-backend)
- [Demo & Tài khoản thử nghiệm](#-demo--tài-khoản-thử-nghiệm)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Các trang chính](#-các-trang-chính)
- [Tính năng nổi bật](#-tính-năng-nổi-bật)
- [Build production](#-build-production)

---

## 🖥️ Yêu cầu hệ thống

| Công cụ | Phiên bản tối thiểu |
|---------|-------------------|
| Node.js | **20.19.0** hoặc **≥ 22.12.0** |
| npm | 9+ (đi kèm Node.js) |
| Backend API | Chạy tại `http://localhost:8181` |

> ⚠️ Vite 8 và Rolldown yêu cầu Node.js `^20.19.0 || >=22.12.0`. Kiểm tra phiên bản bằng lệnh `node -v`.

---

## 🚀 Cài đặt

### 1. Clone dự án

```bash
git clone <repository-url>
cd techshop-frontend
```

### 2. Cài đặt dependencies

```bash
npm install
```

---

## ▶️ Chạy ứng dụng

### Chế độ Development (khuyến nghị)

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:5173**

### Các lệnh khác

```bash
npm run build      # Build production
npm run preview    # Preview bản build production
npm run lint       # Kiểm tra lỗi ESLint
```

---

## ⚙️ Cấu hình Backend

File cấu hình API nằm tại `services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8181/api', // Cổng API Gateway
});
```

Nếu Backend của bạn chạy ở cổng khác, hãy thay đổi `baseURL` cho phù hợp.

**Các endpoint Backend cần có:**

| Endpoint | Mô tả |
|----------|-------|
| `POST /api/auth/register` | Đăng ký tài khoản |
| `POST /api/auth/login` | Đăng nhập, trả về JWT token |
| `GET /api/product` | Lấy danh sách sản phẩm |
| `POST /api/order` | Tạo đơn hàng mới |
| `POST /api/chatbot/ask` | Gửi tin nhắn đến AI chatbot |

> 💡 **Không có Backend?** Ứng dụng vẫn chạy được với **dữ liệu mock** gồm 12 sản phẩm mẫu. Mọi tính năng hiển thị đều hoạt động bình thường, chỉ các tính năng cần xác thực (đặt hàng, đăng nhập) mới cần Backend.

---

## 🎮 Demo & Tài khoản thử nghiệm

### Xem giao diện không cần đăng nhập

Bạn có thể duyệt toàn bộ sản phẩm, lọc danh mục, tìm kiếm và dùng AI chat mà **không cần đăng nhập**.

### Tạo tài khoản mới

Truy cập **http://localhost:5173/register** để tạo tài khoản mới với:
- Tên đăng nhập (tối thiểu 3 ký tự)
- Email hợp lệ
- Mật khẩu (tối thiểu 8 ký tự)

### Đăng nhập

Truy cập **http://localhost:5173/login** sau khi đã đăng ký.

>  Mật khẩu tài khoản do người dùng tự tạo qua trang đăng ký. Không có tài khoản mặc định được cài sẵn — hãy **đăng ký tài khoản mới** để trải nghiệm đầy đủ tính năng.

---

## 📁 Cấu trúc thư mục

```
techshop-frontend/
├── src/
│   ├── App.jsx              # Component gốc, chứa toàn bộ routing và logic chính
│   ├── main.jsx             # Entry point
│   └── index.css            # CSS toàn cục
├── components/
│   ├── auth/
│   │   ├── Login.jsx        # Form đăng nhập (legacy)
│   │   └── Register.jsx     # Form đăng ký (legacy)
│   ├── chatbot/
│   │   └── Chatbot.jsx      # Widget chatbot nổi (legacy)
│   ├── layout/
│   │   └── Header.jsx       # Thanh điều hướng (legacy)
│   └── product/
│       └── ProductCard.jsx  # Thẻ sản phẩm (legacy)
├── pages/
│   ├── HomePage.jsx         # Trang chủ (legacy)
│   └── CheckoutPage.jsx     # Trang thanh toán (legacy)
├── services/
│   └── api.js               # Cấu hình Axios, tự động đính kèm JWT token
├── public/
│   └── favicon.svg
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

> 📌 Toàn bộ logic ứng dụng chính (routing, state, pages) đã được tích hợp vào `src/App.jsx`.

---

## 📄 Các trang chính

| Đường dẫn | Mô tả | Cần đăng nhập? |
|-----------|-------|:--------------:|
| `/` | Trang chủ: Hero banner, danh mục, sản phẩm nổi bật | ❌ |
| `/products` | Danh sách sản phẩm với lọc, tìm kiếm, sắp xếp giá | ❌ |
| `/login` | Đăng nhập tài khoản | ❌ |
| `/register` | Đăng ký tài khoản mới | ❌ |
| `/checkout` | Giỏ hàng và thanh toán (2 bước) | ✅ |
| `/chat` | Chat với AI tư vấn sản phẩm | ❌ |

---

##  Tính năng nổi bật

- ** Giỏ hàng thông minh** — Sidebar trượt từ phải, lưu trạng thái với localStorage
- ** Tìm kiếm & Lọc** — Lọc theo danh mục, tìm kiếm theo tên/mô tả, sắp xếp theo giá
- ** AI Chat** — Tích hợp chatbot tư vấn sản phẩm
- ** Xác thực JWT** — Token tự động đính kèm vào mọi request API
- ** Responsive** — Giao diện tối ưu cho mọi kích thước màn hình
- ** Apple-style Design** — Navbar blur, animation mượt, typography chuẩn
- ** Mock Data** — Hoạt động đầy đủ ngay cả khi chưa kết nối Backend

---

##  Build production

```bash
npm run build
```

File build sẽ xuất ra thư mục `dist/`. Dùng lệnh sau để xem trước:

```bash
npm run preview
```

---

## 🛠️ Tech Stack

| Thư viện | Phiên bản | Mục đích |
|----------|-----------|----------|
| React | 19.2.5 | UI framework |
| Vite | 8.0.9 | Build tool & Dev server |
| Tailwind CSS | 3.4.19 | Utility-first CSS |
| Axios | 1.15.1 | HTTP client |
| React Router DOM | 7.14.1 | Client-side routing |

---

