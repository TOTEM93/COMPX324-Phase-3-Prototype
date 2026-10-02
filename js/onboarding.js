:root {
  --screen-width: 390px;
  --screen-height: 844px;
  --bg: #ffffff;
  --page-bg: #e5e7eb;
  --text: #111827;
  --font: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  font-family: var(--font);
  color: var(--text);
}
 */
body {
  background: var(--page-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

#app {
  position: relative;
  width: var(--screen-width);
  height: var(--screen-height);
  max-height: 100vh;
  background: var(--bg);
  border-radius: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

@media (max-width: 500px) {
  body {
    background: var(--bg);
    display: block;
  }

  #app {
    width: 100%;
    height: 100%;
    max-height: none;
    border-radius: 0;
    box-shadow: none;
  }
}