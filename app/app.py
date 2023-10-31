from flask import Flask, send_from_directory, url_for
from flask_cors import CORS #comment this on deployment
from flask_restful import reqparse
import pandas as pd
import io
from umap import UMAP
import hdbscan
import numpy as np

import torch
import torch.nn as nn
from torch.nn.functional import relu
import torch.optim as optim

import openai
import json
import random
import re
from rake_nltk import Metric, Rake
import ssl
import os
import openai
openai.organization = "org-B5R2RX56FUocWv2e067Vwaqh"
openai.api_key = "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"

try:
     _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
     pass
else:
    ssl._create_default_https_context = _create_unverified_https_context


# Simple neural network with one hidden layer
class TransformationNet(nn.Module):
        def __init__(self, input_size, output_size):
            super(TransformationNet, self).__init__()
            self.fc1 = nn.Linear(input_size, output_size)
        
        def forward(self, x):
            x = self.fc1(x)
            
            return x

# Hyperparameters
input_size = 768
output_size = 768
learning_rate = 0.01
num_epochs = 10000
weight_decay = 0.001  # L2 regularization strength

app = Flask(__name__, static_url_path='', static_folder='build')
cors = CORS(app)

# Serve home route
@app.route("/")
def home():
    return send_from_directory(app.static_folder, "index.html")
# Performs selected dimensionality reduction method (reductionMethod) on uploaded data (data), considering selected parameters (perplexity, selectedCol)
@app.route("/modify-embeddings", methods=["POST"])
def modify():

    parser = reqparse.RequestParser()
    parser.add_argument('data', type=str)
    parser.add_argument('theme', type=str)

    args = parser.parse_args()

    data = args['data']
    theme = args['theme']


    df = pd.read_csv('src/datasets/f_emb.csv')
    '''new_sim = np.zeros((10,10))
    prompt ="I am providing you with a two sentences. I want you to provide a similairty rating between 1 and 10 \
            that quantifies how much the similar or opposite the sentences are based on "+ theme+ " detected in the text. Only provide a score and nothing else. \
            Here are the two sentences: "
    


    n = 5
    ids = np.random.randint(0,len(df),n)
    scores = np.zeros((n,n))

    for i in range(n):
        for j in range(i):
        
            result = get_score(df['text'][ids[i]], df['text'][ids[j]], prompt, theme)
        
            
            scores[i,j] = result

    scores = np.tril(scores).T+np.tril(scores)
    np.fill_diagonal(scores, 10)

    transformed = learn_transformation(scores,df,ids)

    umap = UMAP(n_components=2, n_neighbors=10,min_dist=0)
    embedding = umap.fit_transform(transformed,)
    df_mod = pd.DataFrame(embedding)
    df_mod['text'] = df['text']'''

    return df.to_json(orient="split")


def get_score(text1, text2, prompt, theme):
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert in comparing sentences based on "+ theme+"."},
            {"role": "user", "content": prompt +text1 +', '+text2},
        ]
    )
    
    print(response["choices"][0]["message"]["content"])
    
    try:
        result = json.loads(response["choices"][0]["message"]["content"])
    except:
        result = []
    
    return result

def learn_transformation(scores, df, ids):
    
    print('hello', num_epochs)
    # Initialize network and optimizer with weight_decay for L2 regularization
    net = TransformationNet(input_size, output_size)
    optimizer = optim.Adam(net.parameters(), lr=learning_rate, weight_decay=weight_decay)
    criterion = nn.MSELoss()

    target_matrix = torch.tensor(scores).float()
    # Training
    for epoch in range(num_epochs):
        # Flatten the source matrix and pass it through the network
        outputs = net(torch.tensor(df.iloc[ids,:-1].to_numpy()).float())
        loss = criterion(outputs@outputs.T, target_matrix)
        
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if (epoch + 1) % 2000 == 0:
            print(f'Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}')

        transformed = net(torch.tensor(df.iloc[:,:-1].to_numpy()).float()).detach().numpy()

        return transformed









if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=8000)