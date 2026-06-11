
--- Guide for parallax-scroll-effects ---
# Build a Parallax Effect on Scroll

A parallax effect on scroll is a visual technique where different layers of content move at varying speeds as the user scrolls down a page. This creates an illusion of depth, with foreground elements appearing to move faster than the background elements, resulting in an engaging and immersive browsing experience. This effect is best achieved using CSS Scroll-Driven Animations, which allow you to link animations to the scroll position of a container.

## How to implement

Here’s how to create a basic parallax effect:

1.  **Create a wrapper element:** This element simply groups all the layers of the parallax effect together. It is not the scrollable element, so its overflow should be clipped. Also give it a `height` that matches the height of one of the layers of the parallax effect.

    ```html
    <div class="wrapper">
      …
    </div>
    ```

    ```css
    .wrapper {
      overflow: clip;
      height: 100vh; /* Height of one of the layers of the parallax */
    }
    ```

2.  **Declare the layers:** Inside the wrapper, add the individual layers that will move at different speeds.

    ```html
    <div class="wrapper">
      <div class="layer">LAYER 0</div>
      <div class="layer">LAYER 1</div>
      <div class="layer">LAYER 2</div>
      …
    </div>
    ```

3.  **Add a translate animation:** Define a CSS animation that changes the `transform` property of the layers. For a parallax effect, you'll typically use `translateY` to move the layers vertically.

    ```css
    @keyframes parallax {
      from {
        transform: translateY(700px);
      }
    }
    ```

4.  **Set up the `view-timeline`:** To link the animation to the scroll position, create a `view-timeline` on the wrapper element and then apply it to the layers.

    ```css
    .wrapper {
      view-timeline: --wrapper;
    }

    .layer {
      animation: parallax linear both;
      animation-timeline: --wrapper;
    }
    ```

5.  **Stagger the animations:** To make the layers move at different speeds, you can use one of two main approaches: **staggering in the keyframes**, or **staggering the `animation-range`**. 

    Both of these approaches can use hardcoded values, or can use the `sibling-index()`/`sibling-count()` implementation. The hardcoded values are easiest and also useful when having only a limited amount of layers. The `sibling-index()`/`sibling-count()` implementation is handy when you have many layers.

    *   **Staggering in the keyframes:**

        Using **hardcoded values**, you can define a custom property for each layer to manually control its parallax offset.

        ```css
        .layer:nth-child(1) { --offset: 100px; }
        .layer:nth-child(2) { --offset: 200px; }
        .layer:nth-child(3) { --offset: 300px; }

        @keyframes parallax {
          from {
            transform: translateY(var(--offset));
          }
        }
        ```

        Using **`sibling-index()`**, let the `sibling-index()` function return the index of a child element amongst its siblings to automatically calculate the staggered effect.

        ```css
        @keyframes parallax {
          from {
            transform: translateY(calc(100px * sibling-index()));
          }
        }
        ```

    *   **Staggering the `animation-range`:**

        Using **hardcoded values**, you can explicitly define the boundaries of the `animation-range` on each layer individually.

        ```css
        .layer:nth-child(1) { animation-range: entry 25% exit 50%; }
        .layer:nth-child(2) { animation-range: entry 25% exit 75%; }
        .layer:nth-child(3) { animation-range: entry 25% exit 100%; }
        ```

        Using **`sibling-index()` and `sibling-count()`**, you can calculate the range mathematically based on the total number of layers (`sibling-count()`).

        ```css
        .layer {
          animation-range: entry 25% exit calc(100% / sibling-count() * sibling-index());
        }
        ```

## Example code

```css
@keyframes parallax {
  from {
    transform: translateY(calc(100px * sibling-index()));
  }
}

.wrapper {
  view-timeline: --wrapper;
}

.layer {
  animation: parallax linear both;
  animation-timeline: --wrapper;
}

@media (prefers-reduced-motion: reduce) {
  .layer {
    animation: none;
  }
}
```

Alternatively, you can use the `animation-range` property to achieve a similar effect:

```css
@keyframes parallax {
  from {
    transform: translateY(700px);
  }
}

.wrapper {
  view-timeline: --wrapper;
}

.layer {
  animation: parallax linear both;
  animation-timeline: --wrapper;
  animation-range: entry 25% exit calc(100% / sibling-count() * sibling-index());
}

@media (prefers-reduced-motion: reduce) {
  .layer {
    animation: none;
  }
}
```

## Best Practices

When using scroll-driven animations, it's important to follow a few best practices to ensure a smooth and accessible experience:

- **DO** include feature detection: Not all browsers support scroll-driven animations. Use `@supports ((animation-timeline: view()) and (animation-range: entry))` to check for support and provide a fallback for browsers that don't support it.
  - The `(animation-range: entry)` check **MUST** be included here, to filter out browsers with only partial support.
  - **DO NOT** use the `scroll-timeline-polyfill` package for the fallback strategy as it is not feature complete and has a lot of known issues.
  - If the animation is only considered to be decorative, opt for Progressive Enhancement and **DO NOT** provide a fallback.
- **DO** respect user preferences: Some users prefer to have less motion on the web. Use the `prefers-reduced-motion` media query to disable or reduce your animations for these users.
- **DO** try to animate only performant CSS properties: For the smoothest animations, stick to animating properties that can be handled by the browser's compositor thread, such as `transform` and `opacity`. Animating other properties like `width` or `height` can lead to performance issues.
- **DO** use the correct declaration order: When using the `animation` shorthand property, declare `animation-timeline` and `animation-range` *after* it to prevent the shorthand from resetting the timeline.

As for setting the `animation-range`:

- **DO** give all layers the same start offset, e.g. `entry 25%`
- **DO** give all layers a different end offset that uses `sibling-count()` and `sibling-index()` to distribute the offsets, e.g. `exit calc(100% / sibling-count() * sibling-index())`.


## Browser support and fallback strategies

Scroll-driven animations has limited availability.
Supported by: Chrome 115 (Jul 2023), Edge 115 (Jul 2023), and Safari 26 (Sep 2025).
Unsupported in: Firefox.. Therefore, a fallback strategy is typically required.

For browsers that do not support scroll-driven animations, you can use a fallback to recreate the visual effects. The fallbacks are typically built with either a scroll listener (for ScrollTimeline effects) or the IntersectionObserver API (for ViewTimeline effects).

In browsers with built-in support for scroll-driven animations, ALWAYS use the native CSS implementation as those are more performant.

Note that not every effect can be recreated using the fallbacks approach.

For this use-case specifically, the following script applies the fallback for browsers that do not support scroll-driven animations. It uses an `IntersectionObserver` to track the visibility of the `.wrapper` element and updates the `transform` property of the layers based on the scroll position.

```js
// Fallback for browsers that don't support scroll-driven animations
if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
  const wrapper = document.querySelector('.wrapper');
  const layers = document.querySelectorAll('.layer');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        window.addEventListener('scroll', onScroll);
      } else {
        window.removeEventListener('scroll', onScroll);
      }
    });
  }, { threshold: 0 });

  observer.observe(wrapper);

  function onScroll() {
    const scrollY = window.scrollY;
    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperTop = wrapperRect.top + scrollY;
    const wrapperHeight = wrapperRect.height;
    const windowHeight = window.innerHeight;

    if (scrollY >= wrapperTop - windowHeight && scrollY <= wrapperTop + wrapperHeight) {
      const scrollPercent = (scrollY - (wrapperTop - windowHeight)) / (wrapperHeight + windowHeight);
      
      layers.forEach((layer, index) => {
        // This matches the effect as defined in the CSS example above.
        // Customize this further if needed.
        const initialTranslateY = 100 * index;
        const translateY = initialTranslateY * (1 - scrollPercent);
        layer.style.transform = `translateY(${translateY}px)`;
      });
    }
  }

  // Trigger onScroll once to set initial positions
  onScroll();
}
```


--- Guide for scroll-entry-exit-effects ---
# Add entry and exit effects to elements as they enter or exit the scrollport

Entry and exit effects are animations that are triggered when an element enters or leaves the viewport. This can be used to create engaging and dynamic user experiences. For example, you can use an entry effect to fade in an element as it scrolls into view, or an exit effect to scale it down as it scrolls out of view.

## How to implement

To add entry and exit effects to an element, you need to combine a few CSS properties. Here’s a step-by-step guide:

1.  **Create separate `@keyframes` for the entry and exit animations.** The entry animation will be applied as the element enters the viewport, and the exit animation will be applied as it leaves.

    ```css
    @keyframes slide-in {
      from { transform: translateX(-100%); }
    }
    @keyframes slide-out {
      to { transform: translateX(100%); }
    }
    ```

2.  **Attach the entry and exit keyframes to the element.** You can do this by defining multiple animations in the `animation` property.

    -   Give the entry animation an `animation-fill-mode` of `backwards` so that it applies its initial state before the animation starts.
    -   Give the exit animation an `animation-fill-mode` of `forwards` so that it maintains its final state after the animation is complete.

    ```css
    .animated-element {
      animation:
        slide-in 1s linear backwards,
        slide-out 1s linear forwards;
    }
    ```

3.  **Create a View Timeline and link it to the animations.** A View Timeline is a type of timeline that is linked to the visibility of an element in the viewport. You can create one using the `view()` function and then apply it to your animations using the `animation-timeline` property.

    ```css
    .animated-element {
      animation-timeline: view();
    }
    ```

    By default, `view()` tracks the element on the `block` axis. If you need to track it on the `inline` axis, you can use `view(inline)`.

4.  **Limit the animations to the `entry` and `exit` ranges.** The `animation-range` property allows you to specify which part of the timeline an animation should run on.

    -   The `entry` range covers the time from when the element first enters the viewport until it is fully visible.
    -   The `exit` range covers the time from when the element starts to leave the viewport until it is completely hidden.

    ```css
    .animated-element {
      animation-range: entry, exit;
    }
    ```

## Example code

This code animates the direct children of the scroller on scroll using an **anonymous view-timeline**:

```css
@media (prefers-reduced-motion: no-preference) {
  @supports ((animation-timeline: view()) and (animation-range: entry)) {
    @keyframes grow {
      from {
        scale: 0.5;
      }
    }
    @keyframes shrink {
      to {
        scale: 0.5;
      }
    }

    .scroller > * {
      animation:
        grow auto linear backwards,
        shrink auto linear forwards;
      animation-timeline: view(inline);
      animation-range: entry, exit;
    }
  }
}
```

As the elements enter the scrollport the `grow` animation is played, and as they leave the scrollport the `shrink` animation is played.

The following code has the same visual outcome, but animates the direct children of the scroller on scroll using an **named view-timeline**:

```css
@media (prefers-reduced-motion: no-preference) {
  @supports ((animation-timeline: view()) and (animation-range: entry)) {
    @keyframes grow {
      from {
        scale: 0.5;
      }
    }
    @keyframes shrink {
      to {
        scale: 0.5;
      }
    }

    .scroller > * {
      view-timeline: --tl inline;
      animation:
        grow auto linear backwards,
        shrink auto linear forwards;
      animation-timeline: --tl;
      animation-range: entry, exit;
    }
  }
}
```

## Best Practices

When using scroll-driven animations, it's important to follow a few best practices to ensure a smooth and accessible experience:

- **DO** include feature detection: Not all browsers support scroll-driven animations. Use `@supports ((animation-timeline: view()) and (animation-range: entry))` to check for support and provide a fallback for browsers that don't support it.
  - The `(animation-range: entry)` check **MUST** be included here, to filter out browsers with only partial support.
  - **DO NOT** use the `scroll-timeline-polyfill` package for the fallback strategy as it is not feature complete and has a lot of known issues.
  - If the animation is only considered to be decorative, opt for Progressive Enhancement and **DO NOT** provide a fallback.
- **DO** respect user preferences: Some users prefer to have less motion on the web. Use the `prefers-reduced-motion` media query to disable or reduce your animations for these users.
- **DO** try to animate only performant CSS properties: For the smoothest animations, stick to animating properties that can be handled by the browser's compositor thread, such as `transform` and `opacity`. Animating other properties like `width` or `height` can lead to performance issues.
- **DO** use the correct declaration order: When using the `animation` shorthand property, declare `animation-timeline` *after* it to prevent the shorthand from resetting the timeline.

When using the `view()` function to create a scroll-driven animation:

- **OPTIONAL** be explicit about the axis to track: When not targeting the default `block` axis (such as in a horizontal scroller), be explicit about which axis to track with `view(block)` or `view(inline)`.
- When the animation is not applied to the tracked subject itself, use a named view timeline.

When using the `view-timeline` property to create a scroll-driven animation:

- **DO** use a CSS `<dashed-ident>` for the name.
- **OPTIONAL** be explicit about the axis to track: When not targeting the default `block` axis (such as in a horizontal scroller), be explicit about which axis to track with `view-timeline-axis`.
- **DO** make sure the scope of the lookup works: When the element that is declaring the `view-timeline` is not a flat tree ancestor of the animated element, hoist up the visibility of the `view-timeline`’s name by using `timeline-scope` on a shared ancestor.

Prefer a named `view-timeline` when multiple elements or children of the tracked subject need to animate.

## Browser support and fallback strategies

Scroll-driven animations has limited availability.
Supported by: Chrome 115 (Jul 2023), Edge 115 (Jul 2023), and Safari 26 (Sep 2025).
Unsupported in: Firefox.. Therefore, a fallback strategy is typically required.

For browsers that do not support scroll-driven animations, you can use a fallback to recreate the visual effects. The fallbacks are typically built with either a scroll listener (for ScrollTimeline effects) or the IntersectionObserver API (for ViewTimeline effects).

In browsers with built-in support for scroll-driven animations, ALWAYS use the native CSS implementation as those are more performant.

Note that not every effect can be recreated using the fallbacks approach.

For this use-case specifically, the following script applies the fallback for browsers that do not support scroll-driven animations. It uses an `IntersectionObserver` to track the visibility of the `.wrapper` element and updates the `transform` property of the layers based on the scroll position.

```html
<script>
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // This matches the effect as defined in the CSS example above.
          // Customize this further if needed.
          entry.target.style.scale = 0.5 + entry.intersectionRatio * 0.5;
        }
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      }
    );

    document.querySelectorAll('.scroller > *').forEach((el) => {
      observer.observe(el);
    });
  }
</script>
```


--- Guide for apply-webgl-shaders ---
# Apply WebGL shaders to HTML content

WebGL shaders provide powerful GPU-accelerated visual effects, enabling advanced capabilities like dynamic ripple distortions, lighting models, color grading, and custom vertex transformations. The HTML-in-Canvas API allows developers to apply WebGL textures to HTML content. This enables applying high-performance fragment and vertex shaders natively to fully interactive UI components, such as buttons, input fields, and rich text, while retaining native accessibility, text selection, and DOM event handling.

## How to implement

1. Check if HTML-in-Canvas is supported in the browser:

```
if ('requestPaint' in HTMLCanvasElement.prototype) {
  // Use HTML in Canvas API
} else {
  // Use fallback strategy
}
```

2. Add the `layoutsubtree` attribute to the `<canvas>` HTML element.
3. Place your HTML content inside the `<canvas>` element with the `layoutsubtree` attribute.

```html
<canvas id="canvas" layoutsubtree>
  <div id="html-content"></div>
</canvas>
```

4. Scale your canvas grid to match the device scale factor to prevent blurriness:

```js
const observer = new ResizeObserver(([entry]) => {
  const dpc = entry.devicePixelContentBoxSize;
  canvas.width = dpc
    ? dpc[0].inlineSize
    : Math.round(entry.contentRect.width * window.devicePixelRatio);
  canvas.height = dpc
    ? dpc[0].blockSize
    : Math.round(entry.contentRect.height * window.devicePixelRatio);
});

const supportsDevicePixelContentBox =
  typeof ResizeObserverEntry !== "undefined" &&
  "devicePixelContentBoxSize" in ResizeObserverEntry.prototype;
const options = supportsDevicePixelContentBox
  ? { box: "device-pixel-content-box" }
  : {};
observer.observe(canvas, options);
```

5. Render the HTML content to the canvas inside a `canvas.onpaint` event handler using the `texElementImage2D` method:

```js
canvas.onpaint = () => {
  if (gl.texElementImage2D) {
    gl.texElementImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      uiElement,
    );
  }
};
```

  When using a `requestAnimationFrame` loop to render the scene, call `canvas.requestPaint()` within the loop to ensure that the HTML content is rendered to the canvas. Make sure you only re-render the canvas if there has been an update to the descendant HTML elements:

  ```js
  function render() {
    // Request to update the canvas
    canvas.requestPaint();
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  canvas.onpaint = (event) => {
    if (event.changedElements && event.changedElements.length > 0) {
      // Update the texture with texElementImage2D, and update the CSS transform as shown in step 6
    }
  };
  ```

6. Update the CSS transform.

The browser needs to map from the 3D coordinate space into the CSS coordinate space using a viewport transform. To facilitate this, do the following:
  - Convert WebGL MVP Matrix to DOM Matrix.
  - Normalize the HTML element. HTML elements are sized in pixels (for example, 200px wide). WebGL, however, usually treats objects as "unit squares", for example, ranging from 0 to 1. If you don't normalize, your 200px button will look 200 times larger.
  - Map to the canvas viewport. This step is the "re-scaling" phase: it stretches that unit-space math back out to match the actual pixel dimensions of your `<canvas>` element on the screen. It also flips the Y-axis, because in WebGL, up is positive, but in CSS, down is positive.
  - Calculate the final transform. Multiply the matrices in order: Viewport * MVP * Normalization. Combining them into one final transform produces a "map" that tells the browser exactly where that HTML element layer should sit to align with the 3D drawing.
  - Apply the transform to the HTML element. This moves the HTML element layer to sit directly on top of its rendered pixels. This ensures that when a user clicks a button or selects text, they are actually hitting the real HTML element.

  ```js
  if (canvas.getElementTransform) {
    // 1. Convert WebGL MVP Matrix to DOM Matrix
    const mvpDOM = new DOMMatrix(Array.from(htmlElementMVP));

    // 2. Normalize the HTML element (Canvas Grid pixels -> WebGL Model Space)
    const dprX = canvas.width / canvas.clientWidth;
    const dprY = canvas.height / canvas.clientHeight;
    const gridWidth = targetHTMLElement.offsetWidth * dprX;
    const gridHeight = targetHTMLElement.offsetHeight * dprY;

    const toGLModel = new DOMMatrix()
      // Scale pixels to 1 unit, flip Y (as in CSS it points down, and in WebGL it points up)
      .scale(1 / gridWidth, -1 / gridHeight, 1 / gridHeight)
      // Center the origin: (0,0) becomes (-width/2, -height/2) before scaling
      .translate(-gridWidth / 2, -gridHeight / 2);

    // 3. Map to the canvas viewport
    const clipToCanvasViewport = new DOMMatrix()
      // Move center (0,0) to center of canvas
      .translate(canvas.width / 2, canvas.height / 2)
      // Scale normalized clip (-1..1) to viewport size
      .scale(canvas.width / 2, -canvas.height / 2, canvas.height / 2);

    // 4. Multiply: (Clip -> Pixels) * (MVP) * (pixels -> unit square)
    const screenSpaceTransform = clipToCanvasViewport
      .multiply(mvpDOM)
      .multiply(toGLModel);

    // 5. Apply to the transform
    const computedTransform = canvas.getElementTransform(
      targetHTMLElement,
      screenSpaceTransform,
    );
    targetHTMLElement.style.transform = computedTransform.toString();
  }
  ```

7. [Troubleshooting] If the developer is experiencing a mismatch in the DOM logical layout in 3D even after applying the CSS transform from step 5, check if the developer is experiencing the issue in Chromium 148 or earlier. If that's the case, check if `transform.is2D` is correctly set to false for a 3D DOMMatrix. If not, re-initialize the DOMMatrix which corrects `is2D` to be false before applying the transform to the target HTML element. This issue is fixed in Chromium 149+, and if the developer is experiencing it in newer Chromium versions, the is2D value is not the cause:

```js
if (transform.is2D) {
  // Workaround for Chromium bug https://crbug.com/512171941
  // affecting Chrome versions under 149 where `transform.is2D`
  // is incorrectly true for a 3D DOMMatrix. The assignment
  // below re-initializes the DOMMatrix which corrects is2D to be false.
  transform = DOMMatrix.fromFloat64Array(transform.toFloat64Array());
}
targetHTMLElement.style.transform = computedTransform.toString();
```

## Example code

```html
<canvas id="canvas" layoutsubtree style="width: 400px; height: 400px;">
  <div id="ui-element">
    <p>WebGL UI Element</p>
    <button>Action</button>
  </div>
</canvas>

<script>
  const canvas = document.getElementById("canvas");
  const gl = canvas.getContext("webgl");
  const uiElement = document.getElementById("ui-element");

  // Setup WebGL texture...
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  canvas.onpaint = () => {
    // 1. Update texture with HTML content
    if (gl.texElementImage2D) {
      gl.texElementImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        uiElement,
      );
    }

    // ... Render your 3D scene here, calculating htmlElementMVP matrix ...

    // 2. Sync DOM position with 3D scene
    if (canvas.getElementTransform) {
      const mvpDOM = new DOMMatrix(Array.from(htmlElementMVP));

      // Recalculate the DPR compensation mapping
      const dprX = canvas.width / canvas.clientWidth;
      const dprY = canvas.height / canvas.clientHeight;
      const gridWidth = uiElement.offsetWidth * dprX;
      const gridHeight = uiElement.offsetHeight * dprY;

      const cssToUnitSpace = new DOMMatrix()
        .scale(1 / gridWidth, -1 / gridHeight, 1 / gridHeight)
        .translate(-gridWidth / 2, -gridHeight / 2);

      const clipToCanvasViewport = new DOMMatrix()
        .translate(canvas.width / 2, canvas.height / 2)
        .scale(canvas.width / 2, -canvas.height / 2, canvas.height / 2);

      const screenSpaceTransform = clipToCanvasViewport
        .multiply(mvpDOM)
        .multiply(cssToUnitSpace);

      const computedTransform = canvas.getElementTransform(
        uiElement,
        screenSpaceTransform,
      );
      uiElement.style.transform = computedTransform.toString();
    }
  };
</script>
```

## Best Practices

- **MANDATORY**: Check browser support for the HTML-in-Canvas API before using it.
- **MANDATORY**: Always add the `layoutsubtree` attribute to the `<canvas>` element.
- **MANDATORY**: Use an `onpaint` event handler to render the HTML content to the canvas.
- **MANDATORY**: Use the `texElementImage2D` method to render the HTML content to the canvas.
- **MANDATORY**: Update the CSS transform of the HTML element to match the transform of the rendered content by setting the `style.transform` property of the HTML element.
- **MANDATORY**: Use `ResizeObserver` to observe the screen size and update the canvas size to match device pixels.
- **DO NOT** embed cross-origin content in a canvas, as it is not supported.
- **DO NOT** initialize `ResizeObserver` within the `onpaint` event handler, as it may lead to memory leaks.

### Fallback strategies

HTML in canvas is not natively supported by any major browser yet.

The HTML-in-Canvas API is not currently supported in all modern browsers, thus a fallback strategy is typically required.

However, given the improved performance benefits of this API, HTML-in-Canvas should be used if the browser supports it.

The fallback strategy depends on the use case. For example, for an interactive HTML content in canvas, if HTML-in-Canvas is not supported, place the HTML content on top of the canvas using CSS.

### HTML-in-Canvas polyfill

Use the following polyfill script to mimic the HTML-in-Canvas API in browsers that do not support it.

1. Install or embed the library:

```
# Install
npm install three-html-render
```

```
# Embed
<script src="https://cdn.jsdelivr.net/npm/three-html-render/dist/polyfill.js"></script>
```

2. Run the `installHtmlInCanvasPolyfill()` method to translate HTML-in-Canvas.

