#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate --noinput

# RESET DATA (Temporary)
python reset_db_data.py

# Collect static files
python manage.py collectstatic --noinput --clear
