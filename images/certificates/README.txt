How to add certificates

1) Put your files in this folder:
   - e.g., My-Cert-1.jpg, ai-course.pdf, web-dev.png

2) Edit the manifest file certificates.json and add entries like:
[
  { "file": "My-Cert-1.jpg", "title": "Web Development Certificate", "date": "2024-05-10" },
  { "file": "ai-course.pdf", "title": "AI Course Certificate", "date": "2023-11-02" }
]

Notes
- Supported image files render as thumbnails (JPG/PNG/WEBP). PDFs show a PDF badge and open in the viewer.
- Title is shown on the card; date is optional.
- Make sure the "file" names match exactly with the files in this folder.
- No uploads from visitors. This is a static gallery controlled by you.
