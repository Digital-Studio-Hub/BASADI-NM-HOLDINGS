# Modern Muse Logo Assets Guide

## Logo Files Structure

The Modern Muse logo is used throughout the website in three color variations. All logo files should be saved in the `/public/brand/` directory.

## Required Logo Files

### 1. Color Version (Default)
- **File:** `modern-muse-logo-color.png`
- **Usage:** Header (primary navigation)
- **Background:** Works on light backgrounds
- **Dimensions:** Recommended 300x200px (height: 48px when displayed)

### 2. White Version
- **File:** `modern-muse-logo-white.png`
- **Usage:** Footer, dark backgrounds
- **Background:** Works on dark backgrounds
- **Dimensions:** Recommended 300x200px (height: 40px when displayed in footer)

### 3. Black Version
- **File:** `modern-muse-logo-black.png`
- **Usage:** Printed materials, light backgrounds, alternative hero sections
- **Background:** Works on light/white backgrounds
- **Dimensions:** Recommended 300x200px

## How to Add Logo Files

1. Open the provided Modern Muse logo image
2. Create three versions:
   - **Color version:** Keep original colors (cream/tan with profile)
   - **White version:** Convert to white/light color for dark backgrounds
   - **Black version:** Convert to black/dark color for light backgrounds

3. Save each version as PNG with transparency:
   - `modern-muse-logo-color.png`
   - `modern-muse-logo-white.png`
   - `modern-muse-logo-black.png`

4. Save all files to: `/artifacts/modern-muse/public/brand/`

## Current Usage in Code

- **Header:** Uses `modern-muse-logo-color.png` (shown on top of light background)
- **Footer:** Uses `modern-muse-logo-white.png` (shown on light background in footer)

## Optimization Tips

- Use PNG format with transparency for flexibility
- Maintain aspect ratio across all versions
- Test logos at different sizes (mobile: 48px height, desktop: 48-64px height)
- Consider using WebP format for better compression (browsers will fall back to PNG)

## Tools for Creating Variations

You can use any image editor to create the variations:
- **Adobe Photoshop:** Adjustment Layers → Hue/Saturation
- **GIMP (Free):** Colors → Desaturate/Color Balance
- **Figma (Free):** Right-click layer → Select all → Adjust colors
- **Online tools:** Remove.bg, Photopea.com, or Pixlr.com

## Logo Placement Reference

### Header
- Location: Top left, sticky navigation
- Height: 48px (auto width to maintain aspect ratio)
- Hover effect: Opacity transition

### Footer
- Location: Bottom left section
- Height: 40px (auto width to maintain aspect ratio)
- Includes label: "Modern Muse"

---

Once you have created and saved the three logo files to `/artifacts/modern-muse/public/brand/`, the website will automatically display them in the correct locations.
