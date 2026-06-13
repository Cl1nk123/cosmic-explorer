from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', title='Главная', active_page='index')

@app.route('/mars')
def mars():
    return render_template('mars.html', title='Марс', active_page='mars')

@app.route('/jupiter')
def jupiter():
    return render_template('jupiter.html', title='Юпитер', active_page='jupiter')

@app.route('/saturn')
def saturn():
    return render_template('saturn.html', title='Сатурн', active_page='saturn')

@app.route('/glossary')
def glossary():
    return render_template('glossary.html', title='Глоссарий', active_page='glossary')

@app.route('/about')
def about():
    return render_template('about.html', title='Об авторе', active_page='about')

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
