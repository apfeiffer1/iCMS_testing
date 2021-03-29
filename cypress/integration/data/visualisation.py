import plotly.graph_objects as go
from plotly.colors import n_colors
import numpy as np
import pandas as pd

data1 = pd.read_json("./test.json")
dataf = pd.DataFrame(data1)
dataf["table"] = dataf["table"].apply(lambda a: ", <br>".join(a) if a != "None" else None)
dataf["url"] = dataf["url"].apply(lambda a: "/tools/<br>".join(a.split("/tools/")))

columns = dataf.columns

color = [[], [], [], [], [], []]

color[4] = dataf["late_errors"].apply(lambda a: "red" if len(a) != 0 else "lightgreen")
color[0] = color[1] = color[2] = color[3] = color[5] = ["white"]*34

# colors = n_colors('rgb(255, 200, 200)', 'rgb(200, 0, 0)', 9, colortype='rgb')

fig = go.Figure(data=[go.Table(
  header=dict(
    values=columns,
    align=['left'],
    line_color='black', fill_color='white',
    font=dict(color='black'),
    height=30
  ),
  cells=dict(
    values=dataf.values.T,
    line_color="black",
    fill_color=color,
    font=dict(color='black'),
    align=['left'],
    height=60,
    font_size=11,
    ))
])

fig.show()
