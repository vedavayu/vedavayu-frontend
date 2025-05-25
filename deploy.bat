@echo off
REM Script to deploy frontend changes to Vercel

echo Committing frontend changes...
cd /d d:\Samiran\Sami\vedavayu-frontend
git add .
git commit -m "Fix CORS issues and add API fallback mechanism"
git push origin main

echo Frontend changes pushed to repository.
echo Vercel will automatically redeploy the application.
echo Please wait a few minutes for the changes to take effect.
echo ----------------------------------------------
echo Deployment Instructions:
echo 1. Wait for both backend and frontend deployments to complete (5-10 minutes)
echo 2. Test your application by visiting your Vercel frontend URL
echo 3. If you're still seeing CORS errors, check the Render logs
echo ----------------------------------------------
pause
