# LabID Homepage Design QA

> Current baseline: the annotated immersive-Hero revision supersedes the original split-Hero comparison below. The Hero now uses the laboratory photograph as a full-width background with accessible HTML copy and bottom-anchored CTAs layered above it; no edition label, research metadata, standalone audience line, or baked-in image text remains.

- Current desktop/tablet evidence: `output/product-design/hero-overlay-visible.png`
- Current mobile evidence: `output/product-design/hero-overlay-mobile.png`
- Current contact typography evidence: `output/product-design/contact-typography-after.png`

- Source visual truth: `C:\Users\Zeng\.codex\generated_images\01a00e31-143c-74c0-bd1e-faef78d3d2a8\exec-7eccb2cc-bdfc-4d54-b458-66edccb0aaed.png`
- Final implementation capture: `C:\Users\Zeng\Documents\LabID官网\output\product-design\implementation-desktop-v3.png`
- Full-page implementation capture: `C:\Users\Zeng\Documents\LabID官网\output\product-design\implementation-fullpage.png`
- Combined comparison evidence: `C:\Users\Zeng\Documents\LabID官网\output\product-design\desktop-side-by-side.png`
- Comparison viewport: source 1536 × 1024; implementation CSS viewport 1536 × 1024
- Pixel dimensions: source 1536 × 1024; implementation 1521 × 1014 after browser scrollbar/chrome exclusion
- Density normalization: both images were rendered at equal CSS width in the side-by-side comparison board; no density-only findings were filed
- State: homepage initial desktop view, light theme, no open menus

## Historical full-view comparison evidence

The selected design and implementation were opened together in one browser-rendered comparison board. The implementation preserves the source composition: editorial masthead and two-line claim on the left, full-height laboratory photograph on the right, restrained research metadata over the image, paired calls to action, and a four-column editorial product story immediately below the hero.

The generated laboratory photograph matches the source subject, lighting, crop intent, and muted green/ivory palette. The generated LabID wordmark is used as a real image asset rather than a CSS drawing. The remaining page extends the same visual system through cases, consultation form, and footer.

## Focused-region comparison evidence

The hero was reviewed at full readable size because typography, image crop, CTA sizing, and metadata alignment are the highest-fidelity surfaces. A separate consultation-section screenshot verifies the dark conversion section, field alignment, contrast, and button placement. No additional crop was necessary for the comparatively simple product columns.

## Historical fidelity surfaces

- Fonts and typography: Chinese display copy uses an editorial serif stack, English masthead uses a restrained book serif, and navigation/body copy remains sans-serif. Final title wrapping matches the source's two-line structure at the comparison viewport.
- Spacing and layout rhythm: header, masthead rule, hero split, image height, CTA row, and product transition align closely with the selected design. The public page keeps a wide editorial canvas while preserving the existing responsive section shell.
- Colors and tokens: warm ivory, deep ink green, muted gray-green, and low-contrast rules are consistent with the source. No saturated gradients, glassmorphism, or template-like tech blue were introduced.
- Image quality and asset fidelity: the hero photograph and wordmark are generated raster assets. Each case cover is now a direct 1280 × 720 capture of its corresponding virtual demo, while remaining CMS-overridable. No visible hero illustration or logo was replaced by CSS/div art.
- Copy and content: CMS-controlled production copy is intentionally retained where the generated concept used illustrative wording. Product meaning, target audience, and conversion actions remain equivalent.

## Comparison history

### Iteration 1

- Finding [P1]: the title wrapped to three lines instead of the source's two, materially weakening the hero hierarchy.
- Finding [P2]: the hero canvas was too narrow and inset too far from the right edge.
- Fixes: widened the editorial hero canvas, adjusted the grid proportions, and recalibrated title width and type scale.
- Post-fix evidence: `implementation-desktop-v2.png` restores the two-line title and source-like image proportion.

### Iteration 2

- Finding [P2]: the title was visually too compact vertically and the product story started lower than the source.
- Fixes: increased display scale with controlled horizontal compression, tightened hero height, and removed excess product top padding.
- Post-fix evidence: `implementation-desktop-v3.png` and `desktop-side-by-side.png` show aligned hero rhythm and section transition.

### Final pass

No actionable P0, P1, or P2 differences remain.

### Narrow-screen follow-up

- Finding [P1]: at 940px the hero inherited desktop-sized media and metadata, making the top of the page feel like two oversized, competing panels.
- Finding [P2]: the case cards mixed aspect ratios and grid spans; the third item did not follow the same reading order as the first two.
- Fixes: removed fixed narrow-screen hero heights, introduced 16:10 and 4:3 responsive media ratios, hid nonessential image metadata below 1080px, and tightened copy/CTA spacing. Cases now use three equal columns on desktop, consistent horizontal rows at tablet widths, and stacked cards below 720px.
- Asset correction: `/case-life.png`, `/case-chem.png`, and `/case-materials.png` are actual first-screen captures of the three virtual cases. Existing CMS records using the original placeholder SVG paths migrate automatically; custom covers are preserved.
- Post-fix evidence: `output/product-design/narrow-after-fix.png` and `output/product-design/narrow-cases-after-fix.png`.
- Measured at 940px: all three case cards are 840 × 343.8px, with identical 550.1px image columns and 264.9px information columns.

### Vertical-layout rule

- Finding [P1]: desktop Hero and several section headings used title/content side-by-side compositions, conflicting with the required linear reading order.
- Fixes: Hero, product, cases, and contact now render their complete heading groups before any media, cards, details, or forms. Columns remain only inside the content body after the heading.
- CMS alignment: the homepage live preview now places its Hero visual beneath the title, description, and CTA.
- Responsive evidence: `output/product-design/vertical-layout-1440.png`, `vertical-layout-1024.png`, `vertical-layout-768.png`, and `vertical-layout-390.png`.
- Measured result: at all four viewports, each section body begins at or below the bottom edge of its heading group, and document scroll width never exceeds the available content viewport.

### Immersive-Hero and typography annotations

- The clean laboratory image is now the full Hero background; the Slogan and description sit at the top of the content stack while the CTA pair is anchored to the bottom. The redundant audience line is removed.
- White and reduced-opacity white text plus a restrained dark gradient maintain contrast without baking text into the image.
- Product, case, and contact introductions use 18px body copy. Product value descriptions and all non-button form copy use 16px.
- Product, case, and contact headings omit terminal punctuation and remain on one line at wide desktop widths; their single-sentence introductions follow the same wide-screen rule and wrap naturally below 1080px.
- The standalone response block was removed. Its 48-hour promise now follows the privacy copy inside the form footer; the prompt and button stack at the form's lower-right on desktop.
- The desktop Hero uses a 120px Slogan-to-description gap; the form footer prompt expands to the full inner width and stays on one line at wide desktop sizes, then wraps naturally below 1080px.
- Post-fix evidence: `hero-overlay-visible.png`, `hero-overlay-mobile.png`, and `contact-typography-after.png`.

## Primary interactions tested

- Product, case, and contact anchors remain real links.
- Contact navigation scrolls to the form.
- Empty form submission exposes five invalid fields and the expected validation status.
- Browser page console contained no application errors or warnings.
- ESLint, seven automated tests, TypeScript, and the production build pass.

## Follow-up polish

- [P3] Production typography can be made even more deterministic later by self-hosting the chosen Chinese serif family; the current stack favors common system and open-source serif faces without adding a blocking font download.

final result: passed
