import re
import os

with open("index.html", "r", encoding="utf-8") as f:
    index_content = f.read()

# 1. Extract Header
header_match = re.search(r'<header.*?id="main-header".*?</header>', index_content, re.DOTALL)
if not header_match:
    print("Header not found")
    exit(1)
header_html = header_match.group(0)

# Make links absolute for subpages (if they point to sections)
header_html = header_html.replace('href="#hero"', 'href="index.html#hero"')
header_html = header_html.replace('href="#nosotros"', 'href="index.html#nosotros"')
header_html = header_html.replace('href="#conocenos"', 'href="index.html#conocenos"')
header_html = header_html.replace('href="#galeria"', 'href="galeria.html"')
header_html = header_html.replace('href="#servicios"', 'href="index.html#servicios"')
header_html = header_html.replace('href="#reservas"', 'href="index.html#reservas"')

# 2. Extract Modals (Mi Perfil and Barber Booking Auth Modal)
perfil_match = re.search(r'<!-- MI PERFIL MODAL -->.*?</div>\s*</div>\s*</div>', index_content, re.DOTALL)
auth_modal_match = re.search(r'<!-- Barber Booking Auth Modal -->.*?</div>\s*</div>\s*</div>\s*</div>', index_content, re.DOTALL)

# 3. Extract Chatbot Widget
chatbot_match = re.search(r'<!-- Chatbot IA Widget -->.*?<script src="chatbot.js"></script>', index_content, re.DOTALL)

# 4. Extract Auth.js and booking.js script tags
scripts_match = re.search(r'<!-- Firebase / Auth Logic \(Module\) -->.*?</script>', index_content, re.DOTALL)

for file in ["galeria.html", "douglas.html", "cristopher.html", "admin.html", "index.html"]:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace header
    content = re.sub(r'<header.*?id="main-header".*?</header>', header_html, content, flags=re.DOTALL)
    
    # Add chatbot.css to head
    if 'chatbot.css' not in content:
        content = content.replace('</head>', '    <link rel="stylesheet" href="chatbot.css" />\n  </head>')

    # For subpages, we also need to make sure they have the modals, chatbot, and scripts before </body>
    if file != "index.html":
        # Remove old scripts at bottom to avoid duplicates
        content = re.sub(r'<!-- Chatbot IA Widget -->.*', '</body>\n</html>', content, flags=re.DOTALL)
        content = re.sub(r'<!-- MI PERFIL MODAL -->.*', '</body>\n</html>', content, flags=re.DOTALL)
        
        # Build new bottom block
        bottom_html = ""
        if perfil_match and "MI PERFIL MODAL" not in content:
            bottom_html += "\n    " + perfil_match.group(0) + "\n"
        if auth_modal_match and "Barber Booking Auth Modal" not in content:
            bottom_html += "\n    " + auth_modal_match.group(0) + "\n"
        if chatbot_match and "Chatbot IA Widget" not in content:
            bottom_html += "\n    " + chatbot_match.group(0) + "\n"
        
        # Check if auth.js is imported
        if 'auth.js' not in content:
            bottom_html += '\n    <!-- Firebase / Auth Logic (Module) -->\n    <script type="module" src="auth.js?v=8"></script>\n'
        
        content = content.replace('</body>', bottom_html + '\n  </body>')

    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

print("Layout synced to all files.")
