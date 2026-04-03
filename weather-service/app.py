import os

import requests
from flask import Flask, jsonify


app = Flask(__name__)
BASE_URL = "https://api.weatherapi.com/v1/current.json"
TIMEOUT_SECONDS = 10


def build_error(message, status=502):
    return jsonify({"message": message}), status


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/<path:city>")
def get_weather(city):
    api_key = os.getenv("APIKEY", "").strip()
    if not api_key:
        return build_error("Weather API key is not configured.", 500)

    try:
        response = requests.get(
            BASE_URL,
            params={"key": api_key, "q": city},
            timeout=TIMEOUT_SECONDS,
        )
    except requests.RequestException:
        return build_error("Unable to reach the weather provider right now.")

    try:
        payload = response.json()
    except ValueError:
        return build_error("Weather provider returned an invalid response.")

    if response.ok:
        return jsonify(payload)

    error = payload.get("error", {}) if isinstance(payload, dict) else {}
    message = error.get("message") or "Weather provider rejected the request."
    status = response.status_code if response.status_code >= 400 else 502
    return build_error(message, status)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
