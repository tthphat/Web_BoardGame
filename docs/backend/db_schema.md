# 📘 Database Schema – Web Board Game System

## 1. Overview

Hệ thống Web Board Game sử dụng cơ sở dữ liệu **PostgreSQL (Supabase)** để quản lý người dùng, game, ván chơi, đánh giá và các chức năng mở rộng.  
Database được thiết kế theo hướng **tổng quát hóa board game**, cho phép nhiều trò chơi dùng chung một Board component mà không cần thay đổi cấu trúc dữ liệu.

---

## 2. Design Principles

- Phân tách rõ ràng giữa **User – Game – Game Session**
- Không tạo bảng riêng cho từng game
- Trạng thái game được lưu dưới dạng **JSONB**
- Hỗ trợ mở rộng game mới mà không thay đổi schema
- Phân quyền rõ ràng giữa **user** và **admin**

---

## 3. Tables Description

### 3.1 `users`

Lưu thông tin người dùng và phân quyền hệ thống.

| Column | Type | Description |
|------|------|------------|
| id | UUID (PK) | Định danh người dùng |
| username | VARCHAR | Tên đăng nhập (unique) |
| email | VARCHAR | Email người dùng (unique) |
| password | VARCHAR | Mật khẩu đã mã hóa |
| role | ENUM (`user`, `admin`) | Phân quyền |
| created_at | TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | Ngày cập nhật |

📌 Một user có thể chơi nhiều game và có nhiều ván chơi.

---

### 3.2 `games`

Lưu danh sách các game trong hệ thống.

| Column | Type | Description |
|------|------|------------|
| id | INT (PK) | ID game |
| name | VARCHAR | Tên game |
| slug | VARCHAR | Định danh game (tic-tac-toe, caro, …) |
| board_size | INT | Kích thước board (NxN) |
| enabled | BOOLEAN | Trạng thái bật/tắt game |
| created_at | TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | Ngày cập nhật |

📌 Admin có thể bật/tắt game mà không cần xóa dữ liệu.

---

### 3.3 `game_sessions`

Lưu thông tin mỗi ván chơi của người dùng.

| Column | Type | Description |
|------|------|------------|
| id | UUID (PK) | ID ván chơi |
| user_id | UUID (FK) | Người chơi |
| game_id | INT (FK) | Game được chơi |
| state | JSONB | Trạng thái game (board, lượt chơi, số nước đi…) |
| score | INT | Điểm số |
| status | ENUM (`playing`, `finished`) | Trạng thái ván chơi |
| created_at | TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | Ngày cập nhật |

📌 `state` cho phép lưu trạng thái của mọi loại board game.

**Ví dụ state:**
```json
{
  "board": ["X", "", "O", "", "X", "", "", "", "O"],
  "turn": "X",
  "moves": 5
}
