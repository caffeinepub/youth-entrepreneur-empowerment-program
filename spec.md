# Specification

## Summary
**Goal:** Build VillagePreneurs India — a platform to discover, register, equip, motivate, and connect young entrepreneurs across every village and panchayat in India.

**Planned changes:**
- Backend Motoko actor with data models and CRUD/list APIs for: entrepreneur profiles (name, age, gender, village, panchayat, district, state, business category, skills, bio, contact), success stories (title, content, author, village, category, date), training resources (title, description, type, category, URL/content), and community posts (author, village, panchayat, category, message, timestamp)
- Filtering and count queries for entrepreneurs by village, panchayat, district, state, and category
- Landing page with mission statement, hero banner image, and call-to-action buttons linking to all major sections
- Entrepreneur Registration page with a validated multi-field form and success confirmation
- Entrepreneur Directory page with paginated list, filters (state, district, panchayat, category), and individual profile view
- Village/Panchayat Dashboard page showing entrepreneur counts, progress bars toward 1000 target, and category breakdowns per panchayat, with village mosaic image
- Training & Resources page with resource cards filtered by category and type
- Motivation Hub page listing success stories sorted by most recent, with category/village filters and full story view
- Community Connect page with a post board (reverse-chronological) and submission form
- Consistent saffron, deep green, and off-white visual theme with bold typography, shared header/footer/navigation across all pages

**User-visible outcome:** Users can register as entrepreneurs, browse the directory, view panchayat-level progress dashboards, access training resources, read and share success stories, and post community messages — all within a vibrant, rural-India-inspired interface.
