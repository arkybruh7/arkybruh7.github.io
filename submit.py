import supabase as sb
import os
from dotenv import load_dotenv
from flask import Flask, request 

load_dotenv()
app = Flask(__name__)

from flask import render_template

@app.route("/")
def index():
    return render_template("create.html")

supabase = sb.create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
@app.route("/submit", methods=["POST"])
def submit():
    name = request.form["name"]
    username= request.form["username"]
    password = request.form["password"]

    supabase.table("admin_data").insert({"name":name , "username": username , "password": password}).execute()
    return "done"



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
