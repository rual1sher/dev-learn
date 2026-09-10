// База вопросов для интерактивной Блиц-Ленты (Junior / Middle / Senior)
export const BLITZ_QUESTIONS = [
  {
    cat: 'node',
    s: 'process.nextTick() выполняется раньше, чем коллбэки из setImmediate().',
    s_uz: 'process.nextTick() setImmediate() callback-laridan oldin bajariladi.',
    t: 1,
    p: 'Правда! nextTick() выполняется сразу в microtask queue, а setImmediate — в фазе Check.',
    p_uz: "To'g'ri! nextTick() darhol microtask navbatida ishlaydi, setImmediate esa Check fazasida."
  },
  {
    cat: 'node',
    s: 'EventEmitter.emit() по умолчанию вызывает слушателей асинхронно.',
    s_uz: 'EventEmitter.emit() odatda tinglovchilarni asinxron chaqiradi.',
    t: 0,
    p: 'Ложь! EventEmitter вызывает слушателей строго синхронно в порядке регистрации.',
    p_uz: "Noto'g'ri! EventEmitter tinglovchilarni ro'yxat tartibida qat'iy sinxron chaqiradi."
  },
  {
    cat: 'nest',
    s: 'Провайдеры (@Injectable) в NestJS по умолчанию создаются как Singleton на всё приложение.',
    s_uz: 'NestJS provayderlari (@Injectable) standart bo\'yicha butun ilovada Singleton sifatida yaratiladi.',
    t: 1,
    p: 'Правда! По умолчанию scope провайдера — DEFAULT (Singleton).',
    p_uz: "To'g'ri! Standart bo'yicha provayder scope-i — DEFAULT (Singleton)."
  },
  {
    cat: 'nest',
    s: 'Middleware в NestJS выполняется ПОСЛЕ Guards (гардов) и Interceptors.',
    s_uz: 'NestJS-da Middleware Guards (himoyachilar) va Interceptors-dan KEYIN ishlaydi.',
    t: 0,
    p: 'Ложь! Порядок: Middleware ➔ Guards ➔ Interceptors ➔ Pipes ➔ Handler.',
    p_uz: "Noto'g'ri! Tartib: Middleware ➔ Guards ➔ Interceptors ➔ Pipes ➔ Handler."
  },
  {
    cat: 'express',
    s: 'Error-handling middleware в Express ОБЯЗАН принимать ровно 4 аргумента: (err, req, res, next).',
    s_uz: 'Express-da Error-handling middleware aynan 4 ta argument qabul qilishi SHART: (err, req, res, next).',
    t: 1,
    p: 'Правда! Express проверяет fn.length === 4, иначе считает функцию обычным middleware.',
    p_uz: "To'g'ri! Express fn.length === 4 ekanini tekshiradi, aks holda uni oddiy middleware deb hisoblaydi."
  },
  {
    cat: 'react',
    s: 'В React 18 обновления состояния внутри setTimeout батчатся автоматически.',
    s_uz: 'React 18-da setTimeout ichidagi holat yangilanishlari (setState) avtomatik birlashadi (batching).',
    t: 1,
    p: 'Правда! Automatic Batching в React 18 объединяет setState везде, сокращая лишние рендеры.',
    p_uz: "To'g'ri! Automatic Batching har joyda keraksiz qayta renderlarni kamaytiradi."
  },
  {
    cat: 'react',
    s: 'Изменение ref.current в useRef вызывает повторный рендер компонента.',
    s_uz: 'useRef ichidagi ref.current qiymatini o\'zgartirish komponentni qayta render qiladi.',
    t: 0,
    p: 'Ложь! useRef мутирует объект без вызова рендера.',
    p_uz: "Noto'g'ri! useRef obyektni o'zgartiradi, ammo hech qachon re-render chaqirmaydi."
  },
  {
    cat: 'nginx',
    s: 'Директива upstream в Nginx используется для настройки балансировки нагрузки.',
    s_uz: 'Nginx-dagi upstream direktivasi yuklamani taqsimlash (load balancing) uchun ishlatiladi.',
    t: 1,
    p: 'Правда! В блоке upstream описывается пул серверов для распределения трафика.',
    p_uz: "To'g'ri! upstream blokida trafikni taqsimlash uchun serverlar to'plami yoziladi."
  },
  {
    cat: 'linux',
    s: 'Сигнал SIGKILL (kill -9) процесс может перехватить для корректного сохранения данных.',
    s_uz: 'Jarayon ma\'lumotlarni saqlab qolish uchun SIGKILL (kill -9) signalini tutib qolishi mumkin.',
    t: 0,
    p: 'Ложь! SIGKILL нельзя перехватить. Для graceful shutdown используют SIGTERM (15).',
    p_uz: "Noto'g'ri! SIGKILL-ni tutib bo'lmaydi. Graceful shutdown uchun SIGTERM (15) ishlatiladi."
  },
  {
    cat: 'english',
    s: 'Фраза "Let\'s table this discussion" означает "Давай обсудим это прямо сейчас за столом".',
    s_uz: '"Let\'s table this discussion" iborasi "Keling, buni hoziroq stol atrofida muhokama qilamiz" degan ma\'noni anglatadi.',
    t: 0,
    p: 'Ложь! В американском IT "to table" значит отложить тему на неопределенный срок.',
    p_uz: "Noto'g'ri! IT va biznesda \"to table\" mavzuni keyinga yoki noma'lum muddatga qoldirishni bildiradi."
  },
  {
    cat: 'english',
    s: 'Аббревиатура "LGTM" в ревью PR расшифровывается как "Looks Good To Me".',
    s_uz: 'PR sharhida (review) "LGTM" qisqartmasi "Looks Good To Me" degan ma\'noni bildiradi.',
    t: 1,
    p: 'Правда! Одобрено, замечаний нет.',
    p_uz: "To'g'ri! \"Hammasi a'lo, hech qanday e'tiroz yo'q\" degani."
  },
  {
    cat: 'js',
    s: 'typeof NaN в JavaScript возвращает строку "number".',
    s_uz: 'JavaScript-da typeof NaN "number" satrini qaytaradi.',
    t: 1,
    p: 'Правда! По спецификации IEEE 754 NaN классифицируется как числовой тип.',
    p_uz: "To'g'ri! IEEE 754 spetsifikatsiyasi bo'yicha NaN sonli turga kiradi."
  },
  {
    cat: 'js',
    s: 'Выражение 0.1 + 0.2 === 0.3 в JavaScript вернет true.',
    s_uz: 'JavaScript-da 0.1 + 0.2 === 0.3 ifodasi true qaytaradi.',
    t: 0,
    p: 'Ложь! Из-за погрешности чисел с плавающей точкой получается 0.30000000000000004.',
    p_uz: "Noto'g'ri! Suzuvchi vergulli sonlar xatoligi tufayli natija: 0.30000000000000004."
  },
  {
    cat: 'react',
    s: 'Хук useEffect выполняется синхронно до того, как браузер отрисует экран.',
    s_uz: 'useEffect hooki brauzer ekranni chizishidan oldin sinxron bajariladi.',
    t: 0,
    p: 'Ложь! useEffect асинхронен и выполняется ПОСЛЕ отрисовки. Синхронно работает useLayoutEffect.',
    p_uz: "Noto'g'ri! useEffect ekranni chizgandan KEYIN asinxron ishlaydi. useLayoutEffect esa sinxron."
  },
  {
    cat: 'ts',
    s: 'Оператор satisfies в TypeScript проверяет соответствие типу, сохраняя при этом точные типы литералов.',
    s_uz: 'TypeScript-dagi satisfies operatori literal turlarni yo\'qotmasdan turni tekshiradi.',
    t: 1,
    p: 'Правда! satisfies валидирует структуру, не приводя тип к общему (в отличие от "as").',
    p_uz: "To'g'ri! satisfies umumiy turga keltirmasdan tekshiradi (\"as\" dan farqli ravishda)."
  },
  {
    cat: 'node',
    s: 'Синхронный вызов fs.readFileSync() блокирует весь Event Loop в Node.js.',
    s_uz: 'fs.readFileSync() sinxron chaqiruvi Node.js-dagi butun Event Loop-ni to\'xtatib qo\'yadi.',
    t: 1,
    p: 'Правда! Синхронный I/O замораживает поток до завершения чтения с диска.',
    p_uz: "To'g'ri! Sinxron fayl o'qish diskdan o'qib bo'lguncha butun oqimni muzlatadi."
  },
  {
    cat: 'linux',
    s: 'Команда chmod 777 предоставляет права на чтение, запись и исполнение всем пользователям.',
    s_uz: 'chmod 777 buyrug\'i barcha foydalanuvchilarga o\'qish, yozish va ishga tushirish huquqini beradi.',
    t: 1,
    p: 'Правда! 7 = rwx (4+2+1) для владельца, группы и остальных пользователей.',
    p_uz: "To'g'ri! 7 = rwx (4+2+1) egasi, guruh va boshqalar uchun to'liq huquq beradi."
  },
  {
    cat: 'git',
    s: 'Команда git rebase сохраняет неизменными SHA-хэши перемещенных коммитов.',
    s_uz: 'git rebase buyrug\'i ko\'chirilgan commit-larning SHA-xeshlarini o\'zgartirmasdan saqlaydi.',
    t: 0,
    p: 'Ложь! Rebase создает абсолютно новые коммиты с новыми SHA-хэшами.',
    p_uz: "Noto'g'ri! Rebase yangi SHA-xeshlar bilan mutlaqo yangi commit-lar yaratadi."
  },
  {
    cat: 'db',
    s: 'Поле PRIMARY KEY в SQL таблицах может содержать значения NULL.',
    s_uz: 'SQL jadvallaridagi PRIMARY KEY ustunida NULL qiymatlar bo\'lishi mumkin.',
    t: 0,
    p: 'Ложь! Первичный ключ всегда строго уникален и NOT NULL.',
    p_uz: "Noto'g'ri! Birlamchi kalit doimo yagona va NOT NULL bo'lishi shart."
  },
  {
    cat: 'docker',
    s: 'Инструкция COPY в Dockerfile использует кэш, если исходные файлы не изменились.',
    s_uz: 'Dockerfile-dagi COPY ko\'rsatmasi manba fayllar o\'zgarmasa keshdan foydalanadi.',
    t: 1,
    p: 'Правда! Docker сравнивает контрольные суммы файлов для повторного использования слоев.',
    p_uz: "To'g'ri! Docker qatlamlarni qayta ishlatish uchun fayl nazorat summalarini solishtiradi."
  },
  {
    cat: 'db',
    s: 'Redis хранит все ключевые данные исключительно на диске и не использует RAM.',
    s_uz: 'Redis barcha ma\'lumotlarni faqat diskda saqlaydi va tezkor xotiradan (RAM) foydalanmaydi.',
    t: 0,
    p: 'Ложь! Redis — это in-memory база данных, хранящая данные в оперативной памяти.',
    p_uz: "Noto'g'ri! Redis — bu barcha ma'lumotlarni tezkor xotirada (RAM) saqlaydigan baza."
  },
  {
    cat: 'node',
    s: 'Метод HTTP PUT по спецификации RFC обязан быть идемпотентным.',
    s_uz: 'RFC spetsifikatsiyasi bo\'yicha HTTP PUT metodi idempotent bo\'lishi shart.',
    t: 1,
    p: 'Правда! Повторные одинаковые PUT-запросы дают тот же результат состояния сервера.',
    p_uz: "To'g'ri! Bir xil takroriy PUT so'rovlari server holatida bir xil natija berishi kerak."
  },
  {
    cat: 'node',
    s: 'HTTP статус 401 Unauthorized означает, что у авторизованного пользователя нет прав на ресурс.',
    s_uz: 'HTTP 401 Unauthorized kodi foydalanuvchida resursga kirish huquqi yetarli emasligini bildiradi.',
    t: 0,
    p: 'Ложь! 401 означает отсутствие аутентификации. Недостаток прав — это 403 Forbidden.',
    p_uz: "Noto'g'ri! 401 avtorizatsiya yo'qligini bildiradi. Huquq yetishmasligi esa 403 Forbidden."
  },
  {
    cat: 'js',
    s: 'Объявление переменной через const предотвращает мутацию свойств вложенного объекта.',
    s_uz: 'const orqali o\'zgaruvchi yaratish uning ichidagi obyekt xususiyatlarini o\'zgartirishni taqiqlaydi.',
    t: 0,
    p: 'Ложь! const запрещает только переприсваивание ссылки, свойства объекта мутировать можно.',
    p_uz: "Noto'g'ri! const faqat havola qayta yozilishini taqiqlaydi, obyekt xususiyatlarini o'zgartirish mumkin."
  },
  {
    cat: 'arch',
    s: 'Паттерн Circuit Breaker защищает микросервисную систему от каскадного падения при отказе зависимостей.',
    s_uz: 'Circuit Breaker andozasi mikroxizmatlar tizimini kaskadli qulashdan himoya qiladi.',
    t: 1,
    p: 'Правда! При частых ошибках цепь размыкается, не перегружая падающий сервис.',
    p_uz: "To'g'ri! Ko'p xatoliklarda ulanish uziladi va qulayotgan xizmat ortiqcha yuklanmaydi."
  },
  {
    cat: 'english',
    s: 'Фраза "Let\'s touch base" в переписке означает "Давайте созвонимся или сверим статус задач".',
    s_uz: 'Yozishmalardagi "Let\'s touch base" iborasi "Keling, gaplashib olaylik yoki holatni tekshiraylik" degan ma\'noni bildiradi.',
    t: 1,
    p: 'Правда! Популярная фраза в IT-командах для короткого созвона или апдейта.',
    p_uz: "To'g'ri! IT jamoalarida qisqa uchrashuv yoki holatni yangilash uchun mashhur ibora."
  },
  {
    cat: 'english',
    s: 'Слово "Nitpick" в ревью PR означает критический дефект, требующий немедленной блокировки мерджа.',
    s_uz: 'PR sharhidagi "Nitpick" so\'zi darhol mergeni to\'xtatishni talab qiluvchi xatoni bildiradi.',
    t: 0,
    p: 'Ложь! Nitpick — это мелкая придирка (к стилю, имени переменной), не блокирующая PR.',
    p_uz: "Noto'g'ri! Nitpick — bu mayda uslubiy eslatma bo'lib, PR-ni bloklamaydi."
  },
  {
    cat: 'ts',
    s: 'Тип "unknown" в TypeScript безопаснее, чем тип "any", так как требует сужения типа перед использованием.',
    s_uz: 'TypeScript-da "unknown" turi "any" ga qaraganda xavfsizroq, chunki ishlatishdan oldin turni tekshirishni talab qiladi.',
    t: 1,
    p: 'Правда! С "unknown" нельзя вызвать метод или прочитать свойство без явной проверки типа.',
    p_uz: "To'g'ri! \"unknown\" bilan turni tekshirmasdan turib metod yoki xususiyatni chaqirib bo'lmaydi."
  },
  {
    cat: 'nginx',
    s: 'Директива proxy_pass в Nginx передает входящие клиентские запросы на бэкенд сервер.',
    s_uz: 'Nginx-dagi proxy_pass direktivasi mijoz so\'rovlarini bekend serveriga yo\'naltiradi.',
    t: 1,
    p: 'Правда! Это фундаментальная директива для построения Reverse Proxy.',
    p_uz: "To'g'ri! Bu Reverse Proxy yaratish uchun eng asosiy direktiva hisoblanadi."
  },
  {
    cat: 'react',
    s: 'Хук useMemo гарантирует, что вычисленное значение никогда не будет пересчитано заново.',
    s_uz: 'useMemo hooki hisoblangan qiymat hech qachon qayta hisoblanmasligini 100% kafolatlaydi.',
    t: 0,
    p: 'Ложь! React оставляет за собой право очистить кэш памяти для оптимизации производительности.',
    p_uz: "Noto'g'ri! React xotirani optimallashtirish maqsadida keshni tozalash huquqini saqlab qoladi."
  }
];
