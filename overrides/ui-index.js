$(document).ready(() => {
    const errorId = 'weather_error';

    function ensureErrorBox() {
        let box = $('#' + errorId);
        if (!box.length) {
            box = $('<div>', {
                id: errorId,
                class: 'alert alert-danger',
                hidden: true
            });
            $('.container').first().append($('<div style="height: 15px"></div>'));
            $('.container').first().append(box);
        }
        return box;
    }

    function renderError(message) {
        const box = ensureErrorBox();
        $('#result').hide();
        box.text(message || 'Weather data is unavailable right now.').show();
    }

    function renderWeather(result) {
        ensureErrorBox().hide();
        $('#result').show();
        $('#weather_icon').attr('src', 'https://' + result.current.condition.icon);
        $('#weather_text').html(result.current.condition.text);
        $('#city_name').html(result.location.name);
        $('#country_name').html(result.location.country);
        $('#temp').html(result.current.temp_c + '&deg;C&nbsp;-&nbsp;' + result.current.temp_f + '&deg;F');
        $('#feels_like').html(result.current.feelslike_c + '&deg;C&nbsp;-&nbsp;' + result.current.feelslike_f + '&deg;F');
    }

    function normalizeResponse(res) {
        if (typeof res === 'string') {
            try {
                return JSON.parse(res);
            } catch (e) {
                return { message: res };
            }
        }
        return res;
    }

    function getWeather(city) {
        $.ajax({
            type: 'get',
            url: '/weather/' + encodeURIComponent(city),
            success: function (res) {
                const result = normalizeResponse(res);

                if (result && result.message) {
                    renderError(result.message);
                    return;
                }

                if (!result || !result.current || !result.location || !result.current.condition) {
                    renderError('Unexpected weather response from the backend.');
                    return;
                }

                renderWeather(result);
            },
            error: function (xhr) {
                const payload = normalizeResponse(xhr.responseJSON || xhr.responseText || '');
                renderError(payload.message || 'Request failed while fetching weather data.');
            }
        });
    }

    $('#go').click(() => {
        getWeather($('#city').val());
    });

    $('#city').keypress(function (event) {
        const keycode = event.keyCode ? event.keyCode : event.which;
        if (keycode == '13') {
            getWeather($('#city').val());
        }
    });
});
