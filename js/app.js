// Screen swapper 

const app = document.getElementById("app");

function go(name, params = {}) {
  const screen = screens[name];
  const nav = screen.tab ? navBar(screen.tab) : "";
  // Render the screen and navigation bar
  app.innerHTML = `<div class="content">${screen.view(params)}</div>${nav}`;
}

// Start app on the login screen 
go("login");  