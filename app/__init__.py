import os
from flask import Flask
from dotenv import load_dotenv
from flask import Flask, render_template

load_dotenv()

def create_app():
    app = Flask(
        __name__,
        template_folder='templates',
        static_folder='static'
    )

    # Secret key segura via .env
    app.secret_key = os.getenv('SECRET_KEY', 'alfa_cursos_secret')

    # Headers de segurança
    @app.after_request
    def security_headers(response):
        response.headers['X-Frame-Options']        = 'SAMEORIGIN'
        response.headers['X-Content-Type-Options']  = 'nosniff'
        response.headers['X-XSS-Protection']        = '1; mode=block'
        response.headers['Referrer-Policy']          = 'strict-origin-when-cross-origin'
        return response

    # Blueprints
    from app.routes.home   import home_bp
    from app.routes.cursos import cursos_bp

    app.register_blueprint(home_bp)
    app.register_blueprint(cursos_bp)

    @app.errorhandler(404)
    def pagina_nao_encontrada(e):
        return render_template('404.html'), 404

    @app.errorhandler(500)
    def erro_interno(e):
        return render_template('500.html'), 500

    return app