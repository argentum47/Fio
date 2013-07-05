from flask import Flask, render_template, make_response
app = Flask(__name__)

@app.route('/')
def data_table():
   return make_response(open('templates/index.html').read())

if __name__ == '__main__':
    app.run()