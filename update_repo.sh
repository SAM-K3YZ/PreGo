#!/bin/sh
git add .
git commit -m "Update: $(date)"
git pull --rebase origin main
git push origin main
