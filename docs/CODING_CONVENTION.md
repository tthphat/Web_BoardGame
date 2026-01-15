# Coding Conventions

Tài liệu này quy định các chuẩn viết code cho dự án (Frontend React + Backend Express).

## 1. Naming Conventions (Quy tắc đặt tên)

### 1.1. Files & Folders

**Frontend (`/frontend`)**

- **Extensions**: Sử dụng `.jsx` cho React components, `.js` cho logic thuần.
- **Components**: PascalCase. Tên file trùng với tên component.
  - Ví dụ: `Header.jsx`, `UserProfile.jsx`, `PaginationSection.jsx`.
- **Hooks**: camelCase, bắt đầu bằng `use`.
  - Ví dụ: `useAuth.js`, `useFetchCallback.js`.
- **Contexts**: PascalCase.
  - Ví dụ: `AuthContext.jsx`, `ThemeContext.jsx`.
- **Utilities/Libs**: camelCase.
  - Ví dụ: `utils.js`, `apiClient.js`.
- **Asset filenames**: snake_case (chữ thường).
  - Ví dụ: `background_banner.jpg`.
- **Service filenames**:
  - Ví dụ: `auth.service.js`. 

**Backend (`/backend`)**

- **Pattern chung**: `name.type.js` (như hiện tại trong project).
- **Controllers**: camelCase + `.controller.js`.
  - Ví dụ: `auth.controller.js`, `user.controller.js`.
- **Routes**: camelCase + `.route.js`.
  - Ví dụ: `auth.route.js`, `product.route.js`.
- **Models**: camelCase + `.model.js` (hoặc PascalCase nếu là Class).
  - Ví dụ: `user.model.js`.
- **Middleware**: camelCase + `.middleware.js`.
  - Ví dụ: `auth.middleware.js`, `isAdmin.middleware.js`.
- **Migrations/Seeds**: Giữ nguyên format timestamp của Knex.
  - Ví dụ: `20260103154921_create_users_table.js`.

### 1.2. Variables & Functions

- **Variables**: camelCase.
  - `const userProfile = ...`
  - `let isLoggedIn = ...` (Boolean nên bắt đầu bằng `is`, `has`, `should`).
- **Constants**: UPPER_SNAKE_CASE (đối với hằng số config global).
  - `const MAX_RETRY_ATTEMPTS = 3;`
- **Functions**: camelCase. Động từ + Danh từ.
  - `getUserMetaData()`, `handleSubmit()`, `validateInput()`.
- **React Components**: PascalCase.
  - `function SubmitButton() { ... }`

### 1.3. Database (PostgreSQL/SQL via Knex)

- **Table Names**: snake_case, số nhiều (plural).
  - `users`, `products`, `role_permissions`.
- **Column Names**: snake_case.
  - `created_at`, `full_name`, `password_hash`.
- **Primary Keys**: `id` (hoặc `user_id` nếu cần rõ ràng khi join).
- **Foreign Keys**: `singular_table_name_id`.
  - `user_id`, `role_id`.

## 2. Project Structure (Cấu trúc dự án)

### Frontend

Giữ cấu trúc tách biệt theo chức năng/loại file:

```
src/
  assets/       # Chỉ chứa images, fonts, icons tĩnh
  components/   # Các UI components tái sử dụng
    ui/         # Các atomic components (Button, Input) - shadcn/ui style
  contexts/     # Global state (React Context)
  hooks/        # Custom hooks
  layouts/      # Các layout wrapper (MainLayout, AuthLayout)
  lib/          # Helper functions, schemas (zod/yup), constants
  pages/        # Các page components chính (được map vào Route)
  services/     # API calls (axios instances, endpoints)
```

### Backend

Mô hình MVC phân tách rõ ràng:

```
src/
  controllers/  # Xử lý logic request/response, validate input cơ bản
  db/           # Cấu hình database connection (knex instance)
  middleware/   # Authentication, logging, error handling
  models/       # Database queries (Knex query builders)
  routes/       # Định nghĩa API endpoints và map với controller
  app.js        # Express app setup
  server.js     # Entry point, start server
```

## 3. Coding Principles

- **DRY (Don't Repeat Yourself)**: Nếu logic lặp lại > 2 lần, hãy tách thành hàm hoặc component.
- **Early Return**: Ưu tiên return sớm trong hàm để giảm độ sâu nesting (if/else lồng nhau).

  ```javascript
  // Bad
  if (user) {
    if (isAdmin) {
      // do something
    }
  }

  // Good
  if (!user) return;
  if (!isAdmin) return;
  // do something
  ```

- **Async/Await**: Sử dụng `async/await` thay vì `.then().catch()` để code dễ đọc hơn (trừ trường hợp đặc biệt). Luôn bọc trong `try/catch` ở tầng Controller.

## 4. Git Convention

- **Message Format**: `type(scope): description`
- **Types**:
  - `feat`: Tính năng mới
  - `fix`: Sửa lỗi
  - `docs`: Tài liệu
  - `style`: Formatting, missing semi colons, etc (không đổi logic code)
  - `refactor`: Cấu trúc lại code
  - `chore`: Thay đổi tool, config build, update dependencies

Ví dụ:

- `feat(auth): add login functionality`
- `fix(user-controller): fix password hashing bug`
