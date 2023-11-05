## Setup

Create virtual environment

- Easiest to use VSCode built-in conda env creator, choose python 3.8. Alternatively:
- ``conda create --prefix ./.conda python=3.8``

Activate virtual environment

- ``conda activate <env path>/.conda``
- Remember to also "Select Interpreter" on VSCode

Install PyTorch

- ``conda install pytorch::pytorch torchvision torchaudio -c pytorch``

Go to app directory

- ``cd app``

Install dependencies

- ``pip install -r requirements.txt``

Input OpenAI API key (``app.py`` line 26)

- ``openai.api_key = "<api key>"``


## Running the app

### Development

Prepare appropriate package.json

- For local dev, 
  - rename `package.json` to `package-original.json`
  - rename `package-local.json` to `package.json`
- For github pages, remember to do the reverse. 

Build frontend

- ``npm run build``

Run app using vanilla python (not recommended)

- ``python app.py``

Run app using flask debug mode

- ``python -m flask --app app.py --debug run``

Run app using gunicorn with debug mode (❌ not tested)

- ``gunicorn app:app --log-level=debug``

### Production(ish)

Run app using gunicorn with 4 workers (❌ not tested)

- ``gunicorn app:app --workers=4``
