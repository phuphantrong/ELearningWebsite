# 📚 WebELearning Platform

A modern, full-stack online learning platform built with Next.js and NestJS. Create, manage, and deliver educational content with a powerful block-based editor inspired by W3Schools and MDN.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)
![NestJS](https://img.shields.io/badge/NestJS-11.0.0-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

---

## 🌟 Features

### 🎓 Learning Experience
- **Course Catalog** - Browse and search available courses
- **Structured Learning** - Course → Section → Lesson hierarchy
- **Progress Tracking** - Visual progress indicators
- **Responsive Design** - Optimized for all devices

### ✏️ Content Management
- **Rich Block Editor** - 8+ content block types
- **Drag & Drop Reordering** - Intuitive content organization
- **Real-time Preview** - See changes instantly
- **Draft/Published States** - Control content visibility

### 📝 Block Types Supported
1. **TEXT** - Rich formatted text with Markdown
2. **HEADING** - H1-H6 dynamic headings
3. **CODE** - Syntax-highlighted code blocks (JavaScript, Python, HTML, CSS, TypeScript)
4. **IMAGE** - Images with captions and alt text
5. **LIST** - Ordered/Unordered lists
6. **MATH** - LaTeX formulas with KaTeX rendering
7. **CALLOUT** - Info/Warning/Success/Danger alerts
8. **NOTE** - Legacy note blocks (backward compatible)

---

## 🏗️ Architecture

```
WebELearning/
├── backend/              # NestJS API Server
│   ├── src/
│   │   ├── modules/
│   │   │   └── courses/  # Course management module
│   │   ├── main.ts       # Application entry
│   │   └── seed.ts       # Database seeding
│   └── package.json
│
├── frontend/             # Next.js Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/      # Public routes (/)
│   │   │   ├── (learn)/       # Learning interface (/learn)
│   │   │   └── (admin)/       # Admin panel (/admin)
│   │   ├── components/        # Reusable components
│   │   └── lib/              # Utilities & API client
│   └── package.json
│
└── README.md
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 11.x
- **Database**: PostgreSQL 16.x
- **ORM**: TypeORM
- **Validation**: class-validator, class-transformer
- **Runtime**: Node.js 18+

### Frontend
- **Framework**: Next.js 16.x (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS
- **Code Highlighting**: react-syntax-highlighter
- **Math Rendering**: KaTeX
- **Package Manager**: pnpm

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- pnpm (recommended) or npm
- PostgreSQL 16

### 1. Clone Repository
```bash
git clone <repository-url>
cd WebELearning
```

### 2. Backend Setup

```bash
cd backend
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials
```

**Environment Variables** (`.env`):
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=webelearning
PORT=4000
```

**Create Database**:
```sql
CREATE DATABASE webelearning;
```

**Run Backend**:
```bash
pnpm run start:dev
# Server runs on http://localhost:4000
```

**Seed Sample Data** (Optional):
```bash
pnpm run seed
```

### 3. Frontend Setup

```bash
cd frontend
pnpm install

# Run development server
pnpm run dev
# Frontend runs on http://localhost:3000
```

---

## 📖 Usage Guide

### Admin Panel
Access: `http://localhost:3000/admin`

#### Create a Course
1. Go to Admin → Courses
2. Click "Create Course"
3. Fill in title, description, slug
4. Click "Create"

#### Build Course Structure
1. Open course detail page
2. Add sections (e.g., "Introduction", "Advanced Topics")
3. Add lessons within sections
4. Each lesson opens in the Block Editor

#### Content Blocks Editor
**Adding Blocks:**
- Click toolbar buttons at bottom: Text, Heading, Code, Image, List, Math, Callout
- Each block type has specific options

**Editing Blocks:**
- Click any block to edit
- Configure metadata (heading level, language, list style, etc.)
- Save changes

**Reordering:**
- Hover over block → drag arrows appear on left
- Click ↑ or ↓ to reorder

**Publishing:**
- Click "DRAFT" badge in header to toggle to "PUBLISHED"
- Only published courses appear on public site

### Student Interface
Access: `http://localhost:3000`

1. Browse courses on homepage
2. Click course → View course details
3. Click "Start Learning"  
4. Navigate lessons via sidebar
5. Progress bar shows completion

---

## 🎨 Block Types Reference

### 1. TEXT Block
**Purpose**: General content, paragraphs, formatted text

**Metadata**: None

**Content Format**: Plain text with Markdown support

**Example**:
```json
{
  "type": "TEXT",
  "content": "This is **bold** and *italic* text."
}
```

---

### 2. HEADING Block
**Purpose**: Section titles, hierarchical structure

**Metadata**:
- `level` (1-6): Heading level (H1, H2, etc.)

**Content Format**: Plain text

**Example**:
```json
{
  "type": "HEADING",
  "content": "Introduction to JavaScript",
  "metadata": { "level": 2 }
}
```

---

### 3. CODE Block
**Purpose**: Code snippets with syntax highlighting

**Metadata**:
- `language`: Programming language (javascript, python, html, css, typescript)

**Content Format**: Raw code string

**Example**:
```json
{
  "type": "CODE",
  "content": "const greeting = 'Hello, World!';\nconsole.log(greeting);",
  "metadata": { "language": "javascript" }
}
```

**Supported Languages**:
- JavaScript
- TypeScript
- Python
- HTML
- CSS

---

### 4. IMAGE Block
**Purpose**: Visual content

**Metadata**:
- `caption` (string): Image caption
- `alt` (string): Alt text for accessibility

**Content Format**: Image URL

**Example**:
```json
{
  "type": "IMAGE",
  "content": "https://example.com/image.png",
  "metadata": {
    "caption": "Example diagram",
    "alt": "Flowchart showing process"
  }
}
```

---

### 5. LIST Block
**Purpose**: Ordered or unordered lists

**Metadata**:
- `style`: "ordered" or "unordered"

**Content Format**: JSON array of strings

**Example**:
```json
{
  "type": "LIST",
  "content": "[\"First item\", \"Second item\", \"Third item\"]",
  "metadata": { "style": "unordered" }
}
```

---

### 6. MATH Block
**Purpose**: Mathematical formulas

**Metadata**:
- `display`: "block" (centered) or "inline" (flows with text)

**Content Format**: Pure LaTeX (NO `$$` delimiters)

**Example**:
```json
{
  "type": "MATH",
  "content": "E = mc^2",
  "metadata": { "display": "block" }
}
```

**LaTeX Examples**:
- Fractions: `\frac{a}{b}`
- Roots: `\sqrt{x}`
- Greek: `\alpha, \beta, \gamma`
- Integrals: `\int_{0}^{\infty} e^{-x} dx`

**Rendering**: Uses KaTeX for fast, high-quality math display

---

### 7. CALLOUT Block
**Purpose**: Highlight important information

**Metadata**:
- `variant`: "info", "warning", "success", "danger"

**Content Format**: Plain text

**Example**:
```json
{
  "type": "CALLOUT",
  "content": "Remember to save your work frequently!",
  "metadata": { "variant": "warning" }
}
```

**Variants**:
- `info` - Blue (informational)
- `warning` - Amber (cautions)
- `success` - Green (achievements)
- `danger` - Red (critical warnings)

---

### 8. NOTE Block (Legacy)
**Purpose**: Backward compatibility with old content

**Metadata**:
- `variant`: Same as CALLOUT

**Content Format**: Plain text or JSON

---

## 🔌 API Reference

### Base URL
```
http://localhost:4000/api/v1
```

### Courses

#### Get All Courses
```http
GET /courses?page=1&q=search_term
```

#### Get Course by Slug
```http
GET /courses/:slug
```

#### Get Course by ID
```http
GET /courses/id/:id
```

#### Create Course
```http
POST /courses
Content-Type: application/json

{
  "title": "Course Title",
  "description": "Course description",
  "slug": "course-title",
  "is_published": false
}
```

#### Update Course
```http
PATCH /courses/:id
Content-Type: application/json

{
  "is_published": true
}
```

#### Delete Course
```http
DELETE /courses/:id
```

---

### Sections

#### Create Section
```http
POST /courses/:courseId/sections
Content-Type: application/json

{
  "title": "Section Title"
}
```

#### Update Section
```http
PATCH /sections/:id
Content-Type: application/json

{
  "title": "Updated Title"
}
```

#### Reorder Sections
```http
PATCH /sections/reorder
Content-Type: application/json

[
  { "id": "section-1", "order": 1 },
  { "id": "section-2", "order": 2 }
]
```

#### Delete Section
```http
DELETE /sections/:id
```

---

### Lessons

#### Get Lesson
```http
GET /lessons/:id
```

#### Create Lesson
```http
POST /sections/:sectionId/lessons
Content-Type: application/json

{
  "title": "Lesson Title",
  "slug": "lesson-title",
  "type": "text"
}
```

#### Update Lesson
```http
PATCH /lessons/:id
Content-Type: application/json

{
  "title": "Updated Title"
}
```

#### Reorder Lessons
```http
PATCH /lessons/reorder
Content-Type: application/json

[
  { "id": "lesson-1", "order": 1 },
  { "id": "lesson-2", "order": 2 }
]
```

#### Delete Lesson
```http
DELETE /lessons/:id
```

---

### Content Blocks

#### Create Block
```http
POST /lessons/:lessonId/blocks
Content-Type: application/json

{
  "type": "MATH",
  "content": "E = mc^2",
  "order": 1,
  "metadata": { "display": "block" }
}
```

#### Update Block
```http
PATCH /blocks/:id
Content-Type: application/json

{
  "content": "Updated content",
  "metadata": { "language": "python" }
}
```

#### Reorder Blocks
```http
PATCH /blocks/reorder
Content-Type: application/json

[
  { "id": "block-1", "order": 1 },
  { "id": "block-2", "order": 2 }
]
```

#### Delete Block
```http
DELETE /blocks/:id
```

---

## 🗄️ Database Schema

### Course
```sql
- id: UUID (PK)
- title: VARCHAR
- description: TEXT
- slug: VARCHAR (UNIQUE)
- is_published: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Section
```sql
- id: UUID (PK)
- course_id: UUID (FK → Course)
- title: VARCHAR
- order: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Lesson
```sql
- id: UUID (PK)
- section_id: UUID (FK → Section)
- title: VARCHAR
- slug: VARCHAR
- type: VARCHAR
- order: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### ContentBlock
```sql
- id: UUID (PK)
- lesson_id: UUID (FK → Lesson)
- type: VARCHAR (TEXT, CODE, HEADING, etc.)
- content: TEXT
- metadata: JSONB (nullable)
- order: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

---

## 🧪 Development

### Run Tests
```bash
# Backend tests
cd backend
pnpm run test

# Frontend tests
cd frontend
pnpm run test
```

### Build for Production

**Backend**:
```bash
cd backend
pnpm run build
pnpm run start:prod
```

**Frontend**:
```bash
cd frontend
pnpm run build
pnpm run start
```

---

## 📁 Project Structure

### Backend Modules
```
backend/src/modules/courses/
├── entities/
│   ├── course.entity.ts
│   ├── section.entity.ts
│   ├── lesson.entity.ts
│   └── content-block.entity.ts
├── dto/
│   ├── create-course.dto.ts
│   ├── create-lesson.dto.ts
│   └── create-content-block.dto.ts
├── courses.controller.ts
├── courses.service.ts
└── courses.module.ts
```

### Frontend Components
```
frontend/src/components/
├── ContentBlockRenderer.tsx   # Renders blocks in learn view
├── MathRenderer.tsx           # KaTeX math rendering
└── ...
```

### Frontend Pages
```
frontend/src/app/
├── (public)/
│   └── page.tsx              # Homepage
├── (learn)/
│   └── learn/[courseId]/[lessonId]/page.tsx
└── (admin)/
    └── admin/
        ├── courses/page.tsx
        ├── courses/[id]/page.tsx
        └── lessons/[id]/page.tsx
```

---

## 🐛 Troubleshooting

### Math blocks not rendering
**Issue**: Raw LaTeX displayed instead of formatted math

**Solution**: 
1. Check KaTeX is installed: `pnpm list katex`
2. Ensure content has NO `$$` delimiters
3. Verify `metadata.display` is set

### Reorder not working
**Issue**: "invalid input syntax for type uuid: reorder"

**Solution**: Already fixed. Ensure routes in `courses.controller.ts` have `/reorder` BEFORE `/:id` routes.

### Course sections undefined
**Issue**: TypeError when toggling published status

**Solution**: Already fixed. `handleTogglePublished` now reloads full course data.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Inspiration**: W3Schools, MDN Web Docs
- **Math Rendering**: KaTeX
- **Code Highlighting**: Prism (via react-syntax-highlighter)
- **UI Design**: Tailwind CSS

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review API reference above

---

**Built with ❤️ using Next.js and NestJS**
