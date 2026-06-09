@echo off
echo [1/4] Generating Hugo stats (including drafts for CSS)...
hugo --buildDrafts

echo [2/4] Copying hugo_stats.json to theme...
copy hugo_stats.json themes\void\hugo_stats.json > nul

echo [3/4] Building Tailwind CSS...
cd themes\void
call npx tailwindcss -i ./assets/css/main.css -o ./assets/css/style.css
cd ..\..

echo [4/4] Building production site...
hugo --minify

echo Done!
