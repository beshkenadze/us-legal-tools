export function errorPage(title: string, message: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Error - ${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: #f5f5f5;
        }
        .error-container {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          max-width: 500px;
          text-align: center;
        }
        h1 {
          color: #dc2626;
          margin-bottom: 1rem;
        }
        p {
          color: #666;
          line-height: 1.5;
        }
        a {
          display: inline-block;
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 4px;
        }
        a:hover {
          background: #1d4ed8;
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <h1>${title}</h1>
        <p>${message}</p>
        <a href="/">← Back to Home</a>
      </div>
    </body>
    </html>
  `;
}