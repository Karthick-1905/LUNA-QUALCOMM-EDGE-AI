# LUNA - Project Setup Guide


## Prerequisites
Ensure you have the following installed before proceeding with the setup.

### System Requirements
- Operating System: Windows 10+ (primary), macOS 12+, or Ubuntu 20.04+
- RAM: Minimum 8 GB, Recommended 16 GB
- Storage: 10 GB free space
- GPU: Qualcomm AI-compatible hardware 

### Required Software
- Python 3.10
- Node.js 16+ and npm
- Git
- ffmpeg

## Installation Steps

### 1. Clone the Repository
```bash
https://github.com/SuryaNarayanaa/LUNA-QUALCOMM-EDGE-AI.git
```

### 2. Python Environment Setup
```bash
# Create virtual environment
python -m venv luna_env

# Activate virtual environment
# Windows
luna_env\Scripts\activate
# macOS/Linux
source luna_env/bin/activate
```

### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 4. Node.js Dependencies for frontend
```bash
npm install
```

### 5. Environment Configuration
Create a `config.yaml` file in the root directory and fill the Hugging_face with hf token to access private models.

### 6. To set up Sarvam model:

Connecting to WiFi
Before proceeding with the SDK setup, connect to the designated WiFi network. You MUST be on the event wifi to access the Sarvam model.

Open WiFi settings on your device.
Locate the network named "Workshop[number]_5G".
Enter the provided credentials.
Ensure internet access is available.
And include the file
 `imagine_sdk-0.4.2-py3-none-any.whl`


## Verification



### Start the Application
```bash
# Start the main application
python main.py

# Or start development server
python app.py --dev
```

### Expected Output
- Application should start without errors
- You should see initialization logs
- API endpoints should be accessible 
- Model loading should complete successfully



## Development Workflow

### Running in Development Mode
```bash
# Activate environment
luna_env\Scripts\activate  # Windows
# or
source luna_env/bin/activate  # macOS/Linux

# Start with hot reload
python app.py --reload --debug
```

### Making Changes
1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests: `python -m pytest`
4. Commit changes: `git commit -m "Add feature"`
5. Push and create pull request