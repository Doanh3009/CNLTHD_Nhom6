# Hướng dẫn chạy dự án TechShop (Microservices + ReactJS)

Dự án này là một nền tảng thương mại điện tử được xây dựng dựa trên kiến trúc Spring Boot Microservices cho phần Backend và ReactJS (Vite) cho phần Frontend. Hệ thống cũng tích hợp Chatbot AI sử dụng Groq API.

## 🛠 Yêu cầu hệ thống (Prerequisites)
Trước khi khởi chạy dự án, hãy đảm bảo máy của bạn đã cài đặt các công cụ sau:
* **Docker** & **Docker Compose**
* **Java** (JDK 17 trở lên) & **Maven**
* **Node.js** & **npm** (hoặc yarn)
* **GROQ API KEY** (để sử dụng dịch vụ Chatbot AI)

---

## 🚀 Hướng dẫn khởi chạy dự án

### Bước 1: Khởi chạy Backend (Spring Boot Microservices & Infrastructure)

Hệ thống backend bao gồm nhiều service (API Gateway, Discovery Server, Order, Inventory, Product, Auth, Chatbot) cùng với các hạ tầng như Kafka, Postgres, MongoDB, Keycloak, Zipkin, Prometheus và Grafana.

1. **Cấu hình biến môi trường cho Chatbot:**
   Mở terminal và set biến môi trường cho API Key của Groq (bắt buộc để khởi tạo `chatbot-service` thành công):
   * *Windows (PowerShell):* `$env:GROQ_API_KEY="your_api_key_here"`
   * *Mac/Linux:* `export GROQ_API_KEY="your_api_key_here"`

2. **Build các ứng dụng Spring Boot:**
   Mở terminal tại thư mục gốc của dự án và chạy lệnh sau để build mã nguồn và tạo Docker image nội bộ:
   ```bash
   mvn clean package -DskipTests
