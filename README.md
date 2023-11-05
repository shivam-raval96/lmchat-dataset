## Setup

### Create virtual environment
(best to use VSCode built-in conda env creator)

### Activate virtual environment
conda activate <env>

### Install pytorch
conda install pytorch::pytorch torchvision torchaudio -c pytorch

### Install dependencies
pip install -r requirements.txt

## Running the app

### Run app using vanilla python (not recommended)
python3 app.py 

### Run app using flask debug mode
python -m flask --app app.py --debug run

### Run app using gunicorn with debug mode
gunicorn app:app --log-level=debug (❌ not tested)

### Run app using gunicorn with 4 workers
gunicorn app:app --workers=4 (❌  not tested)
