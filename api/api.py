import time
import urllib.request
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from bs4 import BeautifulSoup
import platform
import psutil
import json
import socket
import os
import subprocess
from flask import Flask, request, jsonify
import re

nltk.download('punkt')
nltk.download('stopwords')

app = Flask(__name__)

@app.route('/api/summary', methods=['POST'])
def get_system_info():
    data = {}
    data["Windows_Mac_Update"] = get_windows_update_status()
    data["sfc_scannow"] = get_sfc_scan_status()
    data["Window_Genuine"] = get_windows_genuine_status()
    data["Battery_Health"] = get_battery_health()
    data["Wifi"] = get_wifi_signal_strength()
    data["Bluetooth"] = get_bluetooth_status()
    data["SSD_Health"] = format_disk_usage(psutil.disk_usage('/'))    
    data["Charging"] = psutil.sensors_battery().power_plugged if psutil.sensors_battery() else "No information of Charging"
    data["Processor"] = get_processor_type()
    data["Generation"] = platform.release()+'th'
    data["CMOS_battery"] = "Manual check required"
    data["Boot_Priority"] = get_boot_priority()
    data["Bios_Password"] = "Manual check required"
    data["OS_VERSION"] = get_os_version()
    data["Ethernet_port"] = get_ethernet_port_status()
    data["BIOS_update"] = get_bios_update_status()
    data["Device_Manager"] = get_device_manager_status()
    data["Facial_recognition"] = get_facial_recognition_status()
    data["Fingerprint"] = get_fingerprint_status()
    data["Battery sudden Drop"] = monitor_battery_drop()
    data["Battery Backup (in minutes)"] = get_battery_backup_status()
    data["Resolution"] = get_screen_resolution()
    data["RAM"] = get_ram()
    data["Storage Type"] = get_storage_type()
    data["Display Type/resolution"] = get_display_type()
    # data["Touch Screen"] = check_touch_screen()
    return jsonify(data)

# Formatting the SSD_Health details into a String
def format_disk_usage(disk_usage):
    free_space = disk_usage.free
    total_space = disk_usage.total

    health = (free_space*100)/total_space
    if health>75:
        return "Good"
    elif health>50 and health<=75:
        return "Average"
    else:
        return "Poor"
    

def run_command(command):
    """Executes a shell command and returns the output as a string."""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, check=True)
        if result.returncode == 0:
            return result.stdout.strip()
        else:
            return f"Command failed with exit status {result.returncode}: {result.stderr.strip()}"
    except Exception as e:
        return str(e)

def check_device_manager_status():
    if platform.system() == "Windows":
        # Fetch a list of devices using WMIC and check their status
        return run_command("wmic path Win32_PnPEntity get Name,Status")
    else:
        return "Not applicable"
    
def get_device_manager_status():
    """Check driver installation status using WMIC."""
    if platform.system() == "Windows":
        try:
            # Get all PnP devices and their drivers' last install date
            command = 'wmic path Win32_PnPSignedDriver get DeviceName,DriverDate'
            result = subprocess.run(command, shell=True, capture_output=True, text=True)

            # Analyze the driver dates to determine if any are outdated
            devices = result.stdout.splitlines()
            outdated_devices = [device for device in devices if "2022" not in device]  # Assuming 2022 as a recent year
            
            if len(outdated_devices) > 0:
                return "Pending updates"
            else:
                return "Updated"
        except Exception as e:
            return f"Error checking device updates: {str(e)}"
    else:
        return "Not applicable"
    
# Checking for sfc_scannow 
def get_sfc_scan_status():
    if platform.system() == "Windows":
        # Run the sfc /scannow command to check the system file integrity
        command = 'sfc /scannow'
    else:
        return "Manual Check Required"

    output = run_command(command).strip()

    # Analyze the output to categorize the results
    if "Windows Resource Protection did not find any integrity violations" in output:
        return "No Integrity Violations"
    elif "Windows Resource Protection found corrupt files and successfully repaired them" in output:
        return "Minor Issues"
    elif "Windows Resource Protection found corrupt files but was unable to fix some of them" in output:
        return "Major Issues"
    else:
        return "Unknown"

    
# Battery Backup

def get_battery_backup_status():
    if psutil.sensors_battery():
        battery_backup = psutil.sensors_battery().secsleft / 60

        if battery_backup >=100:
            return 'Greater than or equal to 100'
        elif battery_backup>=60 and battery_backup<100:
            return 'less than 100 and greater than or equal to 60'
        else:
            return "less than 60 mins"

# Battery Health
# Full Charge Capacity: This represents the maximum charge the battery currently holds.
# Design Capacity: This represents the original capacity of the battery when it was new.
# By comparing these two values, we can estimate the health of the battery.

def get_battery_health():
    if platform.system() == "Windows":
        command = 'powercfg /batteryreport /output battery_report.xml'
    else:
        return "Manual Check Required"

    output = run_command(command)

    try:
        # Read the battery report file
        with open("battery_report.xml", "r") as file:
            data = file.read()

        # Extract Full Charge Capacity
        full_charge_capacity_match = re.search(r'FULL CHARGE CAPACITY.*?(\d+)', data, re.DOTALL)
        if full_charge_capacity_match:
            full_charge_capacity = int(full_charge_capacity_match.group(1))
        else:
            return "Driver Not Detecting"

        # Extract Design Capacity
        design_capacity_match = re.search(r'DESIGN CAPACITY.*?(\d+)', data, re.DOTALL)
        if design_capacity_match:
            design_capacity = int(design_capacity_match.group(1))
        else:
            return "Driver Not Detecting"

        # Calculate battery health percentage
        if design_capacity > 0:
            health_percentage = (full_charge_capacity / design_capacity) * 100

            if health_percentage > 75:
                return "Healthy"
            elif 50 < health_percentage <= 75:
                return "Moderate"
            elif 0 < health_percentage <= 50:
                return "Poor"
            elif health_percentage == 0:
                return "0%-50%"
        else:
            return "Driver Not Detecting"
    except Exception as e:
        return "Driver Not Detecting"

    return "Unknown"


# Facial Recognition


def get_facial_recognition_status():
    if platform.system() == "Windows":
        try:
            # Run PowerShell command to check for facial recognition capabilities
            result = subprocess.run(
                ['powershell', '-Command', 'Get-WmiObject -Namespace "root\CIMv2\mdm\dmmap" -Class MDM_DevDetail_Ext01 | Select-Object -ExpandProperty DevID_FaceRecognition'],
                capture_output=True, text=True
            )
            facial_recognition_status = result.stdout.strip()

            if not facial_recognition_status:
                return "Not Available"

            # Check if facial recognition is working or has issues
            # Placeholder logic: You would replace this with actual checks for status
            if "WORKING_PROPERLY" in facial_recognition_status.upper():
                return "Working"
            elif "NOT_WORKING" in facial_recognition_status.upper():
                return "Not working"
            elif "NOT_WORKING_PROPERLY" in facial_recognition_status.upper():
                return "Not working properly"
            else:
                return "Not Available"
        
        except Exception as e:
            return f"Error: {str(e)}"
    else:
        return "Manual Check Required"


# Fingerprint

def get_fingerprint_status():
    if platform.system() == "Windows":
        try:
            # Run PowerShell command to check for fingerprint sensor
            result = subprocess.run(
                ['powershell', '-Command', 'Get-PnpDevice -Class "Biometric" | Select-Object -ExpandProperty Status'],
                capture_output=True, text=True
            )
            fingerprint_status = result.stdout.strip()

            if not fingerprint_status:
                return "Not Available"

            # Determine the status based on the output
            if "OK" in fingerprint_status.upper():
                return "Working"
            elif "ERROR" in fingerprint_status.upper():
                return "Driver Not Detecting"
            elif "LOW_SENSITIVITY" in fingerprint_status.upper():  # Assuming we detect this kind of status
                return "Low sensitivity"
            else:
                return "Driver Not Detecting"  # General fallback for any errors
        
        except Exception as e:
            return f"Error: {str(e)}"
    else:
        return "Manual Check Required"



# Wifi

def get_wifi_signal_strength():
    if platform.system() == "Windows":
        command = 'netsh wlan show interfaces'
        output = run_command(command)
        
        # Extract the signal strength
        signal_strength_match = re.search(r'Signal\s*:\s*(\d+)%', output)
        if signal_strength_match:
            signal_strength = int(signal_strength_match.group(1))
            
            if signal_strength >= 75:
                return "Strong Signal"
            elif 50 <= signal_strength < 75:
                return "Normal"
            elif 25 <= signal_strength < 50:
                return "Weak Signal"
            elif signal_strength < 25:
                return "Low (Wifi)"
            else:
                return "No Signal"
        else:
            return "Not Found"
    else:
        return "Manual Check Required"
    
# Processor

def get_processor_type():
    if platform.system() == "Windows":
        # Command to get the processor name
        command = 'wmic cpu get name'
        output = run_command(command)

        # Search for i3, i5, i7, i9 in the processor name
        if re.search(r'\bi3\b', output, re.IGNORECASE):
            return "i3"
        elif re.search(r'\bi5\b', output, re.IGNORECASE):
            return "i5"
        elif re.search(r'\bi7\b', output, re.IGNORECASE):
            return "i7"
        elif re.search(r'\bi9\b', output, re.IGNORECASE):
            return "i9"
        else:
            return "Others"
    else:
        return "Manual Check Required"
    
# Ethernet Port
    
def get_ethernet_port_status():
    if platform.system() == "Windows":
        # Fetch network interfaces and their statuses
        interfaces = psutil.net_if_stats()
        ethernet_found = False
        for iface_name, iface_info in interfaces.items():
            if "Ethernet" in iface_name or "eth" in iface_name.lower():
                ethernet_found = True
                if iface_info.isup:
                    return "Working"
                else:
                    return "Not working"
        if not ethernet_found:
            return "Driver Not Detecting"
    else:
        return "Manual Check Required"

# BIOS Update

def get_bios_update_status():
    if platform.system() == "Windows":
        try:
            # Running the Windows Update command for BIOS updates
            result = subprocess.run(
                ['powershell', '-Command', 'Get-WmiObject -Class Win32_BIOS | Select-Object -ExpandProperty SMBIOSBIOSVersion'],
                capture_output=True, text=True
            )
            bios_version = result.stdout.strip()
            
            if not bios_version:
                return "Not Updating"
            
            # For simplicity, check if the BIOS version ends with 'PENDING' as a placeholder
            # Replace this logic with the actual comparison with the latest version
            if "PENDING" in bios_version.upper():
                return "Updates Pending"
            else:
                return "Updated"
        
        except Exception as e:
            return f"Error: {str(e)}"
    else:
        return "Manual Check Required"


# OS VERSION

def get_os_version():
    system = platform.system()
    if system == "Windows":
        version = platform.version()
        if "10" in version:
            return "Windows 10"
        elif "11" in version:
            return "Windows 11"
        else:
            return "Unknown Windows Version"
    elif system == "Darwin":
        return "IOS"
    else:
        return "Unknown OS"



# Fetching Details for Bluetooth->

def get_bluetooth_status():
    if platform.system() == "Windows":
        # PowerShell command to get Bluetooth device status
        command = (
            "powershell -Command \""
            "Get-WmiObject Win32_PnPEntity | "
            "Where-Object { $_.Caption -match 'Bluetooth' } | "
            "Select-Object -Property Caption, Status\""
        )
        output = run_command(command)
        
        if "Functional" in output:
            return "Functional"
        elif "OK" in output:
            return "Functional"
        elif "Problem" in output:
            return "Partially Functional"
        elif "Non-Functional" in output:
            return "Non-Functional"
        elif "Driver" in output:
            return "Driver Not Detecting"
        else:
            return "Driver Not Detecting"
    else:
        return "Manual Check Required"
    
# for Window_Genuine

def get_windows_genuine_status():
    if platform.system() == "Windows":
        # Use WMIC to get the license status
        license_status_command = 'wmic path SoftwareLicensingProduct where "PartialProductKey is not null" get LicenseStatus'
        genuine_status_command = 'wmic path SoftwareLicensingService get OA3xOriginalProductKey'
    else:
        return "Manual Check Required"

    # Fetch license status
    license_output = run_command(license_status_command).strip()
    genuine_output = run_command(genuine_status_command).strip()

    # Analyze the license status output
    if "1" in license_output:
        activation_status = "Activated"
    elif "0" in license_output:
        activation_status = "Not Activated"
    else:
        activation_status = "Unknown"

    # Analyze the genuine status output
    if "OA3xOriginalProductKey" in genuine_output:
        if activation_status == "Activated":
            return "Genuine"
        else:
            return activation_status
    else:
        return "Non-Genuine" if activation_status == "Activated" else activation_status

    return activation_status
    

# Boot Priority

def get_boot_priority():
    if platform.system() == "Windows":
        # Command to list boot entries
        command = 'bcdedit /enum firmware'
        output = run_command(command)

        # Checking for specific boot device indications
        if "bootdevice" in output:
            if "Partition" in output or "HD" in output:
                return "SSD"
            elif "Network" in output or "Lan" in output:
                return "LAN"
        else:
            return "Unknown"  # When neither LAN nor SSD is clearly indicated
    else:
        return "Manual Check Required"

# For Screen Resolution

def get_screen_resolution():
    if platform.system() == "Windows":
        command = 'wmic path Win32_VideoController get VideoModeDescription'
    elif platform.system() == "Darwin":
        command = 'system_profiler SPDisplaysDataType | grep Resolution'
    else:
        return "Manual Check Required"
    output = run_command(command)

    # Extract resolution using regex
    resolution_match = re.search(r'(\d{3,4})\s*x\s*(\d{3,4})', output)
    if resolution_match:
        width = int(resolution_match.group(1))

        # Determine resolution category
        if width >= 1920:
            return "High"
        elif 1280 <= width < 1920:
            return "Medium"
        else:
            return "Low"
    else:
        return "Manual Check Required"

# For RAM

def get_ram():
    if platform.system() == "Windows":
        command = 'wmic memorychip get capacity'
    elif platform.system() == "Darwin":
        command = 'system_profiler SPHardwareDataType | grep "Memory:"'
    else:
        return "Manual Check Required"
    
    output = run_command(command)
    
    if platform.system() == "Windows":
        # Convert each memory module's capacity from bytes to GB
        capacities = [int(line.strip()) for line in output.splitlines() if line.strip().isdigit()]
        total_gb = sum(capacity / (1024 ** 3) for capacity in capacities)  # Convert to GB and sum up
        return f"{total_gb:.0f}GB"
    
    return output

# Storage Type

def get_storage_type():
    if platform.system() == "Windows":
        command = 'wmic diskdrive get mediaType'
    elif platform.system() == "Darwin":
        command = 'system_profiler SPStorageDataType | grep "Medium Type"'
    else:
        return "Manual Check Required"
    
    output = run_command(command).strip().lower()

    # Mapping common media type descriptions to the required categories
    if "fixed hard disk media" in output or "hard disk drive" in output:
        return "HDD"
    elif "solid state drive" in output or "ssd" in output:
        return "SSD (Solid State Drive)"
    elif "m.2" in output:
        return "M.2 SSD"
    elif "sata" in output:
        return "SATA SSD"
    elif "emmc" in output:
        return "eMMC"
    elif not output:  # If the output is empty or NA
        return "NA"
    else:
        return "Others"

# Touch Screen

def check_touch_screen():
    if platform.system() == "Windows":
        # Check for touch-enabled devices using Win32_TouchScreen class
        command = 'powershell -Command "Get-PnpDevice | Where-Object { $_.Class -eq \\"HIDClass\\" -and $_.FriendlyName -like \\"*touch screen*\\" }"'
        output = run_command(command)
        return "Touch Screen Available" if output else "Not Available"
    else:
        return "Manual Check Required"


# BIOS Update

def get_bios_update():
    if platform.system() == "Windows":
        command = 'wmic bios get smbiosbiosversion'
    elif platform.system() == "Darwin":
        command = 'system_profiler SPHardwareDataType | grep "Boot ROM Version"'
    else:
        return "Manual Check Required"
    return run_command(command)

# Monitor Battery Drop

def monitor_battery_drop(duration=5, threshold=2):
    """
    Monitors battery level over a period (in seconds) and checks if the drop exceeds a given threshold (percentage).
    """
    if not psutil.sensors_battery():
        return "No battery information available"
    
    initial_battery = psutil.sensors_battery().percent
    time.sleep(duration)
    final_battery = psutil.sensors_battery().percent
    
    drop = initial_battery - final_battery
    
    if drop >= threshold:
        return "Yes"
    else:
        return "No"


# Display Type / resolution

def get_display_type():
    if platform.system() == "Windows":
        command = 'wmic path Win32_VideoController get VideoModeDescription'
    elif platform.system() == "Darwin":
        command = 'system_profiler SPDisplaysDataType | grep Resolution'
    else:
        return "Manual Check Required"
    
    output = run_command(command).strip()

    # Extracting resolution from the output
    resolution_match = re.search(r"(\d+) x (\d+)", output)
    if resolution_match:
        width = int(resolution_match.group(1))
        height = int(resolution_match.group(2))

        # Categorizing based on resolution
        if width >= 1920 and height >= 1080:
            return "FHD"
        elif width >= 1280 and height >= 720:
            return "HD"
        else:
            return "Normal"
    else:
        return "Manual Check Required"


# Windows Updates

def get_windows_update_status():
    if platform.system() == "Windows":
        # This command checks for pending updates
        command = 'wmic qfe get HotFixID'
    else:
        return "Manual Check Required"

    output = run_command(command).strip()
    
    # Check if there are updates listed
    if "No Instance(s) Available." in output:
        return "Updated"
    else:
        return "Pending Updates"

