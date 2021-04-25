import plotly.graph_objects as go
from plotly.colors import n_colors
import dash
import dash_table
import numpy as np
import pandas as pd
import sys

data = pd.read_json(sys.argv[1])
dataf = pd.DataFrame(data)
dataf["table"] = dataf["table"].apply(lambda a: ", ".join(a) if a != "None" else None)

columns = dataf.columns

color = []

color = dataf["late_errors"].apply(lambda a: "red" if len(a) != 0 else "lightgreen")
colors = n_colors('rgb(255, 200, 200)', 'rgb(200, 0, 0)', 9, colortype='rgb')

app = dash.Dash(__name__)
app.layout = dash_table.DataTable(
    style_cell={
	'whiteSpace': 'normal',
	'height': 'auto',
    },
    columns=[{'id': c, 'name': c} for c in dataf.columns],
    data=dataf.to_dict('records'),
    style_data_conditional=[{
	'if': {
	    'column_id': 'late_errors',
	    'row_index': i
	},
	'backgroundColor': color[i],
	'color':'white'
    } for i in range(len(color.to_list()))],
)
if __name__ == "__main__":
    app.run_server(debug=True)


