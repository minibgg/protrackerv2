'use strict'

// Базовое число SteamID64. Его вычитают, чтобы получить обычный account_id для OpenDota.
const STEAM_ID_64_BASE = 76561197960265728n;

// Находим поле ввода, куда пользователь пишет ID или ник.
const playerInput = document.getElementById('playerInput');
// Находим кнопку поиска.
const searchBtn = document.getElementById('searchBtn');

// Универсальная функция для запроса JSON по URL.
async function fetchJson(url) {
    // Отправляем запрос на сервер и ждём ответ.
    const response = await fetch(url);

    // Если сервер ответил ошибкой, останавливаем выполнение и кидаем ошибку.
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    // Если всё хорошо, превращаем ответ в JSON и возвращаем его.
    return response.json();
}

// Эта функция понимает, ввёл пользователь числовой ID или нет.
function normalizePlayerId(rawValue) {
    // Убираем лишние пробелы по краям строки.
    const value = rawValue.trim();

    // Если строка содержит не только цифры, это не ID. Скорее всего, это ник.
    if (!/^\d+$/.test(value)) {
        return null;
    }

    // Если длина 17 символов, вероятнее всего это SteamID64.
    if (value.length === 17) {
        // Превращаем строку в BigInt, потому что число слишком большое для обычного Number.
        const steamId64 = BigInt(value);

        // Проверяем, что число действительно похоже на SteamID64.
        if (steamId64 > STEAM_ID_64_BASE) {
            // Переводим SteamID64 в account_id OpenDota и возвращаем строкой.
            return String(steamId64 - STEAM_ID_64_BASE);
        }
    }

    // Если это просто числовой ID, возвращаем его без изменений.
    return value;
}

// Эта функция всегда должна вернуть корректный account_id.
async function resolvePlayerId(inputValue) {
    // Сначала пробуем распознать ввод как числовой ID.
    const normalizedId = normalizePlayerId(inputValue);

    // Если ID уже получен, сразу возвращаем его.
    if (normalizedId) {
        return normalizedId;
    }

    // Если это не число, считаем, что пользователь ввёл ник, и ищем его через OpenDota.
    const searchResults = await fetchJson(
        `https://api.opendota.com/api/search?q=${encodeURIComponent(inputValue.trim())}`
    );

    // Если ничего не найдено, вызываем ошибку.
    if (!Array.isArray(searchResults) || searchResults.length === 0) {
        throw new Error('Player not found');
    }

    // Берём первого найденного игрока и возвращаем его account_id.
    return String(searchResults[0].account_id);
}

// Эта функция отображает данные игрока на странице.
function renderPlayer(profileData, wlData) {
    // Для удобства достаём объект profile в отдельную переменную.
    const profile = profileData.profile;
    const mmr = profileData.computed_mmr ?? profileData.mmr_estimate?.estimate;

    // Показываем имя игрока. Если имени нет, выводим запасной текст.
    document.getElementById('playerName').textContent =
        profile?.personaname || 'Без имени';

    // Подставляем ссылку на аватар игрока.
    document.getElementById('avatar').src = profile?.avatarfull || '';
    // Устанавливаем alt-текст для картинки.
    document.getElementById('avatar').alt = profile?.personaname || 'avatar';

    // Показываем MMR. Если оценки нет, выводим запасной текст.
    document.getElementById('mmr').textContent =
        `MMR: ${mmr ?? 'нет данных'}`;

    // Берём количество побед. Если значения нет, ставим 0.
    const wins = wlData.win || 0;
    // Берём количество поражений. Если значения нет, ставим 0.
    const losses = wlData.lose || 0;
    // Считаем общее число матчей.
    const totalMatches = wins + losses;
    // Считаем винрейт в процентах. Если матчей нет, ставим 0.00.
    const winrate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(2) : '0.00';

    // Показываем общее число матчей.
    document.getElementById('matches').textContent = totalMatches;
    // Показываем число побед.
    document.getElementById('wins').textContent = wins;
    // Показываем винрейт.
    document.getElementById('winrate').textContent = `${winrate}%`;
}

// Главная функция поиска игрока.
async function searchPlayer() {
    // Берём текст из поля ввода и убираем пробелы по краям.
    const inputValue = playerInput.value.trim();

    // Если поле пустое, показываем предупреждение и выходим из функции.
    if (!inputValue) {
        alert('Введите Steam ID, SteamID64 или ник');
        return;
    }

    try {
        // Получаем корректный account_id из введённого значения.
        const playerId = await resolvePlayerId(inputValue);
        // Параллельно запрашиваем профиль игрока и статистику побед/поражений.
        const [profileData, wlData] = await Promise.all([
            fetchJson(`https://api.opendota.com/api/players/${playerId}`),
            fetchJson(`https://api.opendota.com/api/players/${playerId}/wl`)
        ]);

        // Если профиль не пришёл, считаем это ошибкой.
        if (!profileData.profile) {
            throw new Error('Profile data is empty');
        }

        // Если данные есть, выводим их на страницу.
        renderPlayer(profileData, wlData);
    } catch (error) {
        // Пишем ошибку в консоль браузера для отладки.
        console.error(error);
        // Показываем пользователю понятное сообщение.
        alert('Не удалось получить профиль. Проверьте ID или ник игрока.');
    }
}

// Когда пользователь нажимает на кнопку, запускаем поиск.
searchBtn.addEventListener('click', searchPlayer);

// Когда пользователь нажимает клавишу в поле ввода, проверяем какая это клавиша.
playerInput.addEventListener('keydown', (event) => {
    // Если нажата клавиша Enter, запускаем поиск.
    if (event.key === 'Enter') {
        searchPlayer();
    }
});
