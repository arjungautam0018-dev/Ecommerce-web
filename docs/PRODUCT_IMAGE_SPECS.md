# Product images — specs for designers / client

Use these so photos look sharp on the **home page** and **category** product cards.

## Aspect ratio (required)

| Ratio | Decimals | Use |
|--------|-----------|-----|
| **1 : 1** | **1.0** | Square — default on-site frame |
| **4 : 3** | **1.33** | Optional shorter frame (set in CSS — see below) |

The storefront uses a **fixed aspect ratio** and **full card width**. Images use `object-fit: cover`, so edges may be cropped if the file doesn’t match that ratio.

**Shorter image (less height, same width):** the site can use **`4 : 3`** instead of **`1 : 1`** by changing `--product-thumb-aspect` in `index.css` (`.products`) and `category.css` (`.products-grid`). Then ask the client for **4∶3** assets (e.g. **1200 × 900 px**).

## Recommended export sizes

| Purpose | Minimum | Recommended |
|---------|---------|-------------|
| Web product tile | **800 × 800 px** | **1200 × 1200 px** or **2000 × 2000 px** |

Higher resolution helps on retina displays and zoom. Keep file size reasonable (compress JPG/WebP).

## File format

- **WebP** or **JPEG** — consistent quality; avoid tiny thumbnails upscaled.

## Composition tip

Because the frame is **square** and **cover** cropping:

- Keep the **main product centered** in the square.
- Leave a little margin from the edges if the product must not be clipped.

---

*Defaults: `--product-thumb-aspect: 1 / 1` on `.products` and `.products-grid` in `public/css/index.css` and `public/css/category.css`.*
