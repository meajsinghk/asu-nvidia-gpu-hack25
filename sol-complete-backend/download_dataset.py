"""
Dataset Downloader for NYC Parking Violations
Automatically downloads and prepares the dataset for GPU processing
"""

import requests
import pandas as pd
import os
from datetime import datetime
import random

def download_parking_violations_sample():
    """Download a sample of NYC Parking Violations data"""
    
    print("🔄 Downloading NYC Parking Violations dataset...")
    
    # NYC Open Data API endpoint with limit for manageable size
    # Full dataset is ~10GB, we'll download a representative sample
    api_url = "https://data.cityofnewyork.us/resource/7mxj-7a6y.csv"
    
    # Parameters for the API call
    params = {
        "$limit": 100000,  # Download 100k records for demo
        "$order": "issue_date DESC",  # Get recent violations
    }
    
    try:
        print(f"📡 Requesting {params['$limit']} records from NYC Open Data...")
        response = requests.get(api_url, params=params, timeout=60)
        response.raise_for_status()
        
        # Save the dataset
        filename = "parking_violations_2022_sample.csv"
        with open(filename, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Dataset downloaded: {filename}")
        
        # Verify the download
        df = pd.read_csv(filename)
        print(f"📊 Dataset shape: {df.shape}")
        print(f"🏷️ Columns: {list(df.columns)}")
        
        # Show target columns if available
        target_columns = ['violation_time', 'violation_location', 'street_name', 'days_parking_in_effect']
        available_targets = [col for col in target_columns if col in df.columns]
        
        if available_targets:
            print(f"🎯 Target columns found: {available_targets}")
        else:
            print("⚠️ Target columns not found with exact names")
            print("📋 Available columns that might match:")
            for col in df.columns:
                if any(keyword in col.lower() for keyword in ['time', 'location', 'street', 'parking']):
                    print(f"   - {col}")
        
        return filename
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to download dataset: {e}")
        print("🔄 Creating mock dataset for testing...")
        return create_mock_dataset()
    
    except Exception as e:
        print(f"❌ Error processing dataset: {e}")
        print("🔄 Creating mock dataset for testing...")
        return create_mock_dataset()

def create_mock_dataset():
    """Create a mock dataset for testing when real data isn't available"""
    
    print("🔄 Creating mock parking violations dataset...")
    
    n_records = 50000
    
    # Generate realistic mock data
    violations_data = []
    
    # Base datetime
    base_date = datetime(2022, 1, 1)
    
    # NYC street names
    street_names = [
        "BROADWAY", "MAIN ST", "PARK AVE", "LEXINGTON AVE", "MADISON AVE",
        "5TH AVE", "7TH AVE", "8TH AVE", "42ND ST", "34TH ST",
        "WALL ST", "HOUSTON ST", "CANAL ST", "DELANCEY ST", "GRAND ST",
        "BLEECKER ST", "WEST SIDE HWY", "FDR DR", "QUEENS BLVD", "FLATBUSH AVE"
    ]
    
    # Violation codes and descriptions
    violation_codes = [
        (21, "Street Cleaning"),
        (20, "No Parking"),
        (14, "General No Parking"),
        (38, "Meter Violation"),
        (37, "Expired Meter"),
        (46, "Double Parking"),
        (40, "Fire Hydrant"),
        (71, "Passenger Loading Zone")
    ]
    
    # NYC precincts
    precincts = list(range(1, 124))
    
    # Parking restriction days
    parking_days = ["MON-FRI", "ALL WEEK", "SAT-SUN", "MON-SAT", "SCHOOL DAYS"]
    
    print(f"🔄 Generating {n_records} mock records...")
    
    for i in range(n_records):
        # Random datetime in 2022
        days_offset = random.randint(0, 365)
        hours_offset = random.randint(0, 23)
        minutes_offset = random.randint(0, 59)
        
        violation_datetime = base_date.replace(
            month=random.randint(1, 12),
            day=random.randint(1, 28)
        ).replace(
            hour=hours_offset,
            minute=minutes_offset
        )
        
        violation_code, violation_desc = random.choice(violation_codes)
        
        record = {
            'summons_number': f'1{random.randint(100000000, 999999999)}',
            'plate_id': f'{"".join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", k=7))}',
            'registration_state': random.choice(['NY', 'NJ', 'CT', 'PA', 'MA']),
            'issue_date': violation_datetime.strftime('%Y-%m-%d'),
            'violation_time': violation_datetime.strftime('%H%M%S'),  # Target column
            'violation_code': violation_code,
            'violation_location': random.choice(precincts),  # Target column
            'violation_precinct': random.choice(precincts),
            'street_name': random.choice(street_names),  # Target column
            'days_parking_in_effect': random.choice(parking_days),  # Target column
            'vehicle_make': random.choice(['TOYOTA', 'HONDA', 'FORD', 'CHEVROLET', 'NISSAN']),
            'fine_amount': random.choice([25, 35, 45, 50, 65, 115, 180]),
            'issuing_agency': 'POLICE'
        }
        
        violations_data.append(record)
    
    # Create DataFrame and save
    df = pd.DataFrame(violations_data)
    filename = "mock_parking_violations.csv"
    df.to_csv(filename, index=False)
    
    print(f"✅ Mock dataset created: {filename}")
    print(f"📊 Dataset shape: {df.shape}")
    print(f"🎯 Target columns included: violation_time, violation_location, street_name, days_parking_in_effect")
    
    return filename

def verify_dataset(filename):
    """Verify the dataset is ready for GPU processing"""
    
    print(f"🔍 Verifying dataset: {filename}")
    
    try:
        df = pd.read_csv(filename)
        
        print(f"✅ Dataset loaded successfully")
        print(f"📊 Shape: {df.shape}")
        print(f"💾 Size: {os.path.getsize(filename) / (1024*1024):.1f} MB")
        
        # Check target columns
        target_columns = ['violation_time', 'violation_location', 'street_name', 'days_parking_in_effect']
        available_targets = [col for col in target_columns if col in df.columns]
        
        print(f"🎯 Target columns available: {len(available_targets)}/{len(target_columns)}")
        for col in available_targets:
            non_null = df[col].notna().sum()
            print(f"   - {col}: {non_null}/{len(df)} records ({non_null/len(df)*100:.1f}%)")
        
        # Sample data preview
        print("\n📋 Sample data:")
        print(df[available_targets[:3]].head(3).to_string())
        
        return True
        
    except Exception as e:
        print(f"❌ Dataset verification failed: {e}")
        return False

if __name__ == "__main__":
    # Download or create dataset
    dataset_file = download_parking_violations_sample()
    
    # Verify it's ready
    if verify_dataset(dataset_file):
        print(f"\n🎉 Dataset ready for GPU processing!")
        print(f"📁 File: {dataset_file}")
        print(f"🚀 Your friend can now run the Sol backend!")
    else:
        print(f"\n❌ Dataset preparation failed")
