# Yelm Country Carvings Landing Page Design

## Overall Design Philosophy
- **Theme**: Rustic, handcrafted, natural, friendly. Evokes the feeling of wood, nature, and skilled craftsmanship.
- **Color Palette**: Strictly adhere to the provided palette:
    - Primary: `#8B4513` (Rich wood brown) – headings, logos, icons
    - Secondary: `#D2691E` (Lighter wood tone) – buttons, borders
    - Accent: `#556B2F` (Forest green) – links, highlights, callouts
    - Background: `#FAF3E0` (Creamy beige) – body background
    - Text: `#2F1B0C` (Deep brown) – body and header text
    - Hover/Accent 2: `#A0522D` (Saddle brown) – hover effects, transitions
- **Typography**:
    - Headings (H1, H2): **Cinzel** (bold, rustic) in `#8B4513` or `#2F1B0C`
    - Body text, subtitles, labels: **Lato** (clear, readable sans-serif) in `#2F1B0C`
    - Quotes/Testimonials: **Playfair Display** for added variety
- **Textures**: Subtle wood grain textures in section backgrounds (e.g., hero, about, footer). Ensure textures are light and desaturated for readability.
- **Imagery & Media**: High-quality photos and dynamic media (videos, slideshows) of carvings, the creation process, and the workshop.
- **Layout**: Clean, organized with clear visual hierarchy. Use asymmetrical elements (e.g., overlapping images) for visual interest. Ensure responsiveness across devices.

## Landing Page Sections Breakdown

### 1. Navigation Bar (Sticky)
- **Purpose**: Provide easy navigation and constant brand presence.
- **Placement**: Sticky at the top of the page.
- **Background Color**: `#8B4513` (Rich wood brown).
- **Elements**:
    - **Logo**: Yelm Country Carvings logo on the left. Links to the top of the landing page. Add a hover effect (e.g., enlarge slightly or change to `#556B2F`).
    - **Navigation Links**: Right-aligned. Links to: About, Process, Events, Contact, FAQ.
        - Font: Lato, Color: `#FAF3E0`, Hover: `#D2691E`.
        - Use dropdown menus for "Events" and "FAQ" if subpages exist.
    - **Facebook Icon**: Small icon linked to the company's Facebook page.
        - Color: `#FAF3E0`, Hover: `#556B2F`.
        - Add a tooltip ("Follow us on Facebook") on hover.
- **Mobile Optimization**: Implement a hamburger menu for smaller screens.
- **Additional Feature**: Add a subtle scroll animation (e.g., shrink the bar or shift background to `#D2691E` when scrolling).

### 2. Hero Section
- **Purpose**: Capture attention, introduce the core offering, and provide a primary call to action.
- **Layout**: Full-width section below the navigation bar.
- **Background**: Full-screen background video of the carving process or a slideshow of carvings in natural settings.
- **Elements**:
    - **Headline (H1)**: "Bring Your Vision to Life with Custom Chainsaw Carvings"
        - Font: Cinzel, Color: `#FAF3E0`, with `#2F1B0C` text shadow for readability.
    - **Subtitle**: "Creating Happy Chainsaw Carved Friends for Everyone"
        - Font: Lato, Color: `#FAF3E0`, with fade-in animation.
    - **Primary CTA Button**: "Explore Our Creations"
        - Font: Lato Bold, Background: Gradient (`#556B2F` to `#A0522D`), Text: `#FAF3E0`, with pulse animation.
        - Hover: `#A0522D`.
        - Links to the "From Raw Material..." section.
    - **Secondary CTA Button**: "Get a Custom Quote"
        - Font: Lato Bold, Background: `#D2691E`, Text: `#FAF3E0`.
        - Hover: `#A0522D`.
        - Links to the Contact section.

### 3. About Yelm Country Carvings Section
- **Purpose**: Build trust, tell the story behind the carvings, and highlight key values.
- **Layout**: Standard width, `#FAF3E0` background, wood texture dividers above and below.
- **Elements**:
    - **Heading (H2)**: "About Yelm Country Carvings"
        - Font: Cinzel, Color: `#8B4513`, with a carved wood icon above.
    - **Cards (3)**: Arranged horizontally (stacked on mobile).
        - **Card 1**: "Our Story" – Brief history of the business.
        - **Card 2**: "Quality Craftsmanship" – Emphasis on skill and materials.
        - **Card 3**: "Meet the Carver" – Photo/bio of the carver.
        - **Styling**: Background `#FAF3E0`, border `#D2691E`, slight shadow. Add hover effects (e.g., lift or reveal more info).
    - **Additional Feature**: Include a video testimonial from the carver or a customer for authenticity.

### 4. "From Raw Material to Happy Friends" Section
- **Purpose**: Showcase the skill and transformation involved in creating the carvings.
- **Layout**: Full-width, subtle wood texture background (`#D2691E` desaturated).
- **Elements**:
    - **Heading (H2)**: "From Raw Material to Happy Friends"
        - Font: Cinzel, Color: `#8B4513`, with a wood-textured background.
    - **Image Carousel**: Sequence of 5-7 images showing the process.
        - Add captions (e.g., "Step 1: Selecting the Log").
        - Step indicators: Active `#556B2F`, Inactive `#D2691E`.
        - Include thumbnails below for navigation.
        - Enable click-to-expand lightboxes for detailed images/descriptions.
    - **Additional Feature**: Add a "See the Full Process" button linking to a video of the carving process.

### 5. Events Section
- **Purpose**: Inform visitors about opportunities to see the carvings or meet the carver.
- **Layout**: Standard width, `#FAF3E0` background, wood texture divider above.
- **Elements**:
    - **Heading (H2)**: "Upcoming Events"
        - Font: Cinzel, Color: `#8B4513`, with `#556B2F` underline.
    - **Event Listings**: Cards with images, titles, dates (`#556B2F`), and descriptions.
        - Include "Learn More" buttons that expand details inline.
        - Add an "Add to Calendar" button for each event.
    - **Fallback Message**: If no events, display "Stay Tuned!" with a signup form for event notifications.

### 6. Contact Us Section
- **Purpose**: Facilitate inquiries, quote requests, and provide essential business details.
- **Layout**: Two columns (info left, form right on wide screens; stacked on mobile), `#FAF3E0` background.
- **Elements**:
    - **Heading (H2)**: "Contact Us"
        - Font: Cinzel, Color: `#8B4513`, with a carved bear icon.
    - **Business Information (Left)**:
        - Sub-heading (H3): "Visit or Call Us"
        - Hours, Address, Phone (clickable), Email (clickable).
        - Icons styled in `#8B4513`.
        - Add a "Schedule a Visit" button linking to a calendar tool.
    - **Contact Form (Right)**:
        - Title (H3): "Get a Free Quote!"
        - Fields: Name*, Email*, Phone, Message*, File Upload (for inspiration images).
        - Submit Button: Gradient (`#556B2F` to `#A0522D`), Text: "Send Message", Hover: `#A0522D`.
        - Include a live chat or chatbot for instant assistance.
    - **Privacy Note**: "Your information is kept confidential."

### 7. Get Directions Section
- **Purpose**: Provide an interactive map for easy location finding.
- **Layout**: Standard width, `#FAF3E0` background.
- **Elements**:
    - **Heading (H2)**: "Find Our Workshop"
        - Font: Cinzel, Color: `#8B4513`, with a map pin icon.
    - **Embedded Google Map**: Interactive, zoomable, with a pin at the business address.
    - **Additional Feature**: Add a "Get Directions" button that pre-fills Google Maps and include nearby landmarks info.

### 8. Frequently Asked Questions (FAQ) Section
- **Purpose**: Proactively answer common customer questions.
- **Layout**: Standard width, `#FAF3E0` background, wood texture divider above.
- **Elements**:
    - **Heading (H2)**: "Frequently Asked Questions"
        - Font: Cinzel, Color: `#8B4513`, with a question mark icon.
    - **FAQ Items (Accordion Style)**:
        - Questions: Clickable headers with '+' or 'v' icons (`#556B2F`).
        - Answers: Expand smoothly, background `#FFFFFF`.
        - Include a search bar for quick access.
        - Add links in answers to relevant sections (e.g., Contact, Events).
    - **Additional Feature**: "Still Have Questions?" link to the contact form.

### 9. Footer
- **Purpose**: Standard closing information, copyright, and social links.
- **Layout**: Full-width, `#8B4513` background.
- **Elements**:
    - **Copyright Notice**: "© [Current Year] Yelm Country Carvings. All Rights Reserved."
        - Font: Lato (small), Color: `#FAF3E0`.
    - **Quick Links**: "About Us," "Contact Us," "Privacy Policy."
    - **Social Media**: Facebook, Instagram, Pinterest (if applicable), Hover: `#556B2F`.
    - **Newsletter Signup**: Form for updates.
    - **Back to Top**: Subtle arrow button appearing on scroll.

## Additional Enhancements
- **Performance**: Optimize images/videos, use lazy loading for below-the-fold content.
- **Accessibility**: Add alt text, ensure color contrast, support keyboard navigation.
- **SEO**: Use keywords (e.g., "chainsaw carvings," "custom wood art") in headings and meta tags.