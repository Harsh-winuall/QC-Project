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

nltk.download('punkt')
nltk.download('stopwords')

app = Flask(__name__)

@app.route('/api/summary', methods=['POST'])
def get_system_info():
    data = {}
    data["Windows_Mac_Update"] = platform.platform()
    data["sfc_scannow"] = check_sfc_scannow()
    data["Hardware_diagnostic_Test"] = "To be done manually"
    data["Window_Genuine"] = is_windows_genuine()
    data["Battery_Health"] = psutil.sensors_battery().percent if psutil.sensors_battery() else "No battery info"
    data["Wifi"] = run_command("netsh wlan show interfaces") if platform.system() == "Windows" else "Use os specific command"
    data["Bluetooth"] = check_bluetooth_windows() if platform.system() == "Windows" else check_bluetooth_mac()
    data["Keypad_light"] = "Manual check required"
    data["Trackpad"] = "Manual check required"
    data["Speaker"] = "Manual check required"
    data["SSD_Health"] = format_disk_usage(psutil.disk_usage('/'))
    data["USB_Port"] = "Manual check required"
    data["HDMI_Port"] = "Manual check required"
    data["Earphone_port"] = "Manual check required"
    data["Charging_port"] = "Manual check required"
    data["Charging"] = psutil.sensors_battery().power_plugged if psutil.sensors_battery() else "No information of Charging"
    data["Processor"] = platform.processor()
    data["Generation"] = platform.release()
    data["Keyboard"] = "Manual check required"
    data["CMOS_battery"] = "Manual check required"
    data["Boot_Priority"] = check_boot_priority()
    data["Fan_sound"] = "Manual check required"
    data["Bios_Password"] = "Manual check required"
    data["Lid_Sensor"] = "Manual check required"
    data["OS_VERSION"] = platform.version()
    data["Type_C_ports"] = "Manual check required"
    data["Ethernet_port"] = run_command("ipconfig /all") if platform.system() == "Windows" else "Use os specific command"
    data["BIOS_update"] = get_bios_update()
    data["Trackball"] = "Manual check required"
    data["Camera"] = "Manual check required"
    data["Mic"] = "Manual check required"
    data["SYS_TEMP"] = get_cpu_temp()
    data["Device_Manager"] = run_command("devmgmt.msc") if platform.system() == "Windows" else "Not applicable"
    data["Fingerprint"] = "Manual check required"
    data["Facial_recognition"] = "Manual check required"
    data["Hotkeys_Special_Characters"] = "Manual check required"
    data["Battery_sudden_Drop"] = monitor_battery_drop()
    data["Battery_Backup_(in minutes)"] = psutil.sensors_battery().secsleft / 60 if psutil.sensors_battery() else "No battery info"
    data["Resolution"] = get_screen_resolution()
    data["RAM"] = get_ram()
    data["Storage Type"] = get_storage_type()
    data["Touch Screen"] = check_touch_screen()
    return jsonify(data)

# Formatting the SSD_Healt details into a String
def format_disk_usage(disk_usage):
    return f"Total: {disk_usage.total // (1024 ** 3)} GB, Used: {disk_usage.used // (1024 ** 3)} GB, Free: {disk_usage.free // (1024 ** 3)} GB"


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
    
# Checking for sfc_scannow 
def check_sfc_scannow():
    """Runs sfc /scannow and handles possible errors."""
    command = "sfc /scannow"
    output = run_command(command)
    
    if "Windows Resource Protection did not find any integrity violations." in output:
        return "SFC scan completed successfully. No issues found."
    elif "Windows Resource Protection found corrupt files and successfully repaired them." in output:
        return "SFC scan completed. Issues were found and repaired."
    elif "Windows Resource Protection found corrupt files but was unable to fix some of them." in output:
        return "SFC scan completed. Some issues were found but could not be repaired."
    else:
        return f"Unexpected output or error: {output}"
    
# Fetching Syetm Temperature

def get_cpu_temp_mac():
    """Fetches the CPU temperature on macOS."""
    try:
        temp = subprocess.check_output(["osx-cpu-temp"], text=True).strip()
        return temp
    except subprocess.CalledProcessError as e:
        return f"Command error: {str(e)}"
    except Exception as e:
        return f"Error: {str(e)}"

def get_cpu_temp():
    """Fetches the CPU temperature based on the operating system."""
    if platform.system() == "Darwin":  # macOS
        return get_cpu_temp_mac()
    else:
        return "Temperature data not available for this OS"



# Fetching Details for Bluetooth->

#For Windows
import subprocess

def check_bluetooth_windows():
    """Checks if Bluetooth is working on Windows."""
    command = 'Get-PnpDevice -Class Bluetooth'
    try:
        result = subprocess.run(['powershell', '-Command', command], capture_output=True, text=True, check=True)
        output = result.stdout.strip()
        if 'Bluetooth' in output:
            return "Bluetooth is enabled and working."
        else:
            return "No Bluetooth devices found or Bluetooth is not working."
    except subprocess.CalledProcessError as e:
        return f"Command error: {str(e)}"
    except Exception as e:
        return f"Error: {str(e)}"

    
#For macOS
def check_bluetooth_mac():
    """Checks if Bluetooth is working on macOS."""
    command = 'system_profiler SPBluetoothDataType'
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, check=True)
        output = result.stdout.strip()
        if 'Bluetooth' in output:
            return "Bluetooth is enabled and working."
        else:
            return "No Bluetooth information found or Bluetooth is not working."
    except subprocess.CalledProcessError as e:
        return f"Command error: {str(e)}"
    except Exception as e:
        return f"Error: {str(e)}"
    
# for Window_Genuine

def is_windows_genuine():
    try:
        # Run the slmgr /xpr command
        result = run_command("slmgr /xpr")

        # Print the raw output
        print("Raw output:", result.stdout)
        
        # Check the output
        if "The machine is permanently activated" in result.stdout:
            return "Windows is genuine and permanently activated."
        elif "This machine is in Notification mode" in result.stdout:
            return "Windows is not activated."
        else:
            return f"Displayed"
    except Exception as e:
        return str(e)
    

# Boot Priority

def check_boot_priority():
    """Checks the boot priority configuration on Windows using bcdedit."""
    command = "bcdedit /enum"
    output = run_command(command)
    
    # Check if the command output contains 'Windows Boot Manager' or 'Windows Boot Loader'
    if "Windows Boot Manager" in output and "Windows Boot Loader" in output:
        return "Boot priority check passed. Boot configuration details:\n" + output
    elif "Access is denied" in output:
        return "Boot priority check failed. Access is denied. Please run as administrator."
    else:
        return f"Boot priority check failed or could not retrieve boot configuration. Output: {output} or Run as an Administrator"


# For Screen Resolution

def get_screen_resolution():
    if platform.system() == "Windows":
        command = 'wmic path Win32_VideoController get VideoModeDescription'
    elif platform.system() == "Darwin":
        command = 'system_profiler SPDisplaysDataType | grep Resolution'
    else:
        return "Manual Check Required"
    return run_command(command)

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
        return f"Total RAM: {total_gb:.2f} GB"
    
    return output

# Storage Type

def get_storage_type():
    if platform.system() == "Windows":
        command = 'wmic diskdrive get mediaType'
    elif platform.system() == "Darwin":
        command = 'system_profiler SPStorageDataType | grep "Medium Type"'
    else:
        return "Manual Check Required"
    return run_command(command)

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

def monitor_battery_drop(duration=120, threshold=2):
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
        return f"Battery drop detected: {drop}% drop over {duration} seconds"
    else:
        return f"No significant battery drop detected: {drop}% drop over {duration} seconds"



