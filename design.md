# Yelm Country Carvings Landing Page Design

## Technical guidelines
- Write reusable React components to stay organized and ensure maintainability
- Use Tailwind CSS

## Overall Design Philosophy
**Theme**: Rustic, handcrafted, natural, warm, friendly, grounded, authentic, trusted. Evokes the feeling of wood, nature, and skilled craftsmanship.
- **Color Palette**: Strictly adhere to the provided palette:
    - Primary 1: `#6B4F41` (Rich Wood Brown) – headings, logos, icons
    - Primary 2: `#A07E5D` (Warm Timber) – buttons, borders
    - Secondary: `#4A6151` (Forest Canopy Green) – links, highlights, callouts
    - Accent: `#B87351` (Muted Terracotta/Clay) – hover effects, transitions, primary CTAs
    - Neutral 1: `#F5F1EM` (Natural Linen) – body background
    - Neutral 2: `#3E3C3B` (Charcoal Ink) – body and header text
- **Typography**:
    - Headings (H1, H2): **Cinzel** (bold, rustic) in `#6B4F41` or `#3E3C3B`
    - Body text, subtitles, labels: **Lato** (clear, readable sans-serif) in `#3E3C3B`
    - Quotes/Testimonials: **Playfair Display** for added variety
- **Textures**: Subtle wood grain textures in section backgrounds (e.g., hero, about, footer). Ensure textures are light and desaturated for readability.
- **Imagery & Media**: High-quality photos and dynamic media (videos, slideshows) of carvings, the creation process, and the workshop.
- **Layout**: Clean, organized with clear visual hierarchy. Use asymmetrical elements (e.g., overlapping images) for visual interest. Ensure responsiveness across devices.

## Color Palette
| Color                  | Web Use                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| Rich Wood Brown        | Main headings, backgrounds for specific sections, footers, possibly primary button backgrounds (with light text).                     |
| Warm Timber            | Secondary backgrounds, dividers, card backgrounds showcasing products, subtle texture elements.                                     |
| Forest Canopy Green    | Accent areas, borders, iconography, perhaps secondary buttons or hover states. Use moderately to avoid overpowering the wood tones. |
| Muted Terracotta/Clay  | Crucial for Calls-to-Action (CTAs) like "Buy Now," "View Details," "Contact Us" buttons. Also for highlights, important links, or small decorative elements. Use sparingly for maximum impact. |
| Natural Linen          | Main background color for content areas to ensure high readability.                                                                 |
| Charcoal Ink           | Main body text, detailed descriptions. Provides excellent contrast against the Natural Linen background.                               |

## Landing Page Sections Breakdown

### 1. Navigation Bar (Sticky)
- **Purpose**: Provide easy navigation and constant brand presence.
- **Placement**: Sticky at the top of the page.
- **Background Color**: `#6B4F41` (Rich Wood Brown).
- **Elements**:
    - **Logo**: Yelm Country Carvings logo on the left. Links to the top of the landing page. Add a hover effect (e.g., enlarge slightly or change to `#4A6151`).
    - **Navigation Links**: Right-aligned. Links to: About, Process, Events, Contact, FAQ.
        - Font: Lato, Color: `#F5F1E M`, Hover: `#A07E5D`.
        - Use dropdown menus for "Events" and "FAQ" if subpages exist.
    - **Facebook Icon**: Small icon linked to the company's Facebook page.
        - Color: `#F5F1E M`, Hover: `#4A6151`.
        - Add a tooltip ("Follow us on Facebook") on hover.
- **Mobile Optimization**: Implement a hamburger menu for smaller screens.
- **Additional Feature**: Add a subtle scroll animation (e.g., shrink the bar or shift background to `#A07E5D` when scrolling).

### 2. Hero Section
- **Purpose**: Capture attention, introduce the core offering, and provide a primary call to action.
- **Layout**: Full-width section below the navigation bar.
- **Background**: Full-screen background video of the carving process or a slideshow of carvings in natural settings.
- **Elements**:
    - **Headline (H1)**: "Yelm Country Carvings"
        - Font: Cinzel, Color: `#F5F1E M`, with `#3E3C3B` text shadow for readability.
    - **Subtitle**: "Creating Happy Chainsaw Carved Friends for Everyone"
        - Font: Lato, Color: `#F5F1E M`, with fade-in animation.
    - **Primary CTA Button**: "Explore Our Creations"
        - Font: Lato Bold, Background: `#B87351`, Text: `#F5F1E M`, with pulse animation.
        - Hover: `#A07E5D`.
        - Links to the "From Raw Material..." section.
    - **Secondary CTA Button**: "Get a Custom Quote"
        - Font: Lato Bold, Background: `#A07E5D`, Text: `#F5F1E M`.
        - Hover: `#B87351`.
        - Links to the Contact section.

### 3. About Yelm Country Carvings Section
- **Purpose**: Build trust, tell the story behind the carvings, and highlight key values.
- **Layout**: Standard width, `#F5F1E M` background, wood texture dividers above and below.
- **Elements**:
    - **Heading (H2)**: "About Yelm Country Carvings"
        - Font: Cinzel, Color: `#6B4F41`, with a carved wood icon above.
    - **Cards (3)**: Arranged horizontally (stacked on mobile).
        - **Card 1**: "Our Story" – Brief history of the business.
        - **Card 2**: "Quality Craftsmanship" – Emphasis on skill and materials.
        - **Card 3**: "Meet the Carver" – Photo/bio of the carver.
        - **Styling**: Background `#F5F1E M`, border `#A07E5D`, slight shadow. Add hover effects (e.g., lift or reveal more info).
    - **Additional Feature**: Include a video testimonial from the carver or a customer for authenticity.

### 4. "From Raw Material to Happy Friends" Section
- **Purpose**: Showcase the skill and transformation involved in creating the carvings.
- **Layout**: Full-width, subtle wood texture background (`#A07E5D` desaturated).
- **Elements**:
    - **Heading (H2)**: "From Raw Material to Happy Friends"
        - Font: Cinzel, Color: `#6B4F41`, with a wood-textured background.
    - **Image Carousel**: Sequence of 5-7 images showing the process.
        - Add captions (e.g., "Step 1: Selecting the Log").
        - Step indicators: Active `#4A6151`, Inactive `#A07E5D`.
        - Include thumbnails below for navigation.
        - Enable click-to-expand lightboxes for detailed images/descriptions.
    - **Additional Feature**: Add a "See the Full Process" button linking to a video of the carving process.

### 5. Events Section
- **Purpose**: Inform visitors about opportunities to see the carvings or meet the carver.
- **Layout**: Standard width, `#F5F1E M` background, wood texture divider above.
- **Elements**:
    - **Heading (H2)**: "Upcoming Events"
        - Font: Cinzel, Color: `#6B4F41`, with `#4A6151` underline.
    - **Event Listings**: Cards with images, titles, dates (`#4A6151`), and descriptions.
        - Include "Learn More" buttons that expand details inline.
        - Add an "Add to Calendar" button for each event.
    - **Fallback Message**: If no events, display "Stay Tuned!" with a signup form for event notifications.

### 6. Contact Us Section
- **Purpose**: Facilitate inquiries, quote requests, and provide essential business details.
- **Layout**: Two columns (info left, form right on wide screens; stacked on mobile), `#F5F1E M` background.
- **Elements**:
    - **Heading (H2)**: "Contact Us"
        - Font: Cinzel, Color: `#6B4F41`, with a carved bear icon.
    - **Business Information (Left)**:
        - Sub-heading (H3): "Visit or Call Us"
        - Hours, Address, Phone (clickable), Email (clickable).
        - Icons styled in `#6B4F41`.
        - Add a "Schedule a Visit" button linking to a calendar tool.
    - **Contact Form (Right)**:
        - Title (H3): "Get a Free Quote!"
        - Fields: Name*, Email*, Phone, Message*, File Upload (for inspiration images).
        - Submit Button: Background `#B87351`, Text: "Send Message", Hover: `#A07E5D`.
        - Include a live chat or chatbot for instant assistance.
    - **Privacy Note**: "Your information is kept confidential."

### 7. Get Directions Section
- **Purpose**: Provide an interactive map for easy location finding.
- **Layout**: Standard width, `#F5F1E M` background.
- **Elements**:
    - **Heading (H2)**: "Find Our Workshop"
        - Font: Cinzel, Color: `#6B4F41`, with a map pin icon.
    - **Embedded Google Map**: Interactive, zoomable, with a pin at the business address.
    - **Additional Feature**: Add a "Get Directions" button that pre-fills Google Maps and include nearby landmarks info.

### 8. Frequently Asked Questions (FAQ) Section
- **Purpose**: Proactively answer common customer questions.
- **Layout**: Standard width, `#F5F1E M` background, wood texture divider above.
- **Elements**:
    - **Heading (H2)**: "Frequently Asked Questions"
        - Font: Cinzel, Color: `#6B4F41`, with a question mark icon.
    - **FAQ Items (Accordion Style)**:
        - Questions: Clickable headers with '+' or 'v' icons (`#4A6151`).
        - Answers: Expand smoothly, background `#FFFFFF`.
        - Include a search bar for quick access.
        - Add links in answers to relevant sections (e.g., Contact, Events).
    - **Additional Feature**: "Still Have Questions?" link to the contact form.

### 9. Footer
- **Purpose**: Standard closing information, copyright, and social links.
- **Layout**: Full-width, `#6B4F41` background.
- **Elements**:
    - **Copyright Notice**: "© [Current Year] Yelm Country Carvings. All Rights Reserved."
        - Font: Lato (small), Color: `#F5F1E M`.
    - **Quick Links**: "About Us," "Contact Us," "Privacy Policy."
    - **Social Media**: Facebook, Instagram, Pinterest (if applicable), Hover: `#4A6151`.
    - **Newsletter Signup**: Form for updates.
    - **Back to Top**: Subtle arrow button appearing on scroll.

## Additional Enhancements
- **Performance**: Optimize images/videos, use lazy loading for below-the-fold content.
- **Accessibility**: Add alt text, ensure color contrast, support keyboard navigation.
- **SEO**: Use keywords (e.g., "chainsaw carvings," "custom wood art") in headings and meta tags.